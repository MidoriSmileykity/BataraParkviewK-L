import { CalendarDays, ImageOff } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { formatDate, type Bulletin } from '@/lib/data'

export function BulletinSection({ bulletins }: { bulletins: Bulletin[] }) {
  return (
    <section id="buletin" aria-labelledby="buletin-title" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="buletin-title"
          eyebrow="Buletin"
          title="Kegiatan warga terbaru"
          description="Dokumentasi dan keterangan kegiatan yang telah atau akan dilaksanakan di lingkungan RT."
        />
        {bulletins.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Belum ada buletin kegiatan.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bulletins.map((b) => (
              <article key={b.id} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                <BulletinImages images={b.image_urls} title={b.title} />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {b.event_date && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      <time dateTime={b.event_date}>{formatDate(b.event_date)}</time>
                    </p>
                  )}
                  <h3 className="text-lg font-semibold leading-snug">{b.title}</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BulletinImages({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center bg-secondary text-secondary-foreground/60">
        <ImageOff className="size-8" aria-hidden="true" />
        <span className="sr-only">Tidak ada foto</span>
      </div>
    )
  }
  return (
    <div className={`grid aspect-video gap-0.5 bg-border ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src || '/placeholder.svg'}
          alt={`Foto kegiatan ${title} ${i + 1}`}
          loading="lazy"
          className="size-full object-cover"
        />
      ))}
    </div>
  )
}
