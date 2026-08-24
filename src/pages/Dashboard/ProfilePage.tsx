import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Input, Button } from '@/components/ui'
import type { BarberProfile } from '@/types'

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<Partial<BarberProfile>>({
    displayName: 'Hamza Barber',
    bio: 'Premium cuts & classic styles in the heart of the city.',
    phone: '+212 6 12 34 56 78',
    whatsapp: '+212 6 12 34 56 78',
    instagram: '@hamza.barber',
    location: 'Casablanca, Morocco',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!profile.displayName?.trim()) next.displayName = t('pleaseFillFields', { defaultValue: 'Name required' }) as string
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t('profileManagement', { defaultValue: 'Profile' })}
          </h1>
          <p className="text-secondary text-sm mt-1">Manage your public barber profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col items-center text-center lg:col-span-1 h-fit">
            <div className="w-24 h-24 rounded-2xl bg-black border border-border flex items-center justify-center overflow-hidden">
              <span className="text-gold text-2xl font-bold">HB</span>
            </div>
            <h3 className="text-primary font-semibold mt-4">{profile.displayName}</h3>
            <p className="text-secondary text-xs mt-1 line-clamp-2">{profile.bio}</p>
            <Button variant="outline" size="sm" className="w-full min-h-[44px] mt-5">
              {t('uploadImage', { defaultValue: 'Upload Image' })}
            </Button>
            <p className="text-secondary text-xs mt-3">{t('profilePicture', { defaultValue: 'Profile Picture' })}</p>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-secondary text-[11px] font-medium uppercase tracking-widest">{t('barberProfile', { defaultValue: 'Barber Profile' })}</h2>
            <div className="grid gap-4 mt-5">
              <Input
                placeholder={t('barberName', { defaultValue: 'Display Name' })}
                value={profile.displayName ?? ''}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                error={errors.displayName}
                className="min-h-[44px]"
              />
              <div className="w-full">
                <textarea
                  placeholder={t('barberBio', { defaultValue: 'Bio' })}
                  value={profile.bio ?? ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-black/40 px-4 py-3 text-[15px] text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-colors min-h-[44px] resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder={t('phone', { defaultValue: 'Phone' })}
                  value={profile.phone ?? ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  type="tel"
                  className="min-h-[44px]"
                />
                <Input
                  placeholder={t('whatsapp', { defaultValue: 'WhatsApp' })}
                  value={profile.whatsapp ?? ''}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  type="tel"
                  className="min-h-[44px]"
                />
              </div>
              <Input
                placeholder={t('instagram', { defaultValue: 'Instagram' })}
                value={profile.instagram ?? ''}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                className="min-h-[44px]"
              />
              <Input
                placeholder={t('location', { defaultValue: 'Location' })}
                value={profile.location ?? ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="min-h-[44px]"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={handleSave} className="flex-1 min-h-[44px]">
                {saved ? t('success', { defaultValue: 'Saved ✓' }) : t('saveProfile', { defaultValue: t('save', { defaultValue: 'Save' }) })}
              </Button>
              <Button variant="ghost" onClick={() => window.open('/', '_blank')} className="flex-1 min-h-[44px]">
                {t('viewPublicPage', { defaultValue: 'View Public Page' })}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
