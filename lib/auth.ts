import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminClient } from '@/lib/supabase/server-clients'

const COOKIE_NAME = 'rt_admin_token'
export const SESSION_TTL_SECONDS = 2 * 60 * 60

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function cookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: true,
    // The v0 preview runs inside a cross-site iframe, which needs SameSite=None in development.
    sameSite: (isProd ? 'lax' : 'none') as 'lax' | 'none',
    path: '/',
    maxAge,
  }
}

export async function createSession(adminId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)
  const supabase = getAdminClient()

  await supabase
    .from('admin_sessions')
    .delete()
    .eq('admin_id', adminId)
    .or(`expires_at.lt.${new Date().toISOString()},revoked_at.not.is.null`)

  const { error } = await supabase.from('admin_sessions').insert({
    admin_id: adminId,
    token_hash: hashToken(token),
    expires_at: expiresAt.toISOString(),
  })
  if (error) throw new Error('Gagal membuat sesi')

  const store = await cookies()
  store.set(COOKIE_NAME, token, cookieOptions(SESSION_TTL_SECONDS))
}

export type AdminSession = { adminId: string; username: string; expiresAt: string }

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null

  const { data } = await getAdminClient()
    .from('admin_sessions')
    .select('admin_id, expires_at, revoked_at, admins(username)')
    .eq('token_hash', hashToken(token))
    .maybeSingle()

  if (!data || data.revoked_at || new Date(data.expires_at).getTime() <= Date.now()) {
    return null
  }

  const admin = data.admins as unknown as { username: string } | null
  return { adminId: data.admin_id, username: admin?.username ?? 'admin', expiresAt: data.expires_at }
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login?expired=1')
  return session
}

export async function destroySession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (token) {
    await getAdminClient()
      .from('admin_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('token_hash', hashToken(token))
  }
  store.set(COOKIE_NAME, '', cookieOptions(0))
}
