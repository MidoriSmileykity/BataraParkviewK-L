import { Phone } from 'lucide-react'
import { SectionHeading } from './section-heading'
import type { Officer } from '@/lib/data'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

export function OfficersSection({ officers }: { officers: Officer[] }) {
  return (
    <section id="pengurus" aria-labelledby="pengurus-title" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="pengurus-title"
          eyebrow="Struktur Organisasi"
          title="Susunan pengurus RT"
          description="Pengurus yang siap membantu kebutuhan dan aspirasi warga."
        />
        {officers.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Susunan pengurus belum diisi.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {officers.map((o) => (
              <li key={o.id} className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center">
                {o.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.photo_url || '/placeholder.svg'}
                    alt={`Foto ${o.name}`}
                    loading="lazy"
                    className="size-20 rounded-full object-cover ring-2 ring-secondary"
                  />
                ) : (
                  <span
                    className="flex size-20 items-center justify-center rounded-full bg-secondary text-xl font-bold text-primary"
                    aria-hidden="true"
                  >
                    {initials(o.name)}
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{o.position}</p>
                  <p className="font-semibold leading-snug">{o.name}</p>
                  {o.phone && (
                    <a
                      href={`tel:${o.phone.replace(/[^\d+]/g, '')}`}
                      className="mt-1 inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="size-3" aria-hidden="true" />
                      {o.phone}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
