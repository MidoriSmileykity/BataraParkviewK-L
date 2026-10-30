'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { getAdminClient, STORAGE_BUCKET } from '@/lib/supabase/server-clients'
import { LETTER_SUBJECTS, MAX_BULLETIN_IMAGES, UPLOAD_RULES, type UploadKind } from '@/lib/upload-rules'

export type FormState = { ok: boolean; message: string; ts: number }

const ok = (message: string): FormState => ({ ok: true, message, ts: Date.now() })
const fail = (message: string): FormState => ({ ok: false, message, ts: Date.now() })

class ValidationError extends Error {}

function text(fd: FormData, key: string, { required = true, max = 500 } = {}) {
  const value = String(fd.get(key) ?? '').trim()
  if (required && !value) throw new ValidationError(`Kolom "${key}" wajib diisi.`)
  if (value.length > max) throw new ValidationError(`Kolom "${key}" maksimal ${max} karakter.`)
  return value
}

function optionalDate(fd: FormData, key: string) {
  const value = String(fd.get(key) ?? '').trim()
  if (!value) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new ValidationError('Format tanggal tidak valid.')
  return value
}

function getFiles(fd: FormData, key: string) {
  return fd.getAll(key).filter((f): f is File => f instanceof File && f.size > 0)
}

function validateFile(file: File, kind: UploadKind) {
  const rule = UPLOAD_RULES[kind]
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!(rule.mimeTypes as readonly string[]).includes(file.type) || !(rule.extensions as readonly string[]).includes(ext)) {
    throw new ValidationError(`File "${file.name}" tidak didukung. Gunakan ${rule.extensions.join(', ').toUpperCase()}.`)
  }
  if (file.size > rule.maxBytes) {
    throw new ValidationError(`File "${file.name}" melebihi batas ${rule.maxBytes / 1024 / 1024} MB.`)
  }
  return ext === 'jpeg' ? 'jpg' : ext
}

async function uploadFile(file: File, folder: string, kind: UploadKind) {
  const ext = validateFile(file, kind)
  const path = `${folder}/${randomUUID()}.${ext}`
  const storage = getAdminClient().storage.from(STORAGE_BUCKET)
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(`Upload gagal: ${error.message}`)
  return storage.getPublicUrl(path).data.publicUrl
}

async function removeFiles(urls: (string | null | undefined)[]) {
  const marker = `/object/public/${STORAGE_BUCKET}/`
  const paths = urls
    .filter((u): u is string => !!u && u.includes(marker))
    .map((u) => decodeURIComponent(u.split(marker)[1]))
  if (paths.length) await getAdminClient().storage.from(STORAGE_BUCKET).remove(paths)
}

async function run(fn: () => Promise<string>): Promise<FormState> {
  await requireAdmin()
  try {
    const message = await fn()
    revalidatePath('/')
    revalidatePath('/admin')
    return ok(message)
  } catch (e) {
    if (e instanceof ValidationError) return fail(e.message)
    console.error('[admin action]', e)
    return fail(e instanceof Error ? e.message : 'Terjadi kesalahan.')
  }
}

function dbCheck(error: { message: string } | null) {
  if (error) throw new Error(`Database error: ${error.message}`)
}

/* ---------- Surat RT ---------- */

export async function saveLetter(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = String(fd.get('id') ?? '')
    const subject = text(fd, 'subject')
    if (!(LETTER_SUBJECTS as readonly string[]).includes(subject)) throw new ValidationError('Perihal tidak valid.')

    const payload: Record<string, unknown> = {
      name: text(fd, 'name', { max: 200 }),
      number: text(fd, 'number', { max: 100 }),
      subject,
      origin: text(fd, 'origin', { max: 200 }),
      letter_date: optionalDate(fd, 'letter_date'),
      is_active: fd.get('is_active') === 'on',
    }

    const [file] = getFiles(fd, 'file')
    if (file) validateFile(file, 'pdf')

    if (id) {
      const { data: existing } = await db.from('letters').select('file_url').eq('id', id).single()
      if (file) {
        payload.file_url = await uploadFile(file, 'letters', 'pdf')
        await removeFiles([existing?.file_url])
      }
      const { error } = await db.from('letters').update(payload).eq('id', id)
      dbCheck(error)
      return 'Surat berhasil diperbarui.'
    }

    if (file) payload.file_url = await uploadFile(file, 'letters', 'pdf')
    const { error } = await db.from('letters').insert(payload)
    dbCheck(error)
    return 'Surat berhasil ditambahkan.'
  })
}

