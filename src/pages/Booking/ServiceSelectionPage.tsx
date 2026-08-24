import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input } from '@/components/ui'

const ServiceSelectionPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ barberId: string }>()

  const services = [
    { id: '1', name: 'Haircut', price: '50 DH', duration: 30 },
    { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20 },
    { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45 },
  ]

  const selectService = (service: typeof services[0]) => {
    navigate(`/booking/confirm/${service.id}`)
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">{t('chooseAService')}</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className="p-6 text-center hover:border-gold/30 transition-colors cursor-pointer"
              onClick={() => selectService(service)}
            >
              <div className="text-4xl font-bold text-gold mb-2">{service.price}</div>
              <h3 className="text-black mb-1">{service.name}</h3>
              <p className="text-secondary text-sm">{t(`duration${service.duration}`, { duration: service.duration })}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <h2 className="text-xl font-medium text-black mb-4">{t('availableSlots')}</h2>
          <p className="text-secondary mb-4">
            {t('selectServiceFirst')}
          </p>
        </div>
      </div>
    </main>
  )
}

export default ServiceSelectionPage