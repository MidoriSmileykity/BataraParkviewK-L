import { ActionForm } from './action-form'
import { CheckboxField, TextField } from './fields'
import { EmptyState, ItemCard, ManagerShell } from './manager-shell'
import { deleteOfficer, saveOfficer } from '@/lib/actions/content'
import type { Officer } from '@/lib/data'
import { UPLOAD_RULES } from '@/lib/upload-rules'

function OfficerFields({ item, nextOrder }: { item?: Officer; nextOrder?: number }) {
  const p = item ? `off-${item.id}` : 'off-new'
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <TextField idPrefix={p} name="name" label="Nama" required maxLength={120} defaultValue={item?.name} />
      <TextField idPrefix={p} name="position" label="Jabatan" required maxLength={120} placeholder="Ketua RT, Sekretaris, ..." defaultValue={item?.position} />
      <TextField idPrefix={p} name="phone" label="No. HP (opsional)" type="tel" maxLength={30} defaultValue={item?.phone ?? ''} />
      <TextField
        idPrefix={p}
        name="sort_order"
        label="Urutan tampil"
        type="number"
        min={0}
        max={999}
        defaultValue={item?.sort_order ?? nextOrder ?? 0}
        hint="Angka kecil tampil lebih dulu."
      />
      <TextField
        idPrefix={p}
        name="photo"
        label={item?.photo_url ? 'Ganti foto (opsional)' : 'Foto (opsional)'}
        type="file"
        accept={UPLOAD_RULES.image.accept}
        hint="PNG/JPG/JPEG, maks. 2 MB. Disarankan persegi 400×400 px."
      />
      {item?.photo_url && <CheckboxField idPrefix={p} name="remove_photo" label="Hapus foto" />}
    </>
  )
}

export function OfficersManager({ officers }: { officers: Officer[] }) {
  const nextOrder = officers.reduce((m, o) => Math.max(m, o.sort_order), 0) + 1
  return (
    <ManagerShell
      title="Susunan Pengurus"
      description="Ubah nama, jabatan, urutan, atau foto pengurus RT."
      createTitle="Tambah pengurus"
      createForm={
        <ActionForm action={saveOfficer} submitLabel="Simpan pengurus" resetOnSuccess>
          <OfficerFields nextOrder={nextOrder} />
        </ActionForm>
      }
    >
      {officers.length === 0 ? (
        <EmptyState>Belum ada pengurus.</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {officers.map((o) => (
            <ItemCard
              key={o.id}
              editForm={
                <ActionForm action={saveOfficer} submitLabel="Simpan perubahan">
                  <OfficerFields item={o} />
                </ActionForm>
              }
              actions={
                <ActionForm action={deleteOfficer} submitLabel="Hapus" variant="destructive" inline confirmMessage={`Hapus ${o.name} dari susunan pengurus?`}>
                  <input type="hidden" name="id" value={o.id} />
                </ActionForm>
              }
            >
              <div className="flex items-center gap-3">
                {o.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.photo_url || '/placeholder.svg'} alt={`Foto ${o.name}`} className="size-12 rounded-full object-cover" />
                ) : (
                  <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary" aria-hidden="true">
                    {o.sort_order}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.position} &middot; Urutan {o.sort_order}
                    {o.phone ? ` · ${o.phone}` : ''}
                  </p>
                </div>
              </div>
            </ItemCard>
          ))}
        </ul>
      )}
    </ManagerShell>
  )
}