export async function deleteLetter(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = text(fd, 'id')
    const { data } = await db.from('letters').select('file_url').eq('id', id).single()
    const { error } = await db.from('letters').delete().eq('id', id)
    dbCheck(error)
    await removeFiles([data?.file_url])
    return 'Surat dihapus.'
  })
}

/* ---------- Pengumuman ---------- */

export async function saveAnnouncement(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = String(fd.get('id') ?? '')
    const payload = { content: text(fd, 'content', { max: 500 }), is_active: fd.get('is_active') === 'on' }
    const { error } = id
      ? await db.from('announcements').update(payload).eq('id', id)
      : await db.from('announcements').insert(payload)
    dbCheck(error)
    return id ? 'Pengumuman diperbarui.' : 'Pengumuman ditambahkan.'
  })
}

export async function deleteAnnouncement(_prev: FormState, fd: FormData) {
  return run(async () => {
    const { error } = await getAdminClient().from('announcements').delete().eq('id', text(fd, 'id'))
    dbCheck(error)
    return 'Pengumuman dihapus.'
  })
}

/* ---------- Buletin ---------- */

export async function saveBulletin(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = String(fd.get('id') ?? '')
    const files = getFiles(fd, 'images')
    if (files.length > MAX_BULLETIN_IMAGES) {
      throw new ValidationError(`Maksimal ${MAX_BULLETIN_IMAGES} foto per buletin.`)
    }
    files.forEach((f) => validateFile(f, 'image'))

    const payload: Record<string, unknown> = {
      title: text(fd, 'title', { max: 200 }),
      description: text(fd, 'description', { max: 3000 }),
      event_date: optionalDate(fd, 'event_date'),
    }

    if (id) {
      const { data: existing } = await db.from('bulletins').select('image_urls').eq('id', id).single()
      const current: string[] = existing?.image_urls ?? []
      const removeExisting = fd.get('remove_images') === 'on'
      if (files.length || removeExisting) {
        const uploaded = await Promise.all(files.map((f) => uploadFile(f, 'bulletins', 'image')))
        payload.image_urls = uploaded
        await removeFiles(current)
      }
      const { error } = await db.from('bulletins').update(payload).eq('id', id)
      dbCheck(error)
      return 'Buletin diperbarui.'
    }

    payload.image_urls = await Promise.all(files.map((f) => uploadFile(f, 'bulletins', 'image')))
    const { error } = await db.from('bulletins').insert(payload)
    dbCheck(error)
    return 'Buletin ditambahkan.'
  })
}

export async function deleteBulletin(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = text(fd, 'id')
    const { data } = await db.from('bulletins').select('image_urls').eq('id', id).single()
    const { error } = await db.from('bulletins').delete().eq('id', id)
    dbCheck(error)
    await removeFiles(data?.image_urls ?? [])
    return 'Buletin dihapus.'
  })
}

/* ---------- Susunan Pengurus ---------- */

export async function saveOfficer(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = String(fd.get('id') ?? '')
    const order = Number.parseInt(String(fd.get('sort_order') ?? '0'), 10)
    const payload: Record<string, unknown> = {
      name: text(fd, 'name', { max: 120 }),
      position: text(fd, 'position', { max: 120 }),
      phone: text(fd, 'phone', { required: false, max: 30 }) || null,
      sort_order: Number.isFinite(order) ? Math.max(0, Math.min(order, 999)) : 0,
    }
    const [photo] = getFiles(fd, 'photo')
    if (photo) validateFile(photo, 'image')

    if (id) {
      const { data: existing } = await db.from('officers').select('photo_url').eq('id', id).single()
      if (photo) {
        payload.photo_url = await uploadFile(photo, 'officers', 'image')
        await removeFiles([existing?.photo_url])
      } else if (fd.get('remove_photo') === 'on') {
        payload.photo_url = null
        await removeFiles([existing?.photo_url])
      }
      const { error } = await db.from('officers').update(payload).eq('id', id)
      dbCheck(error)
      return 'Data pengurus diperbarui.'
    }

    if (photo) payload.photo_url = await uploadFile(photo, 'officers', 'image')
    const { error } = await db.from('officers').insert(payload)
    dbCheck(error)
    return 'Pengurus ditambahkan.'
  })
}

export async function deleteOfficer(_prev: FormState, fd: FormData) {
  return run(async () => {
    const db = getAdminClient()
    const id = text(fd, 'id')
    const { data } = await db.from('officers').select('photo_url').eq('id', id).single()
    const { error } = await db.from('officers').delete().eq('id', id)
    dbCheck(error)
    await removeFiles([data?.photo_url])
    return 'Pengurus dihapus.'
  })
}
