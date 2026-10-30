import { Badge } from '@/components/ui/badge'
import { ActionForm } from './action-form'
import { CheckboxField, TextAreaField } from './fields'
import { EmptyState, ItemCard, ManagerShell } from './manager-shell'
import { deleteAnnouncement, saveAnnouncement } from '@/lib/actions/content'
import { formatDate, type Announcement } from '@/lib/data'

function AnnouncementFields({ item }: { item?: Announcement }) {
  const p = item ? `ann-${item.id}` : 'ann-new'
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <TextAreaField
        idPrefix={p}
        name="content"
        label="Isi pengumuman"
        required
        maxLength={500}
        rows={3}
        defaultValue={item?.content}
        hint="Teks singkat yang akan berjalan (running text) di bagian atas halaman utama. Maks. 500 karakter."
      />
      <CheckboxField idPrefix={p} name="is_active" label="Tampilkan (aktif)" defaultChecked={item?.is_active ?? true} />
    </>
  )
}

export function AnnouncementsManager({ announcements }: { announcements: Announcement[] }) {
  return (
    <ManagerShell
      title="Daftar Pengumuman"
      description="Semua pengumuman aktif ditampilkan bergantian sebagai running text."
      createTitle="Tambah pengumuman"
      createForm={
        <ActionForm action={saveAnnouncement} submitLabel="Simpan pengumuman" resetOnSuccess>
          <AnnouncementFields />
        </ActionForm>
      }
    >
      {announcements.length === 0 ? (
        <EmptyState>Belum ada pengumuman.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {announcements.map((a) => (
            <ItemCard
              key={a.id}
              editForm={
                <ActionForm action={saveAnnouncement} submitLabel="Simpan perubahan">
                  <AnnouncementFields item={a} />
                </ActionForm>
              }
              actions={
                <ActionForm action={deleteAnnouncement} submitLabel="Hapus" variant="destructive" inline confirmMessage="Hapus pengumuman ini?">
                  <input type="hidden" name="id" value={a.id} />
                </ActionForm>
              }
            >
              <Badge variant={a.is_active ? 'default' : 'outline'}>{a.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
              <p className="mt-2 text-sm leading-relaxed">{a.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">Dibuat {formatDate(a.created_at)}</p>
            </ItemCard>
          ))}
        </ul>
      )}
    </ManagerShell>
  )
}
