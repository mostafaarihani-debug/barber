import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, BackButton } from '@/components/ui'
import QRCode, { downloadQRCode } from '@/components/ui/QRCode'
import { useAuth } from '@/contexts/AuthContext'
import { slugify, isSlugAvailable } from '@/utils/slugify'
import { apiSetup } from '@/lib/api'
import type { Service, BarberProfile } from '@/types'

type Step = 1 | 2 | 3

const SetupPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const [step, setStep] = useState<Step>(1)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [slug, setSlug] = useState(() => slugify(user?.name || 'hamza-barber'))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState(user?.email || '')
  const [location, setLocation] = useState('Marrakech, Morocco')
  const [bio, setBio] = useState('Professional barber • 10 years • Precision fades')
  const [instagram, setInstagram] = useState('')
  const [services, setServices] = useState<Service[]>([
    { id: '1', barberId: user?.id || '1', name: 'Haircut', description: '', price: '50 DH', duration: 30, active: true },
    { id: '2', barberId: user?.id || '1', name: 'Beard Trim', description: '', price: '30 DH', duration: 20, active: true },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  // auto slug from name
  useEffect(() => {
    if (!slugManuallyEdited && displayName) setSlug(slugify(displayName))
  }, [displayName, slugManuallyEdited])

  const slugStatus = useMemo(() => {
    if (!slug) return null
    const ok = /^[a-z0-9-]{3,30}$/.test(slug)
    if (!ok) return { type: 'error' as const, msg: '3-30 letters, numbers or -' }
    const available = isSlugAvailable(slug, user?.id)
    return available ? { type: 'ok' as const, msg: t('setup.slugAvailable', { defaultValue: 'Available ✓' }) } : { type: 'error' as const, msg: t('setup.slugTaken', { defaultValue: 'Taken ✗ try another' }) }
  }, [slug, t, user?.id])

  const fullUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://barber-booking-app.pages.dev'
    return `${origin}/barber/${slug}`
  }, [slug])

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!displayName.trim()) e.displayName = t('pleaseFillFields')
    if (!phone.trim() || !/^\+?[0-9\s-]{8,15}$/.test(phone)) e.phone = 'Valid phone required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (!slug || slugStatus?.type === 'error') e.slug = slugStatus?.msg || 'Invalid slug'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (services.length === 0) e.services = 'Add at least 1 service'
    services.forEach(s => {
      if (!s.name.trim()) e[`name-${s.id}`] = 'Name required'
      if (!s.price.trim()) e[`price-${s.id}`] = 'Price required'
      if (!s.duration || s.duration <= 0) e[`duration-${s.id}`] = 'Duration >0'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) { setErrors({ avatar: 'Max 2MB' }); return }
    const r = new FileReader()
    r.onload = () => setAvatar(r.result as string)
    r.readAsDataURL(f)
  }

  const addService = () => {
    setServices(prev => [...prev, { id: String(Date.now()), barberId: user?.id || '1', name: '', description: '', price: '', duration: 30, active: true }])
  }
  const updateService = (id: string, patch: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }
  const removeService = (id: string) => setServices(prev => prev.filter(s => s.id !== id))

  const handleGenerate = async () => {
    if (!validateStep1() || !validateStep2()) { setStep(1); return }
    setSaving(true)
    setApiError('')
    try {
      // Real D1 via Worker API (with localStorage fallback)
      await apiSetup({
        slug,
        displayName: displayName.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        whatsapp: phone.trim(),
        instagram: instagram.trim() || undefined,
        location: location.trim(),
        avatar,
        services: services.map(s => ({ ...s, barberId: user?.id || '1' })),
      })
      // also keep local cache for instant public page
      try {
        const profile: BarberProfile = {
          id: user?.id || '1',
          userId: user?.id || '1',
          slug,
          displayName: displayName.trim(),
          bio: bio.trim(),
          avatar,
          phone: phone.trim(),
          whatsapp: phone.trim(),
          instagram: instagram.trim() || null,
          location: location.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(`barber:profile:${user?.id || '1'}`, JSON.stringify(profile))
        localStorage.setItem(`barber:services:${user?.id || '1'}`, JSON.stringify(services))
        localStorage.setItem(`barber:complete:${user?.id || '1'}`, '1')
        localStorage.setItem('barber:lastSlug', slug)
      } catch {}
      setGenerated(true)
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setApiError(e.message || 'Failed to save — try another slug')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(fullUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-8" dir={dir}>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton fallback="/dashboard" />
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
              {t('setup.title', { defaultValue: 'Create your booking page' })}
            </h1>
            <p className="text-secondary text-sm mt-1">{t('setup.subtitle', { defaultValue: 'Profile picture, contact, services → shareable link + QR' })}</p>
          </div>
          <a href="/dashboard" className="hidden sm:inline-flex text-sm text-secondary hover:text-primary">{t('dashboard')}</a>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {([1,2,3] as Step[]).map(n => (
            <React.Fragment key={n}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step>=n ? 'bg-gold border-gold text-black' : 'bg-card border-border text-secondary'}`}>{n}</div>
              <div className="flex-1 h-[2px] bg-white/[0.06] last:hidden">
                <div className={`h-full bg-gold transition-all ${step>=n ? 'w-full' : 'w-0'}`} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-2 text-xs mb-6">
          <span className={step===1?'text-gold':'text-secondary'}>{t('setup.stepProfile', { defaultValue: '1. Profile' })}</span>
          <span className={step===2?'text-gold':'text-secondary'}>{t('setup.stepServices', { defaultValue: '2. Services' })}</span>
          <span className={step===3?'text-gold':'text-secondary'}>{t('setup.stepShare', { defaultValue: '3. Share' })}</span>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-7">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-primary mb-5">{t('setup.profileInfo', { defaultValue: 'Profile' })}</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="shrink-0 cursor-pointer group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black border-2 border-dashed border-white/10 group-hover:border-gold/30 flex items-center justify-center overflow-hidden">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-gold">{displayName.slice(0,2).toUpperCase() || 'HB'}</span>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  <span className="mt-2 block text-xs text-center text-gold"> {t('setup.uploadImage', { defaultValue: 'Upload' })} </span>
                  {errors.avatar && <p className="text-xs text-red-400 text-center mt-1">{errors.avatar}</p>}
                </label>
                <div className="flex-1 grid gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('setup.displayName', { defaultValue: 'Barber name *' })}</label>
                    <Input placeholder="Hamza Barber" value={displayName} onChange={e=>setDisplayName(e.target.value)} error={errors.displayName} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('setup.slug', { defaultValue: 'URL slug *' })}</label>
                    <div className="flex gap-2">
                      <span className="hidden sm:flex items-center text-xs text-muted px-3 rounded-xl bg-black/40 border border-border">/barber/</span>
                      <div className="flex-1">
                        <Input value={slug} onChange={e=>{ setSlugManuallyEdited(true); const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0,40); setSlug(v); if (errors.slug) setErrors(prev => { const n = { ...prev } as any; delete n.slug; return n; }); setApiError(''); }} placeholder="hamza-barber" error={errors.slug} />
                        {!errors.slug && slugStatus && <p className={`text-xs mt-1 ${slugStatus.type==='ok'?'text-emerald-400':'text-red-400'}`}>{slugStatus.msg}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1 truncate">{fullUrl}</p>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('phone', { defaultValue: 'Phone *' })}</label>
                  <Input placeholder="+212 6xx xxxx xx" value={phone} onChange={e=>setPhone(e.target.value)} error={errors.phone} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('email', { defaultValue: 'Email *' })}</label>
                  <Input placeholder="hamza@example.com" value={email} onChange={e=>setEmail(e.target.value)} error={errors.email} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('location', { defaultValue: 'Location' })}</label>
                  <Input placeholder="Marrakech, Morocco" value={location} onChange={e=>setLocation(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('instagram', { defaultValue: 'Instagram' })}</label>
                  <Input placeholder="@hamza.barber" value={instagram} onChange={e=>setInstagram(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('bio', { defaultValue: 'Bio' })}</label>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="Professional barber • 10 years • Precision fades" className="w-full rounded-xl border border-border bg-black/40 px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 min-h-[88px]" />
                </div>
              </div>
            </Card>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 sm:flex-none sm:min-w-[160px] min-h-[44px]" onClick={()=>{ if(validateStep1()) setStep(2)}}>{t('setup.next', { defaultValue: 'Next → Services' })}</Button>
              <Button variant="ghost" className="min-h-[44px]" onClick={()=>navigate('/dashboard')}>{t('cancel')}</Button>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">{t('services', { defaultValue: 'Services & Prices' })} — {services.length}</h3>
                <Button size="sm" variant="outline" onClick={addService} className="min-h-[44px]">{t('addService', { defaultValue: '+ Add Service' })}</Button>
              </div>
              {errors.services && <p className="text-sm text-red-400 mb-3">{errors.services}</p>}
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s.id} className="rounded-xl border border-white/[0.06] bg-black/40 p-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
                    <Input placeholder={t('serviceName', { defaultValue: 'Haircut' })} value={s.name} onChange={e=>updateService(s.id, { name: e.target.value })} error={errors[`name-${s.id}`]} className="min-h-[44px]" />
                    <Input placeholder="50 DH" value={s.price} onChange={e=>updateService(s.id, { price: e.target.value })} error={errors[`price-${s.id}`]} className="min-h-[44px] sm:w-[120px]" />
                    <Input placeholder="30" type="number" value={String(s.duration)} onChange={e=>updateService(s.id, { duration: parseInt(e.target.value)||0 })} error={errors[`duration-${s.id}`]} className="min-h-[44px] sm:w-[100px]" />
                    <Button variant="ghost" size="sm" onClick={()=>removeService(s.id)} className="min-h-[44px] text-red-400 hover:bg-red-500/10">✕</Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-4">Set duration in minutes. Used for time-slot engine (no double booking).</p>
            </Card>
            {apiError && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{apiError}</p>}
            <div className="flex gap-3">
              <Button variant="ghost" className="min-h-[44px]" onClick={()=>setStep(1)}>← {t('setup.back', { defaultValue: 'Back' })}</Button>
              <Button variant="primary" className="flex-1 min-h-[44px]" onClick={handleGenerate} loading={saving} disabled={saving}>{saving ? 'Saving...' : t('setup.generate', { defaultValue: 'Generate URL + QR →' })}</Button>
            </div>
          </div>
        )}

        {/* Step 3: Share */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gold text-black flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h3 className="text-xl font-bold text-primary mt-4">{t('setup.complete', { defaultValue: 'Your booking page is ready!' })}</h3>
              <p className="text-secondary text-sm mt-1">Share this link anywhere — Instagram, WhatsApp, TikTok</p>
              <div className="mt-6 bg-black border border-gold/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
                <span className="flex-1 text-sm font-mono text-gold truncate">{fullUrl}</span>
                <Button size="sm" variant="primary" onClick={handleCopy} className="min-h-[44px] w-full sm:w-auto">{copied ? '✓ Copied' : t('copyLink', { defaultValue: 'Copy Link' })}</Button>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="bg-white p-3 rounded-2xl">
                  <QRCode value={fullUrl} size={180} bgColor="#ffffff" fgColor="#0B0B0B" />
                </div>
              </div>
              <p className="text-xs text-secondary mt-3">Scan to book — {displayName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <Button variant="outline" className="min-h-[44px]" onClick={()=>downloadQRCode(fullUrl, 600, '#0B0B0B', '#C9A227', `${slug}-qr.png`)}>{t('downloadQR', { defaultValue: 'Download QR' })}</Button>
                <a href={`https://wa.me/?text=${encodeURIComponent(fullUrl)}`} target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-xl border border-white/10 h-11 text-sm font-semibold text-primary hover:border-gold/20 hover:text-gold">WhatsApp</a>
                <Button variant="primary" className="min-h-[44px]" onClick={()=>window.open(`/barber/${slug}`, '_blank')}>{t('viewPublicPage', { defaultValue: 'View Page' })}</Button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1 min-h-[44px]" onClick={()=>setStep(2)}>{t('setup.back', { defaultValue: 'Back' })}</Button>
                <Button variant="primary" className="flex-1 min-h-[44px]" onClick={()=>navigate('/dashboard')}>{t('dashboard')}</Button>
              </div>
            </Card>
            {generated && <p className="text-center text-xs text-emerald-400">Saved to this device. Next: connect D1/R2 for permanent storage.</p>}
          </div>
        )}
      </div>
    </main>
  )
}

export default SetupPage
