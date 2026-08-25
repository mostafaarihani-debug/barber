import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Input, Button } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'
import type { Service } from '@/types'

const CustomerInformationPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string; time: string }>()
  const [searchParams] = useSearchParams()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const [service, setService] = useState<Service | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})

  const dateISO = searchParams.get('date') || (()=>{ try{return localStorage.getItem('barber:currentBookingDate')||''}catch{return ''}})()
  const timeParam = params.time ? decodeURIComponent(params.time) : ''

  useEffect(() => {
    const slug = (()=>{ try{return localStorage.getItem('barber:currentBookingSlug') || localStorage.getItem('barber:lastSlug') || 'hamza-barber'}catch{return 'hamza-barber'}})()
    apiGetBarber(slug).then(({ services }) => {
      const found = (services as Service[]).find(s=>s.id===params.serviceId)
      if (found) setService(found)
    }).catch(()=>{})
    // fallback to localStorage
    try {
      const raw = localStorage.getItem('barber:services:1')
      if (raw && !service) {
        const local = JSON.parse(raw) as Service[]
        const lf = local.find(s=>s.id===params.serviceId)
        if (lf) setService(lf)
      }
    } catch {}
  }, [params.serviceId])

  const validate = () => {
    const e: Record<string,string> = {}
    if (!customerName.trim() || customerName.trim().length < 2) e.name = 'Name required (≥2)'
    if (!customerPhone.trim() || !/^\+?[0-9\s-]{8,15}$/.test(customerPhone)) e.phone = 'Valid phone required'
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length===0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const q = new URLSearchParams({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim(),
      note: note.trim(),
      date: dateISO,
    }).toString()
    navigate(`/booking/confirmation/${params.serviceId}/${encodeURIComponent(timeParam)}?${q}`)
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-primary mb-2 leading-tight">
          {t('customerInformation')}
        </h1>
        {service && <p className="text-secondary text-sm mb-6">{service.name} • {service.price} • {dateISO} {timeParam}</p>}
        {!service && <p className="text-secondary text-sm mb-6">{dateISO} {timeParam}</p>}

        <Card className="p-6">
          <div className="grid gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('fullName', { defaultValue: 'Full Name *' })}</label>
              <Input placeholder={t('fullName', { defaultValue: 'Full Name' })} value={customerName} onChange={e=>setCustomerName(e.target.value)} error={errors.name} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('phoneNumber', { defaultValue: 'Phone *' })}</label>
              <Input type="tel" placeholder={t('phoneNumber', { defaultValue: 'Phone' })} value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} error={errors.phone} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('optionalEmail', { defaultValue: 'Email (optional)' })}</label>
              <Input type="email" placeholder={t('optionalEmail', { defaultValue: 'Email' })} value={customerEmail} onChange={e=>setCustomerEmail(e.target.value)} error={errors.email} className="min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-secondary mb-1.5 block">{t('optionalNote', { defaultValue: 'Note (optional)' })}</label>
              <Input placeholder={t('optionalNote', { defaultValue: 'Note' })} value={note} onChange={e=>setNote(e.target.value)} className="min-h-[44px]" />
            </div>
          </div>
        </Card>

        <div className="mt-8 pt-6 border-t border-border">
          <Button variant="primary" className="w-full min-h-[44px]" onClick={handleSubmit}>
            {t('confirmBooking')}
          </Button>
          <p className="text-xs text-secondary text-center mt-3">No account required • Confirmation on next step</p>
        </div>
      </div>
    </main>
  )
}

export default CustomerInformationPage
