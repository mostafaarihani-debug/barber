import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Input, Button } from '@/components/ui'

const AvailabilityManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const daysOfWeek = [
    { key: 0, name: t('sunday') },
    { key: 1, name: t('monday') },
    { key: 2, name: t('tuesday') },
    { key: 3, name: t('wednesday') },
    { key: 4, name: t('thursday') },
    { key: 5, name: t('friday') },
    { key: 6, name: t('saturday') },
  ]

  const [availability, setAvailability] = useState<
    Array<{ day: number; start: string; end: string }>
  >([
    { day: 1, start: '09:00', end: '20:00' }, // Monday
    { day: 2, start: '09:00', end: '20:00' }, // Tuesday
    { day: 3, start: '09:00', end: '20:00' }, // Wednesday
    { day: 4, start: '09:00', end: '20:00' }, // Thursday
    { day: 5, start: '09:00', end: '20:00' }, // Friday
    { day: 6, start: '09:00', end: '20:00' }, // Saturday
  ])

  const [breaks, setBreaks] = useState<
    Array<{ day: number; start: string; end: string }>
  >([])

  const handleAddAvailability = (day: number) => {
    const dayAvailability = availability.find((a) => a.day === day)
    if (dayAvailability) {
      setAvailability(
        availability.map((a) =>
          a.day === day ? { ...dayAvailability, start: '09:00', end: '20:00' } : a
        )
      )
    } else {
      setAvailability([...availability, { day, start: '09:00', end: '20:00' }])
    }
  }

  const handleRemoveAvailability = (day: number) => {
    setAvailability(availability.filter((a) => a.day !== day))
  }

  const handleAddBreak = () => {
    setBreaks([...breaks, { day: 1, start: '12:00', end: '13:00' }])
  }

  return (
    <main className="min-h-screen bg-black p-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">
          {t('availabilityManagement')}
        </h1>

        {/* Working Hours Section */}
        <Card className="mb-6">
          <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">
            {t('workingHours')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {daysOfWeek.map((day) => (
              <div
                key={day.key}
                className="p-3 border border-border rounded-md bg-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-secondary text-sm">
                    {day.key === 0 ? t('dayOff') : t(day.name)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAvailability(day.key)}
                    disabled={day.key === 0}
                  >
                    {t('remove')}
                  </Button>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">
                    {t('from')}
                  </div>
                  <Input
                    placeholder="09:00"
                    defaultValue="09:00"
                    style={{ width: '50px' }}
                  />
                  <span className="mx-1">→</span>
                  <Input
                    placeholder="20:00"
                    defaultValue="20:00"
                    style={{ width: '50px' }}
                  />
                  <span className="text-secondary text-sm">({t(day.key === 0 ? 'dayOff' : day.name)})</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAvailability(day.key)}
                  disabled={day.key === 0}
                >
                  {t('add')}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Breaks Section */}
        <Card className="mb-6">
          <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">{t('breaks')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddBreak}
            >
              {t('addBreak')}
            </Button>
            {breaks.map((breakItem, index) => (
              <div
                key={index}
                className="p-3 border border-border rounded-md bg-card text-xs text-secondary"
              >
                {t(`day${breakItem.day}`)}:
                {' '}
                {breakItem.start} → {breakItem.end}
              </div>
            ))}
          </div>
        </Card>

        {/* Blocked Dates Section */}
        <Card>
          <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">
            {t('blockedDates')}
          </h3>
          <p className="text-secondary text-sm mb-4">
            {t('addBlockedDates')}
          </p>
          <Button
            variant="outline"
            size="sm"
            style={{ width: '100%' }}
          >
            {t('addBlockedDate')}
          </Button>
        </Card>
      </div>
    </main>
  )
}

export default AvailabilityManagementPage