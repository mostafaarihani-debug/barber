import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui'

const ServiceSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const services = [
    { id: '1', name: 'Haircut', price: '50 DH', duration: 30 },
    { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20 },
    { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45 },
  ]

  const selectService = (service: (typeof services)[0]) => {
    navigate(`/booking/confirm/${service.id}`)
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#F5F5F0] mb-2 leading-tight">
          {t('chooseAService')}
        </h1>
        <p className="text-[#A8A8A3] text-[14px] mb-6">{t('selectServiceFirst') ?? ''}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id}
              onClick={() => selectService(service)}
              className="p-6 text-center bg-[#141414] border border-[#242424] rounded-xl hover:border-[#C9A227]/20 transition-colors duration-150 cursor-pointer select-none min-h-[140px] flex flex-col items-center justify-center"
            >
              <div className="text-[32px] font-bold tracking-tight text-[#C9A227] mb-2 leading-none">{service.price}</div>
              <h3 className="text-[#F5F5F0] font-semibold text-[17px] leading-tight mb-1">{service.name}</h3>
              <p className="text-[#A8A8A3] text-[13px]">{t(`duration${service.duration}`, { duration: service.duration })}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#242424]">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#F5F5F0] mb-2">{t('availableSlots')}</h2>
          <p className="text-[#A8A8A3] text-[14px] leading-relaxed">{t('selectServiceFirst')}</p>
        </div>
      </div>
    </main>
  )
}

export default ServiceSelectionPage
