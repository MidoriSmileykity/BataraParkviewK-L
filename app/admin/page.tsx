import { requireAdmin } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase/server-clients'
import { fetchAnnouncements, fetchBulletins, fetchLetters, fetchOfficers } from '@/lib/data'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { LettersManager } from '@/components/admin/letters-manager'
import { AnnouncementsManager } from '@/components/admin/announcements-manager'
import { BulletinsManager } from '@/components/admin/bulletins-manager'
import { OfficersManager } from '@/components/admin/officers-manager'
import { UploadGuide } from '@/components/admin/upload-guide'

export const metadata = { title: 'Dashboard Admin | Paguyuban Batara Parkview Blok K & L' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await requireAdmin()
  const db = getAdminClient()
  const [letters, announcements, bulletins, officers] = await Promise.all([
    fetchLetters(db, { onlyActive: false }),
    fetchAnnouncements(db, false),
    fetchBulletins(db),
    fetchOfficers(db),
  ])

  return (
    <div className="min-h-screen bg-secondary/40">
      <AdminHeader username={session.username} expiresAt={session.expiresAt} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">Kelola surat, pengumuman, buletin, dan susunan pengurus paguyuban.</p>
        </div>
        <AdminTabs
          panels={{
            surat: <LettersManager letters={letters} />,
            pengumuman: <AnnouncementsManager announcements={announcements} />,
            buletin: <BulletinsManager bulletins={bulletins} />,
            pengurus: <OfficersManager officers={officers} />,
            panduan: <UploadGuide />,
          }}
        />
      </main>
    </div>
  )
}
