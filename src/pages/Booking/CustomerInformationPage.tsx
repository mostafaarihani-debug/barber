import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Card, Input, Button } from '@/components/ui'

const CustomerInformationPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string; time: string }>()
  const location = useLocation()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const search = new URLSearchParams(location.search)
  // time may come from params.time or ?time=
  const timeParam = params.time || search.get('time') || ''
  const dateParam = search.get('date') || new Date().toISOString().slice(0, 10)
  const serviceId = params.serviceId || '1'

  const [fullName, setFullName] = useState(search.get('name') || '')
  const [phoneNumber, setPhoneNumber] = useState(search.get('phone') || '')
  const [optionalEmail, setOptionalEmail] = useState(search.get('email') || '')
  const [optionalNote, setOptionalNote] = useState(search.get('note') || '')

  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({})

  const validate = () => {
    const next: typeof errors = {}
    if (!fullName.trim() || fullName.trim().length < 2) {
      next.name = t('fullName') + ' is required'
    }
    const phoneClean = phoneNumber.replace(/\s|-|\(|\)/g, '')
    if (!phoneNumber.trim()) {
      next.phone = t('phoneNumber') + ' is required'
    } else if (!/^\+?[0-9]{8,15}$/.test(phoneClean)) {
      next.phone = 'Enter a valid phone (8-15 digits)'
    }
    if (optionalEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionalEmail.trim())) {
      next.email = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validate()) return
    if (!timeParam) {
      // if no time, go back to time selection
      navigate(`/booking/times/${serviceId}?date=${encodeURIComponent(dateParam)}`)
      return
    }
    const qs = new URLSearchParams({
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      date: dateParam,
    })
    if (optionalEmail.trim()) qs.set('email', optionalEmail.trim())
    if (optionalNote.trim()) qs.set('note', optionalNote.trim())
    navigate(`/booking/confirmation/${serviceId}/${encodeURIComponent(timeParam)}?${qs.toString()}`)
  }

  const isValid = useMemo(() => {
    const nameOk = fullName.trim().length >= 2
    const phoneOk = /^\+?[0-9\s\-()]{8,15}$/.test(phoneNumber.trim()) && phoneNumber.replace(/\D/g, '').length >= 8
    const emailOk = !optionalEmail.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionalEmail.trim())
    return nameOk && phoneOk && emailOk
  }, [fullName, phoneNumber, optionalEmail])

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#F5F5F0] mb-1 leading-tight">{t('customerInformation')}</h1>
        {timeParam && (
          <p className="text-[#A8A8A3] text-[13px] mb-5">
            {timeParam} · {dateParam}
          </p>
        )}

        <Card className="p-5 sm:p-6 bg-[#141414] border border-[#242424] rounded-xl">
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="text-[#A8A8A3] text-[12px] uppercase tracking-wider mb-1.5 block">{t('fullName')} *</label>
              <Input
                placeholder={t('fullName')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                error={errors.name}
                className="bg-black/40 border-[#242424] text-[#F5F5F0] placeholder:text-[#A8A8A3] focus:border-[#C9A227]/30 focus:ring-[#C9A227]/20"
                style={{ minHeight: 44 }}
              />
            </div>

            <div>
              <label className="text-[#A8A8A3] text-[12px] uppercase tracking-wider mb-1.5 block">{t('phoneNumber')} *</label>
              <Input
                type="tel"
                placeholder={t('phoneNumber')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                error={errors.phone}
                className="bg-black/40 border-[#242424] text-[#F5F5F0] placeholder:text-[#A8A8A3] focus:border-[#C9A227]/30 focus:ring-[#C9A227]/20"
                style={{ minHeight: 44 }}
              />
            </div>

            <div>
              <label className="text-[#A8A8A3] text-[12px] uppercase tracking-wider mb-1.5 block">{t('optionalEmail')}</label>
              <Input
                type="email"
                placeholder={t('optionalEmail')}
                value={optionalEmail}
                onChange={(e) => setOptionalEmail(e.target.value)}
                error={errors.email}
                className="bg-black/40 border-[#242424] text-[#F5F5F0] placeholder:text-[#A8A8A3] focus:border-[#C9A227]/30 focus:ring-[#C9A227]/20"
                style={{ minHeight: 44 }}
              />
            </div>

            <div>
              <label className="text-[#A8A8A3] text-[12px] uppercase tracking-wider mb-1.5 block">{t('optionalNote')}</label>
              <Input
                placeholder={t('optionalNote')}
                value={optionalNote}
                onChange={(e) => setOptionalNote(e.target.value)}
                className="bg-black/40 border-[#242424] text-[#F5F5F0] placeholder:text-[#A8A8A3] focus:border-[#C9A227]/30 focus:ring-[#C9A227]/20"
                style={{ minHeight: 44 }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full min-h-[44px] mt-2 bg-[#C9A227] text-black hover:bg-[#E0B83F] disabled:opacity-40"
              disabled={!isValid}
            >
              {t('confirmBooking')}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}

export default CustomerInformationPage
