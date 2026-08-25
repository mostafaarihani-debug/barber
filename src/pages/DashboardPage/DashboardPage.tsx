import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, Button, BackButton } from '@/components/ui'
import QRCode, { downloadQRCode } from '@/components/ui/QRCode'
import type { Booking } from '@/types'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'all'>('today')

  const displayName = user?.name?.trim() ? user.name : 'Hamza'
  const storedSlug = (() => {
    try {
      const raw = localStorage.getItem(`barber:profile:${user?.id || '1'}`)
      if (raw) return JSON.parse(raw).slug
      return localStorage.getItem('barber:lastSlug')
    } catch { return null }
  })()
  const bookingSlug = storedSlug || displayName.toLowerCase().replace(/\s+/g, '-') + '-barber'
  const bookingUrl = `yourdomain.com/barber/${bookingSlug}`
  const bookingFullUrl = `https://${bookingUrl}`

  const hasSetup = typeof window !== 'undefined' && !!localStorage.getItem(`barber:complete:${user?.id || '1'}`)

  // Load bookings from D1/localStorage (MVP)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`barber:bookings:${user?.id || '1'}`) || localStorage.getItem('barber:bookings:1')
      if (raw) setBookings(JSON.parse(raw))
      else {
        // mock for demo if empty
        setBookings([
          { id: '1', barberId: '1', serviceId: '1', customerName: 'Ali Hassan', customerPhone: '+212612345678', customerEmail: null, customerNote: null, date: new Date().toISOString().slice(0,10), startTime: '10:00', endTime: '10:30', price: '50 DH', status: 'confirmed', createdAt: new Date().toISOString() },
          { id: '2', barberId: '1', serviceId: '2', customerName: 'Youssef', customerPhone: '+212698765432', customerEmail: null, customerNote: 'Beard only', date: new Date(Date.now()+86400000).toISOString().slice(0,10), startTime: '14:00', endTime: '14:20', price: '30 DH', status: 'confirmed', createdAt: new Date().toISOString() },
        ] as Booking[])
      }
    } catch {}
  }, [user?.id])

  const todayStr = new Date().toISOString().slice(0,10)
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled').length
  const upcomingBookings = bookings.filter(b => b.date >= todayStr && b.status === 'confirmed').length
  const totalBookings = bookings.length

  const filteredBookings = filter === 'today' ? bookings.filter(b => b.date === todayStr) : filter === 'upcoming' ? bookings.filter(b => b.date >= todayStr) : bookings

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(`https://${bookingUrl}`); window.alert(t('copyLink') + ' ✓') } catch { window.alert(bookingUrl) }
  }

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === id ? { ...b, status } : b)
      try { localStorage.setItem(`barber:bookings:${user?.id || '1'}`, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-0">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton fallback="/" label="Back" />
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.02em] text-primary leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                Good morning, {displayName}
              </h1>
              <p className="text-secondary text-sm mt-1.5">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {t('dashboard')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/setup')} className="min-h-[44px] w-full sm:w-auto">
              ✎ Customize Page
            </Button>
          </div>
        </header>

        {!hasSetup && (
          <Card className="p-5 mb-6 border-gold/30 bg-gold/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Create your booking page</p>
              <p className="text-xs text-secondary mt-0.5">Add photo, services & get shareable URL + QR in 60s</p>
            </div>
            <Button variant="primary" size="sm" className="min-h-[44px] w-full sm:w-auto shrink-0" onClick={() => navigate('/setup')}>
              Create now →
            </Button>
          </Card>
        )}

        {/* Stats — customizable via dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 flex flex-col justify-between min-h-[132px] hover:border-gold/20 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                  {t('todayAppointments')}
                </p>
                <p className="text-3xl font-bold text-primary tracking-tight leading-none">{todayBookings}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/calendar')} className="shrink-0 text-xs">
                {t('viewCalendar')}
              </Button>
            </div>
            <div className="flex gap-1.5 mt-4">
              <button onClick={() => setFilter('today')} className={`text-xs px-2 py-1 rounded-full border ${filter==='today'?'bg-gold text-black border-gold':'border-white/10 text-secondary hover:border-gold/20'}`}>Today</button>
              <button onClick={() => setFilter('upcoming')} className={`text-xs px-2 py-1 rounded-full border ${filter==='upcoming'?'bg-gold text-black border-gold':'border-white/10 text-secondary hover:border-gold/20'}`}>Upcoming</button>
              <button onClick={() => setFilter('all')} className={`text-xs px-2 py-1 rounded-full border ${filter==='all'?'bg-gold text-black border-gold':'border-white/10 text-secondary hover:border-gold/20'}`}>All</button>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between min-h-[132px] hover:border-gold/20 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/bookings')}>
            <div>
              <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                {t('upcoming')}
              </p>
              <p className="text-3xl font-bold text-primary tracking-tight leading-none">{upcomingBookings}</p>
            </div>
            <p className="text-secondary text-xs mt-4 opacity-80">Next 7 days • Click to manage</p>
          </Card>

          <Card className="p-6 flex flex-col justify-between min-h-[132px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                  {t('totalBookings')}
                </p>
                <p className="text-3xl font-bold text-primary tracking-tight leading-none">{totalBookings}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/bookings')} className="shrink-0 text-xs">
                History
              </Button>
            </div>
            <p className="text-secondary text-xs mt-4 opacity-80">All time • Fully customizable</p>
          </Card>
        </div>

        {/* Quick Actions — every dashboard element customizable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">
                {t('quickActions', { defaultValue: 'Quick Actions' })} — Customize
              </h3>
              <span className="text-[11px] text-gold border border-gold/20 rounded-full px-2 py-0.5">8 actions</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/dashboard/services')}>
                <span>✂️</span> {t('servicesManagement')}
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/dashboard/profile')}>
                <span>👤</span> {t('profileManagement')}
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/dashboard/availability')}>
                <span>🕘</span> Availability
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/dashboard/calendar')}>
                <span>📅</span> {t('calendar')}
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={handleCopy}>
                <span>🔗</span> {t('copyLink')}
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/setup')}>
                <span>🎨</span> Appearance
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => navigate('/dashboard/bookings')}>
                <span>📋</span> Bookings
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px] justify-start gap-2" onClick={() => document.getElementById('qr-card')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>▦</span> {t('qrCode')}
              </Button>
            </div>
            <p className="text-xs text-secondary mt-4">Every card, color and link is editable via Services, Profile, Availability and Appearance.</p>
          </Card>

          {/* Booking Link — fully customizable */}
          <Card className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">
                {t('bookingLink')} — Customize
              </h3>
              <button onClick={() => navigate('/setup')} className="text-xs text-gold hover:underline">Edit slug</button>
            </div>
            <div className="mt-5 flex items-center gap-3 bg-black border border-border rounded-xl px-4 py-3.5">
              <span className="text-primary text-sm font-medium truncate flex-1 tracking-tight">
                {bookingUrl}
              </span>
              <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Button variant="primary" size="sm" className="w-full min-h-[44px]" onClick={handleCopy}>
                {t('copyLink')}
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px]" onClick={() => window.open(`https://${bookingUrl}`, '_blank')}>
                View
              </Button>
              <Button variant="outline" size="sm" className="w-full min-h-[44px]" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`https://${bookingUrl}`)}`, '_blank')}>
                Share
              </Button>
            </div>
            <div className="mt-4 bg-black/40 border border-white/[0.06] rounded-xl p-3">
              <p className="text-xs text-secondary">Customize: <span className="text-primary">/setup</span> → change slug, `yourdomain.com/barber/*` updates instantly. QR regenerates automatically.</p>
            </div>
          </Card>
        </div>

        {/* Bookings — filterable, status customizable */}
        <Card className="p-6 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">Recent Bookings — Customize</h3>
            <div className="flex gap-1.5">
              <Button size="sm" variant={filter==='today'?'primary':'ghost'} className="h-7 px-3 text-xs" onClick={() => setFilter('today')}>Today</Button>
              <Button size="sm" variant={filter==='upcoming'?'primary':'ghost'} className="h-7 px-3 text-xs" onClick={() => setFilter('upcoming')}>Upcoming</Button>
              <Button size="sm" variant={filter==='all'?'primary':'ghost'} className="h-7 px-3 text-xs" onClick={() => setFilter('all')}>All</Button>
            </div>
          </div>
          {filteredBookings.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-primary font-medium">{t('noBookings')}</p>
              <p className="text-secondary text-sm mt-1">{t('yourUpcomingBookings')}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/dashboard/calendar')}>Go to Calendar</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.slice(0,6).map(b => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-black/30 hover:border-gold/20 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{b.customerName} • <span className="text-gold">{b.price}</span></p>
                    <p className="text-xs text-secondary mt-0.5">{b.date} {b.startTime}–{b.endTime} • {b.customerPhone}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${b.status==='confirmed'?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':b.status==='pending'?'bg-amber-500/10 text-amber-400 border-amber-500/20':b.status==='cancelled'?'bg-red-500/10 text-red-400 border-red-500/20':'bg-white/5 text-secondary border-white/10'}`}>{b.status}</span>
                    <select value={b.status} onChange={e => updateBookingStatus(b.id, e.target.value as Booking['status'])} className="h-8 rounded-lg bg-card border border-border text-xs text-primary px-2">
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/bookings')} className="flex-1">Manage all bookings →</Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/calendar')} className="flex-1">Calendar →</Button>
          </div>
          <p className="text-xs text-muted mt-3">Tip: Change status (Confirmed/Pending/Completed/Cancelled) — filters update instantly. All bookings persist in <code>localStorage</code> and will sync to D1.</p>
        </Card>

        {/* Appearance + QR — fully customizable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card className="p-6">
            <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">Appearance — Customize</h3>
            <p className="text-sm text-secondary mt-3 leading-relaxed">Black <code className="text-primary">#0B0B0B</code> dominates, Gold <code className="text-gold">#C9A227</code> only for CTA/active. Card <code className="text-primary">#141414</code> Border <code className="text-primary">#242424</code>.</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-12 rounded-xl bg-black border border-border flex items-center justify-center text-xs text-secondary">#0B0B0B</div>
              <div className="h-12 rounded-xl bg-card border border-border flex items-center justify-center text-xs text-gold">#141414</div>
              <div className="h-12 rounded-xl bg-gold flex items-center justify-center text-xs font-bold text-black">#C9A227</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 min-h-[44px]" onClick={() => navigate('/setup')}>Edit profile & colors</Button>
              <Button variant="ghost" size="sm" className="flex-1 min-h-[44px]" onClick={() => window.open('/barber/' + bookingSlug, '_blank')}>Preview page</Button>
            </div>
            <p className="text-xs text-muted mt-3">Change avatar, bio, slug, services, hours → page updates live.</p>
          </Card>

          <Card id="qr-card" className="p-6 flex flex-col items-center text-center">
            <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">Your Booking QR — Customize</h3>
            <div className="mt-5 bg-black border border-border rounded-xl p-4">
              <QRCode value={bookingFullUrl} size={180} bgColor="#0B0B0B" fgColor="#C9A227" />
            </div>
            <p className="text-secondary text-xs mt-3">Scan to book • Updates when slug changes</p>
            <p className="text-primary text-sm font-medium mt-1 truncate max-w-full">{bookingFullUrl}</p>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <Button variant="outline" size="sm" className="w-full min-h-[44px]" onClick={() => downloadQRCode(bookingFullUrl, 400, '#0B0B0B', '#C9A227', `${bookingSlug}-qr.png`)}>
                {t('downloadQR', { defaultValue: 'Download QR' })} PNG
              </Button>
              <Button variant="primary" size="sm" className="w-full min-h-[44px]" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(bookingFullUrl)}`, '_blank')}>
                Share QR
              </Button>
            </div>
            <p className="text-xs text-muted mt-3">Gold on black • 400px • High error correction H</p>
          </Card>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted mt-6">Everything is customizable: <a href="/dashboard/profile" className="text-gold hover:underline">Profile</a> • <a href="/dashboard/services" className="text-gold hover:underline">Services</a> • <a href="/dashboard/availability" className="text-gold hover:underline">Availability</a> • <a href="/dashboard/calendar" className="text-gold hover:underline">Calendar</a> • <a href="/setup" className="text-gold hover:underline">Setup</a> — changes reflect instantly on your public page and booking flow.</p>
      </div>
    </main>
  )
}

export default DashboardPage
