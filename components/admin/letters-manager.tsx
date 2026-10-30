import { Badge } from '@/components/ui/badge'
import { ActionForm } from './action-form'
import { CheckboxField, SelectField, TextField } from './fields'
import { EmptyState, ItemCard, ManagerShell } from './manager-shell'
import { deleteLetter, saveLetter } from '@/lib/actions/content'
import { formatDate, type Letter } from '@/lib/data'
import { LETTER_SUBJECTS, UPLOAD_RULES } from '@/lib/upload-rules'

function LetterFields({ letter }: { letter?: Letter }) {
  const p = letter ? `letter-${letter.id}` : 'letter-new'
  return (
    <>
      {letter && <input type="hidden" name="id" value={letter.id} />}
      <TextField idPrefix={p} name="name" label="Nama surat" required maxLength={200} defaultValue={letter?.name} />
      <TextField idPrefix={p} name="number" label="Nomor surat" required maxLength={100} placeholder="001/RT-05/X/2026" defaultValue={letter?.number} />
      <SelectField idPrefix={p} name="subject" label="Perihal" options={LETTER_SUBJECTS} defaultValue={letter?.subject} />
      <TextField idPrefix={p} name="origin" label="Asal surat" required maxLength={200} placeholder="Pengurus RT / Kelurahan" defaultValue={letter?.origin} />
      <TextField idPrefix={p} name="letter_date" label="Tanggal surat" type="date" defaultValue={letter?.letter_date ?? ''} />
      <TextField
        idPrefix={p}
        name="file"
        label={letter?.file_url ? 'Ganti file surat (opsional)' : 'File surat'}
        type="file"
        accept={UPLOAD_RULES.pdf.accept}
        hint="Format PDF, maksimal 5 MB."
      />
      <CheckboxField idPrefix={p} name="is_active" label="Tampilkan di halaman utama (aktif)" defaultChecked={letter?.is_active ?? true} />
    </>
  )
}

export function LettersManager({ letters }: { letters: Letter[] }) {
  const activeCount = letters.filter((l) => l.is_active).length
  return (
    <ManagerShell
      title="Daftar Surat RT"
      description={`${activeCount} surat aktif. Halaman utama menampilkan maksimal 5 surat aktif terbaru (disarankan 3–5).`}
      createTitle="Tambah surat baru"
      createForm={
        <ActionForm action={saveLetter} submitLabel="Simpan surat" resetOnSuccess>
          <LetterFields />
        </ActionForm>
      }
    >
      {letters.length === 0 ? (
        <EmptyState>Belum ada surat.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {letters.map((l) => (
            <ItemCard
              key={l.id}
              editForm={
                <ActionForm action={saveLetter} submitLabel="Simpan perubahan">
                  <LetterFields letter={l} />
                </ActionForm>
              }
              actions={
                <ActionForm action={deleteLetter} submitLabel="Hapus" variant="destructive" inline confirmMessage={`Hapus surat "${l.name}"?`}>
                  <input type="hidden" name="id" value={l.id} />
                </ActionForm>
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{l.subject}</Badge>
                <Badge variant={l.is_active ? 'default' : 'outline'}>{l.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
              </div>
              <p className="mt-2 font-semibold">{l.name}</p>
              <p className="text-sm text-muted-foreground">
                No. {l.number} &middot; Dari {l.origin} &middot; {formatDate(l.letter_date)}
              </p>
              {l.file_url ? (
                <a href={l.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Lihat PDF
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada file PDF</p>
              )}
            </ItemCard>
          ))}
        </ul>
      )}
    </ManagerShell>
  )
}
