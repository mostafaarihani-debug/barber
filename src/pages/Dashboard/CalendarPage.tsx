import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Button, BackButton } from '@/components/ui'

const CalendarPage: React.FC = () => {
  const { t } = useTranslation()

  const months = [
    t('january', { defaultValue: 'January' }),
    t('february', { defaultValue: 'February' }),
    t('march', { defaultValue: 'March' }),
    t('april', { defaultValue: 'April' }),
    t('may', { defaultValue: 'May' }),
    t('june', { defaultValue: 'June' }),
    t('july', { defaultValue: 'July' }),
    t('august', { defaultValue: 'August' }),
    t('september', { defaultValue: 'September' }),
    t('october', { defaultValue: 'October' }),
    t('november', { defaultValue: 'November' }),
    t('december', { defaultValue: 'December' }),
  ]

  const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const weekdays = weekdayKeys.map((k, i) => t(`day${i}`, { defaultValue: t(k, { defaultValue: k.slice(0, 3) }) }))

  const today = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })

  const navigateToMonth = (delta: number) => {
    setSelectedDate((prev) => {
      const nd = new Date(prev)
      nd.setDate(1)
      nd.setMonth(nd.getMonth() + delta)
      nd.setHours(0, 0, 0, 0)
      return nd
    })
  }

  const handleToday = () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    setSelectedDate(d)
  }

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  // trailing empties to fill grid to complete weeks (4-6 rows)
  const totalCells = firstDayOfMonth + daysInMonth
  const trailing = (7 - (totalCells % 7)) % 7

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-8">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton fallback="/dashboard" />
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t('calendar')}
          </h1>
          <p className="text-secondary text-sm mt-1">{t('todayAppointments')} · {t('calendar')}</p>
        </div>

        {/* Calendar Card */}
        <Card className="p-4 sm:p-6">
          {/* Header: month navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateToMonth(-1)} className="min-h-[36px] px-3">
                Previous
              </Button>
              <div className="min-w-[160px] sm:min-w-[200px] text-center">
                <span className="text-primary font-semibold text-base sm:text-lg tracking-tight">
                  {months[month]} {year}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateToMonth(1)} className="min-h-[36px] px-3">
                Next
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleToday} className="min-h-[36px] self-start sm:self-auto">
              {t('today', { defaultValue: 'Today' })}
            </Button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-2 border-b border-white/[0.06] pb-3 mb-3">
            {weekdays.map((label, idx) => (
              <div
                key={idx}
                className="text-center text-secondary text-[11px] font-medium uppercase tracking-widest py-1"
              >
                <span className="hidden sm:inline">{String(label).slice(0, 3)}</span>
                <span className="sm:hidden">{String(label).slice(0, 2)}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-start-${i}`} className="h-[68px] sm:h-[84px] rounded-xl bg-card/40 border border-transparent" aria-hidden />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const date = new Date(year, month, day)
              date.setHours(0, 0, 0, 0)
              const todayFlag = isSameDay(date, today)
              const selectedFlag = isSameDay(date, selectedDate)

              let cellCls = 'bg-card border border-border text-primary hover:border-white/10'
              if (todayFlag) {
                cellCls = 'bg-gold text-black border border-gold font-semibold shadow-[0_2px_10px_rgba(201,162,39,0.2)]'
              } else if (selectedFlag) {
                cellCls = 'bg-card border border-gold text-primary'
              }

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`h-[68px] sm:h-[84px] rounded-xl flex flex-col items-start justify-start p-2.5 sm:p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${cellCls}`}
                >
                  <span className="text-sm sm:text-[15px] leading-none font-medium">{day}</span>
                  {todayFlag && (
                    <span className="mt-auto text-[10px] leading-none uppercase tracking-widest opacity-80">Today</span>
                  )}
                </button>
              )
            })}

            {/* Empty cells after last day */}
            {Array.from({ length: trailing }).map((_, i) => (
              <div key={`empty-end-${i}`} className="h-[68px] sm:h-[84px] rounded-xl bg-card/40 border border-transparent" aria-hidden />
            ))}
          </div>
        </Card>

        {/* Selected date hint */}
        <p className="text-secondary text-xs mt-4 text-center">
          Selected: {selectedDate.toLocaleDateString()} {isSameDay(selectedDate, today) ? '(Today)' : ''}
        </p>
      </div>
    </main>
  )
}

export default CalendarPage
