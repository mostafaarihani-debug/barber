import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { SidebarDesktop, BottomNavMobile } from '@/components/ui/Navigations'
import { Card, Button } from '@/components/ui'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const todayBookings = 8
  const upcomingBookings = 17
  const totalBookings = 126

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black">{t('dashboard')}</h1>
          <p className="text-secondary mt-1">
            Good {t('morning')}, {user?.name}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Appointments Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('todayAppointments')}</p>
                <p className="text-3xl font-bold text-black">{todayBookings}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.alert('View full calendar')}
              >
                {t('viewCalendar')}
              </Button>
            </div>
          </Card>

          {/* Upcoming Bookings Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('upcoming')}</p>
                <p className="text-3xl font-bold text-black">{upcomingBookings}</p>
              </div>
            </div>
          </Card>

          {/* Total Bookings Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm uppercase tracking-wider mb-1">{t('totalBookings')}</p>
                <p className="text-3xl font-bold text-black">{totalBookings}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.alert('View booking history')}
              >
                History
              </Button>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6">
            <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.alert('Manage services')}
              >
                {t('servicesManagement')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.alert('View profile')}
              >
                {t('profileManagement')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.alert('Copy link')}
              >
                {t('bookingLink')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.alert('Generate QR')}
              >
                {t('generateQR')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage