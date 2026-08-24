import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const DateSelectionPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()

  const services = [
    { id: '1', name: 'Haircut', duration: 30 },
    { id: '2', name: 'Beard Trim', duration: 20 },
    { id: '3', name: 'Haircut + Beard', duration: 45 },
  ]

  const service = services.find((s) => s.id === params.serviceId)

  const navigateToTimeSelection = () => {
    navigate(`/booking/times/${params.serviceId}`)
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          {t('chooseADate')}
        </h1>

        {service ? (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <p className="text-secondary text-sm mb-2">{t('service')}</p>
                <p className="text-black font-medium">{service?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gold font-medium">{service?.price}</p>
                <p className="text-secondary text-sm">{t(`duration${service?.duration}`, { duration: service.duration })}</p>
              </div>
            </div>

            <p className="text-secondary mb-6">
              {t('selectDateAvailable')}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {/* Today button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/booking/confirm/${params.serviceId}?date=2026-08-24`)}>
                {t('today')}
              </Button>

              {/* Tomorrow button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/booking/confirm/${params.serviceId}?date=2026-08-25`)}>
                {t('tomorrow')}
              </Button>
            </div>
          </Card>
        ) : (
          <p className="text-secondary text-large">{t('serviceNotFound')}</p>
        )}
      </div>
    </main>
  )
}

export default DateSelectionPage