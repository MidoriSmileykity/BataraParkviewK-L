'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FormState } from '@/lib/actions/content'
import { cn } from '@/lib/utils'

type Props = {
  action: (prev: FormState, fd: FormData) => Promise<FormState>
  children?: React.ReactNode
  submitLabel: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  resetOnSuccess?: boolean
  confirmMessage?: string
  className?: string
  inline?: boolean
}

const initialState: FormState = { ok: false, message: '', ts: 0 }

export function ActionForm({
  action,
  children,
  submitLabel,
  variant = 'default',
  resetOnSuccess,
  confirmMessage,
  className,
  inline,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset()
  }, [state, resetOnSuccess])

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault()
      }}
      className={cn(inline ? 'inline-flex flex-col gap-1' : 'flex flex-col gap-4', className)}
    >
      {children}
      <div className={cn('flex flex-wrap items-center gap-3', inline && 'gap-1')}>
        <Button type="submit" variant={variant} size={inline ? 'sm' : 'default'} disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
        {state.message && !inline && (
          <p role="status" className={cn('text-sm', state.ok ? 'text-primary' : 'text-destructive')}>
            {state.message}
          </p>
        )}
      </div>
      {state.message && inline && !state.ok && (
        <p role="status" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </form>
  )
}
