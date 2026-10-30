import Link from 'next/link'
import { Home } from 'lucide-react'

const links = [
  { href: '#buletin', label: 'Buletin' },
  { href: '#surat', label: 'Surat RT' },
  { href: '#pengurus', label: 'Pengurus' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-bold sm:text-sm">Paguyuban Batara Parkview Blok K &amp; L</span>
            <span className="text-[11px] text-muted-foreground sm:text-xs">Cikasungka, Solear, Kab. Tangerang</span>
          </span>
        </Link>
        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground sm:px-3"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
