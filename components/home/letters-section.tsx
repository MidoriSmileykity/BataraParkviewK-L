import { FileText, Download } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { formatDate, type Letter } from '@/lib/data'

const subjectStyles: Record<string, string> = {
  Pengumuman: 'bg-primary text-primary-foreground',
  Himbauan: 'bg-accent text-accent-foreground',
  'Notulen Rapat': 'bg-secondary text-secondary-foreground',
  Pemberitahuan: 'bg-foreground text-background',
}

export function LettersSection({ letters }: { letters: Letter[] }) {
  return (
    <section id="surat" aria-labelledby="surat-title" className="scroll-mt-20 bg-secondary/50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="surat-title"
          eyebrow="Surat RT"
          title="Surat yang sedang berlaku"
          description="Surat edaran resmi RT yang masih aktif. Klik untuk melihat atau mengunduh dokumen PDF."
        />
        {letters.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
            Belum ada surat aktif.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {letters.map((l) => (
              <li key={l.id} className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${subjectStyles[l.subject] ?? 'bg-muted'}`}>
                      {l.subject}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">No. {l.number}</span>
                  </div>
                  <h3 className="font-semibold leading-snug">{l.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Dari {l.origin} &middot; {formatDate(l.letter_date ?? l.created_at)}
                  </p>
                </div>
                {l.file_url ? (
                  <a
                    href={l.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Lihat PDF
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Dokumen belum tersedia</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
