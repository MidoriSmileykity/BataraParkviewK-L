'use server'

import { redirect } from 'next/navigation'
import { createSession, destroySession } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase/server-clients'

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!username || !password || username.length > 64 || password.length > 128) {
    return { error: 'Username atau password salah.' }
  }

  const { data: adminId, error } = await getAdminClient().rpc('verify_admin_password', {
    p_username: username,
    p_password: password,
  })

  if (error) {
    console.error('[auth] verify_admin_password failed:', error.message)
    return { error: 'Terjadi kesalahan pada server. Coba lagi nanti.' }
  }
  if (!adminId) {
    await new Promise((r) => setTimeout(r, 600))
    return { error: 'Username atau password salah.' }
  }

  await createSession(adminId as string)
  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login?logout=1')
}
