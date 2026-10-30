import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type BaseProps = { name: string; label: string; idPrefix: string; hint?: string }

export function TextField({
  name,
  label,
  idPrefix,
  hint,
  ...props
}: BaseProps & React.ComponentProps<typeof Input>) {
  const id = `${idPrefix}-${name}`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextAreaField({
  name,
  label,
  idPrefix,
  hint,
  ...props
}: BaseProps & React.ComponentProps<typeof Textarea>) {
  const id = `${idPrefix}-${name}`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={name} {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function SelectField({
  name,
  label,
  idPrefix,
  options,
  defaultValue,
}: BaseProps & { options: readonly string[]; defaultValue?: string }) {
  const id = `${idPrefix}-${name}`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        required
        defaultValue={defaultValue ?? ''}
        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="" disabled>
          Pilih perihal
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export function CheckboxField({
  name,
  label,
  idPrefix,
  defaultChecked,
}: BaseProps & { defaultChecked?: boolean }) {
  const id = `${idPrefix}-${name}`
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 rounded border-input accent-primary"
      />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}
