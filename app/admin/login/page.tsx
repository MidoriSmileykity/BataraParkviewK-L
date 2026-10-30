import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'

export const metadata = { title: 'Login Admin | Paguyuban Batara Parkview Blok K & L' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; logout?: string }>
}) {
  if (await getSession()) redirect('/admin')
  const params = await searchParams

  const notice = params.logout
    ? 'Anda telah logout. Token sesi sudah tidak berlaku.'
    : params.expired
      ? 'Sesi Anda telah berakhir (maks. 2 jam). Silakan login kembali.'
      : null

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold">Login Admin Paguyuban</h1>
          <p className="text-sm text-muted-foreground">Khusus pengurus untuk mengelola konten portal.</p>
        </div>
        {notice && (
          <p role="status" className="rounded-lg border bg-accent/40 px-4 py-3 text-sm text-accent-foreground">
            {notice}
          </p>
        )}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
        <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground">
          {'← Kembali ke halaman utama'}
        </Link>
      </div>
    </main>
  )
}
