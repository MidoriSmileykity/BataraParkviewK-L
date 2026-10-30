'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function SessionTimer({ expiresAt }: { expiresAt: string }) {
  const expiry = new Date(expiresAt).getTime()
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => {
      const left = expiry - Date.now()
      setRemaining(left)
      if (left <= 0) window.location.href = '/admin/login?expired=1'
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiry])

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
      title="Sisa waktu sesi login"
    >
      <Clock className="size-3.5" aria-hidden="true" />
      <span className="sr-only">Sisa sesi: </span>
      {remaining === null ? '--:--:--' : format(remaining)}
    </span>
  )
}
