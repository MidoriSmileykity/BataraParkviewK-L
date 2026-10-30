import Link from 'next/link'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/lib/actions/auth'
import { SessionTimer } from './session-timer'

export function AdminHeader({ username, expiresAt }: { username: string; expiresAt: string }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-bold sm:text-sm">Admin Paguyuban Batara Parkview Blok K &amp; L</span>
            <span className="text-xs text-muted-foreground">Masuk sebagai {username}</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <SessionTimer expiresAt={expiresAt} />
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
