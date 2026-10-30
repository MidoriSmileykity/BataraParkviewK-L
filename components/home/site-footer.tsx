import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row">
        <p className="text-background/80">{`© ${new Date().getFullYear()} Paguyuban Batara Parkview Blok K & L, Desa Cikasungka, Solear, Kabupaten Tangerang, Banten. Guyub, rukun, dan saling peduli.`}</p>
        <Link href="/admin" className="text-background/70 underline-offset-4 hover:text-background hover:underline">
          Login Admin
        </Link>
      </div>
    </footer>
  )
}
