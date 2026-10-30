'use client'

import { FileText, Megaphone, Newspaper, Users, BookOpen } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabs = [
  { value: 'surat', label: 'Surat RT', icon: FileText },
  { value: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
  { value: 'buletin', label: 'Buletin', icon: Newspaper },
  { value: 'pengurus', label: 'Pengurus', icon: Users },
  { value: 'panduan', label: 'Panduan Upload', icon: BookOpen },
] as const

type TabKey = (typeof tabs)[number]['value']

export function AdminTabs({ panels }: { panels: Record<TabKey, React.ReactNode> }) {
  return (
    <Tabs defaultValue="surat" className="gap-4">
      <div className="overflow-x-auto">
        <TabsList className="h-auto bg-card p-1 shadow-sm">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="px-3 py-1.5">
              <Icon aria-hidden="true" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map(({ value }) => (
        <TabsContent key={value} value={value}>
          {panels[value]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
