import { RunningText } from '@/components/home/running-text'
import { SiteHeader } from '@/components/home/site-header'
import { HeroSection } from '@/components/home/hero-section'
import { BulletinSection } from '@/components/home/bulletin-section'
import { LettersSection } from '@/components/home/letters-section'
import { OfficersSection } from '@/components/home/officers-section'
import { SiteFooter } from '@/components/home/site-footer'
import { getPublicClient } from '@/lib/supabase/server-clients'
import { fetchAnnouncements, fetchBulletins, fetchLetters, fetchOfficers } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const db = getPublicClient()
  const [announcements, bulletins, letters, officers] = await Promise.all([
    fetchAnnouncements(db, true),
    fetchBulletins(db, 6),
    fetchLetters(db, { onlyActive: true, limit: 5 }),
    fetchOfficers(db),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <RunningText items={announcements.map((a) => a.content)} />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <BulletinSection bulletins={bulletins} />
        <LettersSection letters={letters} />
        <OfficersSection officers={officers} />
      </main>
      <SiteFooter />
    </div>
  )
}
