import { Megaphone } from 'lucide-react'

export function RunningText({ items }: { items: string[] }) {
  if (items.length === 0) return null

  const totalLength = items.join(' ').length
  const duration = Math.max(20, Math.round(totalLength / 4))
  const sequence = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 text-sm font-medium">
          <span className="mr-6 size-1.5 rounded-full bg-accent-foreground/60" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-label="Pengumuman" className="marquee-container flex items-stretch bg-accent text-accent-foreground">
      <div className="z-10 flex shrink-0 items-center gap-2 bg-primary px-4 py-2 text-primary-foreground">
        <Megaphone className="size-4" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wider">Pengumuman</span>
      </div>
      <div className="relative flex flex-1 overflow-hidden py-2">
        <div
          className="animate-marquee flex w-max"
          style={{ ['--marquee-duration' as string]: `${duration}s` }}
        >
          {sequence(false)}
          {sequence(true)}
        </div>
      </div>
    </section>
  )
}
