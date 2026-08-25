import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useSEO } from '../../components/seo'
import { Card, Button } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'

const PublicBarberPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Real D1 via Worker API (with localStorage fallback)
  const [apiProfile, setApiProfile] = useState<any>(null)
  const [apiServices, setApiServices] = useState<any>(null)
  const [loading, setLoading] = useState(!!slug)

  useEffect(() => {
    const s = slug || 'hamza-barber'
    if (!s) { setLoading(false); return }
    apiGetBarber(s).then(({ profile, services }) => {
      setApiProfile(profile)
      setApiServices(services)
    }).catch(() => {}).finally(() => setLoading(false))
    // also try localStorage as fallback quickly
    try {
      const raw = localStorage.getItem('barber:profile:1')
      if (raw && !s) {
        const p = JSON.parse(raw)
        if (p.slug === s) { setApiProfile(p); setLoading(false) }
      }
    } catch {}
  }, [slug])

  // Try to load barber created via /setup from localStorage (fallback)
  const storedProfile = (() => {
    if (apiProfile) return apiProfile
    try {
      const raw = localStorage.getItem('barber:profile:1') || localStorage.getItem(`barber:profile:${slug || ''}`)
      if (raw) return JSON.parse(raw)
      for (let i=0; i<localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k?.startsWith('barber:profile:')) {
          const p = JSON.parse(localStorage.getItem(k) || 'null')
          if (p && (p.slug === slug || slug === p.slug)) return p
        }
      }
      const lastSlug = localStorage.getItem('barber:lastSlug')
      if (lastSlug && slug === lastSlug) {
        const raw2 = localStorage.getItem('barber:profile:1')
        if (raw2) return JSON.parse(raw2)
      }
    } catch {}
    return null
  })()
  const storedServices = (() => {
    if (apiServices) return apiServices
    try {
      const raw = localStorage.getItem('barber:services:1')
      if (raw) return JSON.parse(raw)
    } catch {}
    return null
  })()

  const barber = apiProfile ? {
    id: apiProfile.id || '1',
    slug: apiProfile.slug || slug || 'hamza-barber',
    displayName: apiProfile.displayName || 'Hamza Barber',
    avatar: apiProfile.avatar || null,
    rating: '4.9',
    reviews: 127,
    phone: apiProfile.phone || '+212612345678',
    instagram: apiProfile.instagram || '@hamza.barber',
    location: apiProfile.location || 'Marrakech, Morocco',
    bio: apiProfile.bio || 'Professional barber • 10 years • Precision fades',
    services: (apiServices && apiServices.length ? apiServices.filter((s:any)=>s.active != 0) : storedServices && storedServices.length ? storedServices.filter((s:any)=>s.active) : [
      { id: '1', name: 'Haircut', price: '50 DH', duration: 30, active: true },
      { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20, active: true },
      { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45, active: true },
    ]).map((s:any)=>({ ...s, duration: typeof s.duration === 'string' ? parseInt(s.duration) : s.duration })),
  } : storedProfile ? {
    id: storedProfile.id || '1',
    slug: storedProfile.slug || slug || 'hamza-barber',
    displayName: storedProfile.displayName || 'Hamza Barber',
    avatar: storedProfile.avatar || null,
    rating: '4.9',
    reviews: 127,
    phone: storedProfile.phone || '+212612345678',
    instagram: storedProfile.instagram || '@hamza.barber',
    location: storedProfile.location || 'Marrakech, Morocco',
    bio: storedProfile.bio || 'Professional barber • 10 years • Precision fades',
    services: storedServices && storedServices.length ? storedServices.filter((s:any)=>s.active) : [
      { id: '1', name: 'Haircut', price: '50 DH', duration: 30, active: true },
      { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20, active: true },
      { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45, active: true },
    ],
  } : {
    avatar: null,
    id: '1',
    slug: slug || 'hamza-barber',
    displayName: 'Hamza Barber',
    rating: '4.9',
    reviews: 127,
    phone: '+212612345678',
    instagram: '@hamza.barber',
    location: 'Marrakech, Morocco',
    bio: 'Professional barber • 10 years • Precision fades',
    services: [
      { id: '1', name: 'Haircut', price: '50 DH', duration: 30, active: true },
      { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20, active: true },
      { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45, active: true },
    ],
  }

  useSEO({
    title: `${barber.displayName} — Book Your Appointment`,
    description: `Book with ${barber.displayName} in ${barber.location}. Premium fades, beard trims. Instant booking via link, WhatsApp, QR.`,
    type: 'profile',
  })

  return (
    <main className="min-h-screen bg-black text-secondary">
      {/* top gold hairline */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-card border border-gold/20 flex items-center justify-center">
              <span className="text-gold font-bold text-sm">HB</span>
            </div>
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">Barber</span>
          </div>
          <a href="/login" className="text-sm text-secondary hover:text-primary transition-colors">{t('login')}</a>
        </div>
      </header>

      {/* Hero - Premium mini site */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="relative">
            <div className="w-[96px] h-[96px] sm:w-[108px] sm:h-[108px] rounded-2xl bg-card border border-gold/20 flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {(barber as any).avatar ? <img src={(barber as any).avatar} alt={barber.displayName} className="w-full h-full object-cover" /> : <span className="text-3xl font-extrabold tracking-tight text-gold">{barber.displayName.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded-full">★ {barber.rating}</div>
          </div>
          <h1 className="mt-5 text-[28px] sm:text-[32px] font-extrabold tracking-tight text-primary leading-none">{barber.displayName}</h1>
          <p className="mt-1 text-sm text-secondary">{barber.location} • {barber.reviews} reviews</p>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-secondary/90">{barber.bio}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={() => { try { localStorage.setItem('barber:currentBookingSlug', barber.slug); localStorage.setItem('barber:currentBookingId', barber.id); } catch {}; navigate('/booking'); }} className="w-full sm:w-[280px] h-[48px] text-[15px]"> {t('bookAppointment')} — {t('bookNow')} </Button>
            <a href={`https://wa.me/${barber.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-primary hover:border-gold/30 hover:text-gold transition-colors">WhatsApp</a>
          </div>
          <p className="mt-2 text-xs text-muted">yourdomain.com/barber/{barber.slug}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services - primary */}
          <Card className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">{t('services')}</h3>
              <span className="text-xs text-gold border border-gold/20 rounded-full px-2 py-0.5">3 • Available</span>
            </div>
            <div className="space-y-3">
              {barber.services.map(s => (
                <div key={s.id} className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 px-4 py-4 hover:border-gold/20 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="text-[15px] font-semibold text-primary">{s.name}</p>
                    <p className="text-xs text-secondary mt-0.5">{s.duration} min</p>
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gold">{s.price}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => { try { localStorage.setItem('barber:currentBookingSlug', barber.slug); localStorage.setItem('barber:currentBookingId', barber.id); } catch {}; navigate('/booking'); }} className="w-full mt-6">{t('bookNow')}</Button>
          </Card>

          {/* Hours */}
          <Card className="p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-primary mb-5">{t('openingHours')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-secondary">Monday — Saturday</span><span className="text-primary font-medium">09:00 - 20:00</span></div>
              <div className="flex justify-between"><span className="text-secondary">Sunday</span><span className="text-muted">Closed</span></div>
              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs text-secondary">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('availableSlots')}
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-primary mb-5">{t('location')}</h3>
            <p className="text-sm text-primary font-medium">{barber.location}</p>
            <p className="text-xs text-secondary mt-1">Gueliz • Near Carré Eden</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={`https://www.instagram.com/${barber.instagram.replace('@','')}`} target="_blank" rel="noopener" className="rounded-xl bg-white/[0.04] border border-white/[0.06] py-3 text-center text-sm font-medium text-primary hover:border-gold/20 hover:text-gold transition-colors">Instagram</a>
              <a href={`https://wa.me/${barber.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener" className="rounded-xl bg-gold text-black py-3 text-center text-sm font-bold hover:bg-gold-light transition-colors">WhatsApp</a>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-secondary">Share: <span className="text-primary">barber-booking-app.pages.dev/barber/{barber.slug}</span></p>
          </Card>
        </div>

        {/* Sticky mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-white/[0.06] flex gap-3">
          <Button onClick={() => { try { localStorage.setItem('barber:currentBookingSlug', barber.slug); localStorage.setItem('barber:currentBookingId', barber.id); } catch {}; navigate('/booking'); }} className="flex-1 h-12">{t('bookAppointment')}</Button>
        </div>
        <div className="h-[88px] lg:hidden" />
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} {barber.displayName} • Premium booking via QR • {t('allRightsReserved') || ''}</p>
      </footer>
    </main>
  )
}
export default PublicBarberPage
