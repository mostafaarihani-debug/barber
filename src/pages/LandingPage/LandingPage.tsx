import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useSEO } from '@/components/seo'

const LandingPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useSEO({
    title: 'Premium Barber Booking — Your barber page, your bookings',
    description: 'Each barber gets a private shareable booking page. Share via Instagram, WhatsApp, QR. Customers book without an account. Mobile-first, luxury black & gold.',
    type: 'website',
  })

  const handleCreate = () => {
    if (user) navigate('/setup')
    else navigate('/register')
  }

  return (
    <main className="min-h-screen bg-black text-secondary">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold text-black flex items-center justify-center font-extrabold text-sm">HB</div>
            <span className="font-bold tracking-tight text-primary">Premium Barber</span>
            <span className="hidden sm:inline text-xs tracking-widest uppercase text-secondary border border-white/10 rounded-full px-2 py-0.5">Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/barber/hamza-barber" className="hidden sm:inline-flex h-9 px-4 rounded-xl border border-white/10 text-sm font-medium text-secondary hover:text-primary hover:border-gold/20 items-center">View demo</a>
            {user ? (
              <Button size="sm" variant="secondary" className="min-h-[36px]" onClick={() => navigate('/dashboard')}>{t('dashboard')}</Button>
            ) : (
              <Button size="sm" variant="ghost" className="min-h-[36px]" onClick={() => navigate('/login')}>{t('login')}</Button>
            )}
            <Button size="sm" variant="primary" className="min-h-[36px] px-5" onClick={handleCreate}>
              {user ? 'Create page' : 'Start free'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold border border-gold/20 rounded-full px-3 py-1 bg-gold/5">Mobile-first • Luxury • Fast</p>
            <h1 className="mt-4 text-[32px] sm:text-[44px] font-extrabold tracking-[-0.03em] leading-[0.95] text-primary">
              Your barber page.<br />
              <span className="text-gold">Your bookings.</span><br />
              Your brand.
            </h1>
            <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-secondary max-w-[560px]">
              Not a marketplace. Each barber gets a <span className="text-primary font-medium">private shareable URL</span> — share via Instagram, WhatsApp, TikTok, QR. Customers open your page and book in 30 seconds. No account required.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCreate} className="h-12 px-8 text-[15px] w-full sm:w-auto">
                {user ? 'Create your booking page →' : 'Create your page — free'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/barber/hamza-barber')} className="h-12 px-6 w-full sm:w-auto">
                View demo barber
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user ? `Signed in as ${user.name} • ${user.email}` : 'No credit card • Setup in 60s • Works on 375px → Desktop'}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-card border border-border text-secondary">yourdomain.com/barber/<b className="text-primary">hamza-barber</b></span>
              <span className="px-3 py-1.5 rounded-full bg-card border border-border text-secondary">QR • Instagram • WhatsApp</span>
            </div>
          </div>

          {/* Phone mock - premium barber mini-site preview */}
          <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
            <div className="rounded-[32px] bg-[#0F0F0F] border border-white/10 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="rounded-[24px] bg-black border border-white/[0.06] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="p-5 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-gold/20 flex items-center justify-center mx-auto">
                    <span className="text-xl font-extrabold text-gold">HB</span>
                  </div>
                  <p className="mt-3 font-bold text-primary">Hamza Barber</p>
                  <p className="text-xs text-secondary">Marrakech • ★ 4.9 • 127 reviews</p>
                </div>
                <div className="px-4 pb-4 space-y-3">
                  <div className="rounded-xl bg-card border border-white/[0.06] p-3 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-primary">Haircut</p><p className="text-xs text-secondary">30 min</p></div>
                    <span className="text-sm font-bold text-gold">50 DH</span>
                  </div>
                  <div className="rounded-xl bg-card border border-white/[0.06] p-3 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-primary">Beard Trim</p><p className="text-xs text-secondary">20 min</p></div>
                    <span className="text-sm font-bold text-gold">30 DH</span>
                  </div>
                  <div className="w-full h-11 rounded-xl bg-gold text-black font-bold flex items-center justify-center text-sm">Book Appointment</div>
                  <p className="text-center text-[11px] text-secondary">yourdomain.com/barber/hamza-barber</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full px-3 py-1.5 text-xs text-secondary shadow">iPhone 12 Pro • 390×844</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { n: '1', t: 'Create profile', d: 'Photo, name, phone, bio, location' },
            { n: '2', t: 'Add services', d: 'Haircut 50 DH • 30min, Beard 30 DH…' },
            { n: '3', t: 'Share URL + QR', d: 'yourdomain.com/barber/you → Instagram, WhatsApp, QR' },
          ].map(s => (
            <Card key={s.n} className="p-5 sm:p-6">
              <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm font-bold">{s.n}</div>
              <h3 className="mt-3 font-semibold text-primary">{s.t}</h3>
              <p className="text-sm text-secondary mt-1 leading-relaxed">{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">For customers</h3>
            <ul className="mt-4 space-y-2 text-sm text-secondary leading-relaxed">
              <li>• Open barber link → choose service → date → time → name/phone → confirm</li>
              <li>• No account required • 30 seconds • Works on 375px</li>
              <li>• RTL العربية • Français • English</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">For barbers</h3>
            <ul className="mt-4 space-y-2 text-sm text-secondary leading-relaxed">
              <li>• Dashboard: Today 8 • Upcoming 17 • Total 126</li>
              <li>• Services, Availability, Calendar, Bookings, QR</li>
              <li>• Copy link, WhatsApp share, Download QR PNG</li>
            </ul>
          </Card>
          <Card className="p-6 bg-gold/5 border-gold/20">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">Own your brand</h3>
            <p className="mt-3 text-sm text-secondary leading-relaxed">Not a marketplace — customers come via <i>your</i> link. You keep the relationship. Add to Instagram bio, business card, QR.</p>
            <Button onClick={handleCreate} className="w-full mt-5">Create your page</Button>
          </Card>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-y border-white/[0.06] bg-card/50">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-primary">Ready to get booked?</h3>
            <p className="text-sm text-secondary mt-1">Setup in 60s • Shareable URL • QR included</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button onClick={handleCreate} className="flex-1 sm:flex-none h-11 px-8">Create your barber page</Button>
            <Button variant="outline" onClick={() => navigate('/barber/hamza-barber')} className="hidden sm:inline-flex h-11">View demo</Button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} Premium Barber Booking • Black #0B0B0B • Gold #C9A227 • Inter • Cloudflare Pages</p>
        <p className="mt-1"><a href="/login" className="hover:text-primary underline">Barber login</a> • <a href="/register" className="hover:text-primary underline">Create account</a> • <a href="/dashboard" className="hover:text-primary underline">Dashboard</a> • <a href="/barber/hamza-barber" className="hover:text-primary underline">Demo barber</a></p>
      </footer>
    </main>
  )
}

export default LandingPage
