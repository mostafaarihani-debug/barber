import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const BookingConfirmationPage: React.FC = () => {
  const { t } = useTranslation()
  const params = useParams<{
    serviceId: string
    time: string
    name: string
    phone: string
    email: string
    note: string
  }>()
  const location = useLocation()
  const navigate = useNavigate()

  const service = {
    id: params.serviceId,
    name: t('hairservice'), // Would come from DB
    price: t('price50'), // Would come from DB
    duration: 30,
  }

  const bookingDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const bookingTime = params.time

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="text-6xl font-bold text-gold mb-2">✓</div>
          <h2 className="text-2xl font-bold text-black mb-1">{t('bookingConfirmed')}</h2>
          <p className="text-secondary mb-8">{t('thankYou', { name: params.name })}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('service')}</p>
              <p className="text-black h1">{service.name}</p>
            </div>
            <div>
              <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('price')}</p>
              <p className="text-gold h1">{service.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('date')}</p>
              <p className="text-black h1">{bookingDate}</p>
            </div>
            <div>
              <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('time')}</p>
              <p className="text-black h1">{bookingTime}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-secondary text-sm mb-2">{t('customer')}</p>
            <p className="text-black h1">{params.name}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              {t('backToBarber')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookingConfirmationPage