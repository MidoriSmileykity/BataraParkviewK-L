import type { SupabaseClient } from '@supabase/supabase-js'

export type Announcement = { id: string; content: string; is_active: boolean; created_at: string }
export type Bulletin = {
  id: string
  title: string
  description: string
  event_date: string | null
  image_urls: string[]
  created_at: string
}
export type Letter = {
  id: string
  name: string
  number: string
  subject: string
  origin: string
  letter_date: string | null
  file_url: string | null
  is_active: boolean
  created_at: string
}
export type Officer = {
  id: string
  name: string
  position: string
  phone: string | null
  photo_url: string | null
  sort_order: number
}

export async function fetchAnnouncements(db: SupabaseClient, onlyActive: boolean) {
  let q = db.from('announcements').select('id, content, is_active, created_at').order('created_at', { ascending: false })
  if (onlyActive) q = q.eq('is_active', true)
  const { data } = await q
  return (data ?? []) as Announcement[]
}

export async function fetchBulletins(db: SupabaseClient, limit?: number) {
  let q = db
    .from('bulletins')
    .select('id, title, description, event_date, image_urls, created_at')
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data } = await q
  return (data ?? []) as Bulletin[]
}

export async function fetchLetters(db: SupabaseClient, opts: { onlyActive: boolean; limit?: number }) {
  let q = db
    .from('letters')
    .select('id, name, number, subject, origin, letter_date, file_url, is_active, created_at')
    .order('letter_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (opts.onlyActive) q = q.eq('is_active', true)
  if (opts.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data ?? []) as Letter[]
}

export async function fetchOfficers(db: SupabaseClient) {
  const { data } = await db
    .from('officers')
    .select('id, name, position, phone, photo_url, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return (data ?? []) as Officer[]
}

export function formatDate(value: string | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(value),
  )
}
