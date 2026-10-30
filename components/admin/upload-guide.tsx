import { FileText, ImageIcon, UserCircle, Lightbulb } from 'lucide-react'

const guides = [
  {
    icon: FileText,
    title: 'File Surat RT',
    rows: [
      ['Format', 'PDF (.pdf) saja'],
      ['Ukuran maksimal', '5 MB per file'],
      ['Ukuran kertas', 'A4, orientasi portrait'],
      ['Hasil scan', '150–300 dpi agar tetap jelas namun ringan'],
    ],
  },
  {
    icon: ImageIcon,
    title: 'Foto Buletin Kegiatan',
    rows: [
      ['Format', 'PNG, JPG, atau JPEG'],
      ['Ukuran maksimal', '2 MB per foto'],
      ['Jumlah', '0–2 foto per buletin'],
      ['Dimensi disarankan', '1280 × 720 px (landscape 16:9)'],
    ],
  },
  {
    icon: UserCircle,
    title: 'Foto Pengurus',
    rows: [
      ['Format', 'PNG, JPG, atau JPEG'],
      ['Ukuran maksimal', '2 MB per foto'],
      ['Dimensi disarankan', '400 × 400 px (persegi 1:1)'],
      ['Tips', 'Wajah di tengah, latar polos'],
    ],
  },
]

export function UploadGuide() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Panduan Upload File</h2>
        <p className="text-sm text-muted-foreground">
          File yang tidak sesuai format atau melebihi batas ukuran akan ditolak otomatis oleh sistem.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map(({ icon: Icon, title, rows }) => (
          <section key={title} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold">{title}</h3>
            </div>
            <dl className="flex flex-col gap-2 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex flex-col border-b pb-2 last:border-0 last:pb-0">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <section className="flex gap-3 rounded-xl border bg-accent/30 p-5">
        <Lightbulb className="size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold">Tips memperkecil ukuran file</p>
          <ul className="list-disc pl-4 text-muted-foreground">
            <li>Foto dari HP biasanya 3–8 MB. Kompres dulu dengan aplikasi seperti Squoosh atau TinyPNG.</li>
            <li>Gunakan JPG untuk foto kegiatan (lebih ringan), PNG untuk gambar berisi teks/grafik.</li>
            <li>Untuk PDF hasil scan, gunakan mode hitam-putih/grayscale agar ukuran lebih kecil.</li>
            <li>Sesi login berlaku 2 jam. Simpan pekerjaan sebelum waktu sesi habis.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
