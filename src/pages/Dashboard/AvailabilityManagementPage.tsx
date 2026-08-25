import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Input, Button, BackButton } from '@/components/ui'
import type { Availability, Break, BlockedTime } from '@/types'

const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// helper: Monday=1 ... Sunday=0 order for display Monday first
const displayOrder = [1, 2, 3, 4, 5, 6, 0]

const AvailabilityManagementPage: React.FC = () => {
  const { t } = useTranslation()

  const [availability, setAvailability] = useState<Availability[]>([
    { id: 'a1', barberId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '20:00' },
    { id: 'a2', barberId: '1', dayOfWeek: 2, startTime: '09:00', endTime: '20:00' },
    { id: 'a3', barberId: '1', dayOfWeek: 3, startTime: '09:00', endTime: '20:00' },
    { id: 'a4', barberId: '1', dayOfWeek: 4, startTime: '09:00', endTime: '20:00' },
    { id: 'a5', barberId: '1', dayOfWeek: 5, startTime: '09:00', endTime: '20:00' },
    { id: 'a6', barberId: '1', dayOfWeek: 6, startTime: '09:00', endTime: '20:00' },
  ])

  const [breaks, setBreaks] = useState<Break[]>([])
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([])
  const [newBlocked, setNewBlocked] = useState({ date: '', reason: '' })
  const [saved, setSaved] = useState(false)

  const getLabel = (day: number) => t(dayKeys[day], { defaultValue: dayKeys[day] })

  const isActive = (day: number) => availability.some((a) => a.dayOfWeek === day)

  const getDayAvail = (day: number) => availability.find((a) => a.dayOfWeek === day)

  const toggleDay = (day: number) => {
    if (isActive(day)) {
      setAvailability((prev) => prev.filter((a) => a.dayOfWeek !== day))
      // also remove breaks for that day
      setBreaks((prev) => prev.filter((b) => b.dayOfWeek !== day))
    } else {
      setAvailability((prev) => [...prev, { id: `a-${day}-${Date.now()}`, barberId: '1', dayOfWeek: day, startTime: '09:00', endTime: '20:00' }])
    }
  }

  const updateTime = (day: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability((prev) => prev.map((a) => (a.dayOfWeek === day ? { ...a, [field]: value } : a)))
  }

  const handleAddBreak = (day: number) => {
    setBreaks((prev) => [...prev, { id: `b-${day}-${Date.now()}`, barberId: '1', dayOfWeek: day, startTime: '12:00', endTime: '13:00' }])
  }

  const updateBreak = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setBreaks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const removeBreak = (id: string) => setBreaks((prev) => prev.filter((b) => b.id !== id))

  const handleAddBlocked = () => {
    if (!newBlocked.date) return
    setBlockedTimes((prev) => [
      ...prev,
      { id: `bl-${Date.now()}`, barberId: '1', date: newBlocked.date, startTime: '09:00', endTime: '20:00', reason: newBlocked.reason || t('blockedTime', { defaultValue: 'Blocked' }) as string },
    ])
    setNewBlocked({ date: '', reason: '' })
  }

  const removeBlocked = (id: string) => setBlockedTimes((prev) => prev.filter((b) => b.id !== id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black pb-28 lg:pb-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton fallback="/dashboard" />
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t('availabilityManagement', { defaultValue: t('workingHours', { defaultValue: 'Availability' }) })}
          </h1>
          <p className="text-secondary text-sm mt-1">Set working hours, breaks and blocked dates</p>
        </div>

        {/* Working Hours */}
        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-secondary text-[11px] font-medium uppercase tracking-widest">{t('workingHours', { defaultValue: 'Working Hours' })}</h2>

          <div className="grid gap-3 mt-5">
            {displayOrder.map((day) => {
              const active = isActive(day)
              const avail = getDayAvail(day)
              const dayBreaks = breaks.filter((b) => b.dayOfWeek === day)
              return (
                <div key={day} className="rounded-xl border border-border bg-black/30 p-4 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-sm font-medium tracking-tight min-w-[96px] ${active ? 'text-primary' : 'text-secondary'}`}>{getLabel(day)}</span>

                    <div className="flex items-center gap-3">
                      {active && (
                        <div className="hidden sm:flex items-center gap-2">
                          <Input
                            type="time"
                            value={avail?.startTime ?? '09:00'}
                            onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                            className="min-h-[44px] w-[120px] text-sm"
                          />
                          <span className="text-secondary text-sm">→</span>
                          <Input
                            type="time"
                            value={avail?.endTime ?? '20:00'}
                            onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                            className="min-h-[44px] w-[120px] text-sm"
                          />
                        </div>
                      )}

                      {/* Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={active}
                        onClick={() => toggleDay(day)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${active ? 'bg-gold' : 'bg-white/10 border border-border'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* mobile time inputs */}
                  {active && (
                    <div className="flex sm:hidden items-center gap-2 mt-3">
                      <Input
                        type="time"
                        value={avail?.startTime ?? '09:00'}
                        onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                        className="min-h-[44px] flex-1 text-sm"
                      />
                      <span className="text-secondary text-sm">→</span>
                      <Input
                        type="time"
                        value={avail?.endTime ?? '20:00'}
                        onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                        className="min-h-[44px] flex-1 text-sm"
                      />
                    </div>
                  )}

                  {/* Breaks per day */}
                  {active && (
                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-secondary text-xs uppercase tracking-widest font-medium">{t('breaks', { defaultValue: 'Breaks' })}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleAddBreak(day)} className="min-h-[36px] text-xs">
                          {t('addBreak', { defaultValue: 'Add Break' })}
                        </Button>
                      </div>
                      {dayBreaks.length === 0 ? (
                        <p className="text-secondary text-xs">No breaks</p>
                      ) : (
                        <div className="grid gap-2">
                          {dayBreaks.map((b) => (
                            <div key={b.id} className="flex items-center gap-2">
                              <Input type="time" value={b.startTime} onChange={(e) => updateBreak(b.id, 'startTime', e.target.value)} className="min-h-[44px] flex-1 text-sm" />
                              <span className="text-secondary text-sm">→</span>
                              <Input type="time" value={b.endTime} onChange={(e) => updateBreak(b.id, 'endTime', e.target.value)} className="min-h-[44px] flex-1 text-sm" />
                              <Button variant="ghost" size="sm" onClick={() => removeBreak(b.id)} className="min-h-[44px] text-red-400 hover:text-red-300 shrink-0">
                                {t('delete', { defaultValue: 'Delete' })}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!active && <p className="text-secondary text-xs mt-2">{t('dayOff', { defaultValue: 'Day Off' })}</p>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Blocked Dates */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-secondary text-[11px] font-medium uppercase tracking-widest">{t('blockedDates', { defaultValue: 'Blocked Dates' })}</h2>
          <p className="text-secondary text-xs mt-2">Add dates when you are unavailable</p>

          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mt-5 items-end">
            <Input
              type="date"
              value={newBlocked.date}
              onChange={(e) => setNewBlocked({ ...newBlocked, date: e.target.value })}
              className="min-h-[44px]"
            />
            <Input
              placeholder={t('blockedTime', { defaultValue: 'Reason' })}
              value={newBlocked.reason}
              onChange={(e) => setNewBlocked({ ...newBlocked, reason: e.target.value })}
              className="min-h-[44px]"
            />
            <Button variant="outline" size="sm" onClick={handleAddBlocked} disabled={!newBlocked.date} className="min-h-[44px] w-full sm:w-auto">
              {t('addBlockedDate', { defaultValue: t('addBreak', { defaultValue: 'Add' }) })}
            </Button>
          </div>

          {blockedTimes.length > 0 ? (
            <div className="grid gap-2 mt-5">
              {blockedTimes.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-black/30 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-primary text-sm font-medium">{b.date}</p>
                    <p className="text-secondary text-xs truncate">{b.reason}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeBlocked(b.id)} className="min-h-[44px] text-red-400 hover:text-red-300 shrink-0 ml-3">
                    {t('delete', { defaultValue: 'Delete' })}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary text-sm text-center py-6">No blocked dates</p>
          )}
        </Card>
      </div>

      {/* Sticky Save */}
      <div className="fixed bottom-0 lg:sticky lg:bottom-6 left-0 right-0 z-40">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-4 lg:pb-0">
          <div className="bg-card border border-border rounded-xl lg:rounded-xl p-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <span className="text-secondary text-sm hidden sm:inline">{saved ? t('success', { defaultValue: 'Saved' }) : 'Changes not saved yet'}</span>
            <Button variant="primary" onClick={handleSave} className="w-full sm:w-auto min-h-[44px] min-w-[160px] ml-auto">
              {saved ? t('success', { defaultValue: 'Saved ✓' }) : t('save', { defaultValue: 'Save' })}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AvailabilityManagementPage
