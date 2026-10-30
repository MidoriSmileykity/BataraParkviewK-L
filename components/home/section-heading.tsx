export function SectionHeading({ id, eyebrow, title, description }: { id: string; eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 id={id} className="text-balance text-2xl font-bold md:text-3xl">
        {title}
      </h2>
      {description && <p className="max-w-2xl text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}
