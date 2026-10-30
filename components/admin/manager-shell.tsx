import { ChevronDown } from 'lucide-react'

export function ManagerShell({
  title,
  description,
  createTitle,
  createForm,
  children,
}: {
  title: string
  description: string
  createTitle: string
  createForm: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <section className="h-fit rounded-xl border bg-card p-5 shadow-sm" aria-labelledby={`${title}-create`}>
        <h2 id={`${title}-create`} className="mb-4 text-base font-semibold">
          {createTitle}
        </h2>
        {createForm}
      </section>
      <section className="flex flex-col gap-3" aria-label={title}>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </section>
    </div>
  )
}

export function ItemCard({
  children,
  editForm,
  actions,
}: {
  children: React.ReactNode
  editForm: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <li className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="flex shrink-0 items-start gap-2">{actions}</div>
      </div>
      <details className="group mt-3 border-t pt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-primary">
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          Edit
        </summary>
        <div className="mt-4">{editForm}</div>
      </details>
    </li>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">{children}</p>
}
