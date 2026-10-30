import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!

let adminClient: SupabaseClient | null = null
let publicClient: SupabaseClient | null = null

const options = { auth: { persistSession: false, autoRefreshToken: false } }

/** Service-role client. Server only — bypasses RLS, so every caller must verify the admin session first. */
export function getAdminClient() {
  if (!adminClient) {
    adminClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, options)
  }
  return adminClient
}

/** Anon client for public reads; respects RLS. */
export function getPublicClient() {
  if (!publicClient) {
    publicClient = createClient(
      url,
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      options,
    )
  }
  return publicClient
}

export const STORAGE_BUCKET = 'rt-files'
