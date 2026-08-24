import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { Card, Button } from '@/components/ui'
import QRCode, { downloadQRCode } from '@/components/ui/QRCode'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const todayBookings = 8
  const upcomingBookings = 17
  const totalBookings = 126

  const displayName = user?.name?.trim() ? user.name : 'Hamza'
  const bookingSlug = displayName.toLowerCase().replace(/\s+/g, '-') + '-barber'
  const bookingUrl = `yourdomain.com/barber/${bookingSlug}`
  const bookingFullUrl = `https://${bookingUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${bookingUrl}`)
      window.alert(t('copyLink') + ' ✓')
    } catch {
      window.alert(bookingUrl)
    }
  }

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-0">
      {/* Premium standalone container - mobile-first 375/390/414 */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.02em] text-primary leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Good morning, {displayName}
          </h1>
          <p className="text-secondary text-sm mt-1.5">
            {t('dashboard')} — <span className="text-primary/80">{t('todayAppointments')}</span>
          </p>
        </header>

        {/* Stats Cards - 3 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Today */}
          <Card className="p-6 flex flex-col justify-between min-h-[132px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                  {t('todayAppointments')}
                </p>
                <p className="text-3xl font-bold text-primary tracking-tight leading-none">{todayBookings}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.alert(t('calendar'))}
                className="shrink-0 text-xs"
              >
                {t('viewCalendar')}
              </Button>
            </div>
            <p className="text-secondary text-xs mt-4">{t('today')} · 8 appointments</p>
          </Card>

          {/* Upcoming */}
          <Card className="p-6 flex flex-col justify-between min-h-[132px]">
            <div>
              <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                {t('upcoming')}
              </p>
              <p className="text-3xl font-bold text-primary tracking-tight leading-none">{upcomingBookings}</p>
            </div>
            <p className="text-secondary text-xs mt-4 opacity-80">Next 7 days</p>
          </Card>

          {/* Total */}
          <Card className="p-6 flex flex-col justify-between min-h-[132px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-secondary text-[11px] font-medium uppercase tracking-widest leading-none mb-3">
                  {t('totalBookings')}
                </p>
                <p className="text-3xl font-bold text-primary tracking-tight leading-none">{totalBookings}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.alert('History')}
                className="shrink-0 text-xs"
              >
                History
              </Button>
            </div>
            <p className="text-secondary text-xs mt-4 opacity-80">All time</p>
          </Card>
        </div>

        {/* Second row - Quick Actions + Booking Link */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">
              {t('quickActions', { defaultValue: 'Quick Actions' })}
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => window.alert(t('servicesManagement'))}
              >
                {t('servicesManagement')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => window.alert(t('profileManagement'))}
              >
                {t('profileManagement')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={handleCopy}
              >
                {t('copyLink')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => window.alert(t('qrCode'))}
              >
                {t('qrCode')}
              </Button>
            </div>
          </Card>

          {/* Booking Link */}
          <Card className="p-6 flex flex-col">
            <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">
              {t('bookingLink')}
            </h3>
            <div className="mt-5 flex items-center gap-3 bg-black border border-border rounded-xl px-4 py-3.5">
              <span className="text-primary text-sm font-medium truncate flex-1 tracking-tight">
                {bookingUrl}
              </span>
              <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-gold shrink-0" aria-hidden />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Button
                variant="primary"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={handleCopy}
              >
                {t('copyLink')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => window.open(`https://${bookingUrl}`, '_blank')}
              >
                {t('viewPage', { defaultValue: t('viewPage') }) || 'View Page'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => window.alert(t('qrCode'))}
              >
                {t('qrCode')}
              </Button>
            </div>
            <p className="text-secondary text-xs mt-3">Share this link with clients to let them book instantly.</p>
          </Card>
        </div>

        {/* QR Section - premium */}
        <Card className="p-6 mt-4 flex flex-col items-center text-center">
          <h3 className="text-secondary text-[11px] font-medium uppercase tracking-widest">Your Booking QR</h3>
          <div className="mt-5 bg-black border border-border rounded-xl p-4">
            <QRCode value={bookingFullUrl} size={180} bgColor="#0B0B0B" fgColor="#C9A227" />
          </div>
          <p className="text-secondary text-xs mt-3">Scan to book</p>
          <p className="text-primary text-sm font-medium mt-1 truncate max-w-full">{bookingFullUrl}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto min-h-[44px] mt-4 min-w-[180px]"
            onClick={() => downloadQRCode(bookingFullUrl, 400, '#0B0B0B', '#C9A227', `${bookingSlug}-qr.png`)}
          >
            {t('downloadQR', { defaultValue: 'Download QR' })}
          </Button>
        </Card>
      </div>
    </main>
  )
}

export default DashboardPage
