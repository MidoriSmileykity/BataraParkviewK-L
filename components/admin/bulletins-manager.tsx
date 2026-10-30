import { ActionForm } from './action-form'
import { CheckboxField, TextAreaField, TextField } from './fields'
import { EmptyState, ItemCard, ManagerShell } from './manager-shell'
import { deleteBulletin, saveBulletin } from '@/lib/actions/content'
import { formatDate, type Bulletin } from '@/lib/data'
import { UPLOAD_RULES } from '@/lib/upload-rules'

function BulletinFields({ item }: { item?: Bulletin }) {
  const p = item ? `bul-${item.id}` : 'bul-new'
  const hasImages = (item?.image_urls.length ?? 0) > 0
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <TextField idPrefix={p} name="title" label="Judul kegiatan" required maxLength={200} defaultValue={item?.title} />
      <TextField idPrefix={p} name="event_date" label="Tanggal kegiatan" type="date" defaultValue={item?.event_date ?? ''} />
      <TextAreaField idPrefix={p} name="description" label="Keterangan kegiatan" required maxLength={3000} rows={5} defaultValue={item?.description} />
      <TextField
        idPrefix={p}
        name="images"
        label={hasImages ? 'Ganti foto (opsional, mengganti foto lama)' : 'Foto kegiatan (opsional)'}
        type="file"
        multiple
        accept={UPLOAD_RULES.image.accept}
        hint="Maksimal 2 foto. PNG/JPG/JPEG, maks. 2 MB per foto. Disarankan 1280×720 px (landscape)."
      />
      {hasImages && <CheckboxField idPrefix={p} name="remove_images" label="Hapus semua foto lama" />}
    </>
  )
}

export function BulletinsManager({ bulletins }: { bulletins: Bulletin[] }) {
  return (
    <ManagerShell
      title="Daftar Buletin"
      description="Halaman utama menampilkan 6 buletin terbaru berdasarkan tanggal kegiatan."
      createTitle="Tambah buletin kegiatan"
      createForm={
        <ActionForm action={saveBulletin} submitLabel="Simpan buletin" resetOnSuccess>
          <BulletinFields />
        </ActionForm>
      }
    >
      {bulletins.length === 0 ? (
        <EmptyState>Belum ada buletin.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {bulletins.map((b) => (
            <ItemCard
              key={b.id}
              editForm={
                <ActionForm action={saveBulletin} submitLabel="Simpan perubahan">
                  <BulletinFields item={b} />
                </ActionForm>
              }
              actions={
                <ActionForm action={deleteBulletin} submitLabel="Hapus" variant="destructive" inline confirmMessage={`Hapus buletin "${b.title}"?`}>
                  <input type="hidden" name="id" value={b.id} />
                </ActionForm>
              }
            >
              <div className="flex gap-4">
                {b.image_urls.length > 0 && (
                  <div className="flex shrink-0 gap-1">
                    {b.image_urls.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src || '/placeholder.svg'} alt={`Foto ${i + 1} ${b.title}`} className="size-16 rounded-md object-cover" />
                    ))}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-primary">{formatDate(b.event_date)}</p>
                  <p className="font-semibold">{b.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                </div>
              </div>
            </ItemCard>
          ))}
        </ul>
      )}
    </ManagerShell>
  )
}
