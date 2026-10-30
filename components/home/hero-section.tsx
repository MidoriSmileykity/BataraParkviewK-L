import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero-rt.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-16 text-primary-foreground md:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Selamat datang, warga</p>
        <h1 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-5xl">
          Informasi resmi Paguyuban Batara Parkview Blok K &amp; L
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-primary-foreground/85">
          Desa Cikasungka, Solear, Kabupaten Tangerang, Banten. Ikuti kegiatan terbaru, unduh surat edaran yang berlaku, dan kenali pengurus kita.
        </p>
      </div>
    </section>
  )
}
