import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const TimeSelectionPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()

  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const startHour = 9
    const endHour = 20
    const slots: Array<{ time: string; available: boolean }> = []

    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      slots.push({ time, available: Math.random() > 0.3 })
    }

    setTimeSlots(slots)
    setLoading(false)
  }, [params.serviceId])

  const selectTime = (time: string) => {
    navigate(`/booking/customer/${params.serviceId}?time=${time}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span>{t('loading')}</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          {t('chooseATime')}
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => {
            const isAvailable = slot.available
            return (
              <Button
                key={slot.time}
                variant="outline"
                size="sm"
                disabled={!isAvailable}
                onClick={() => isAvailable && selectTime(slot.time)}
              >
                {slot.time}
              </Button>
            )
          })}
        </div>

        {!loading && (
          <div className="mt-8 pt-8 border-t border-border">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/booking/customer')}
            >
              {t('confirmBooking')}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default TimeSelectionPage