import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Button } from '@/components/ui'

const CalendarPage: React.FC = () => {
  const { t } = useTranslation()

  const months = [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ]

  const today = new Date()
  const [selectedDate, setSelectedDate] = React.useState(today)

  const navigateToMonth = (delta: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setSelectedDate(newDate)
  }

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  return (
    <main className="min-h-screen bg-black p-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Calendar Header */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToMonth(-1)}
              >
                Previous
              </Button>
              <span className="text-black font-medium">
                {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToMonth(1)}
              >
                Next
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(today)}
              >
                Today
              </Button>
            </div>
          </div>
        </Card>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div key={day} className="p-2 text-center text-secondary text-xs uppercase">
              {t(`day${day}`)}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mt-4">
          {/* Empty cells before first day */}
          {[...Array(firstDayOfMonth(today))].map((_, i) => (
            <div key={i} className="h-20"></div>
          ))}

          {/* Days of the month */}
          {[...Array(daysInMonth(today))].map((_, i) => {
            const day = i + 1
            const date = new Date(today.getFullYear(), today.getMonth(), day)
            const isToday =
              day === today.getDate() &&
              today.getMonth() === new Date().getMonth() &&
              today.getFullYear() === new Date().getFullYear()
            const isDifferentMonth =
              selectedDate.getMonth() !== new Date().getMonth() ||
              selectedDate.getFullYear() !== new Date().getFullYear()

            return (
              <div
                key={day}
                className={isToday ? 'bg-gold text-black' : 'bg-card text-black'}
                onClick={() => setSelectedDate(new Date(today.getFullYear(), today.getMonth(), day))}
              >
                {day}
              </div>
            )
          })}

          {/* Empty cells after last day */}
          {[...Array(42 - firstDayOfMonth(today) - daysInMonth(today))].map(
            (_, i) => {
              const index = daysInMonth(today) + firstDayOfMonth(today) + i
              return (
                <div key={index} className="h-20"></div>
              )
            }
          )}
        </div>
      </div>
    </main>
  )
}

export default CalendarPage