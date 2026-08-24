import React, { useParams } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSEO } from '../../components/seo'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '../../contexts/AuthContext'

interface BarberParams {
  slug: string
}

const PublicBarberPage: React.FC = () => {
  const { slug } = useParams<BarberParams>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // In a real app, we'd fetch the barber data from an API
  // For now, using mock data
  const barber = {
    id: '1',
    slug: slug || 'hamza-barber',
    displayName: 'Hamza Barber',
    rating: 4.9,
    phone: '+212 6xx xxxx xx',
    instagram: '@hamza.barber',
    whatsapp: '+212 6xx xxxx xx',
    location: 'Marrakech, Morocco',
    bio: 'Professional barber with 10 years of experience',
    services: [
      { id: '1', name: 'Haircut', price: '50 DH', duration: 30, active: true },
      { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20, active: true },
      { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45, active: true },
    ],
  }

  // SEO metadata
  useSEO({
    title: `${barber.displayName} — Book Your Appointment`,
    description: `Book an appointment with ${barber.displayName}, a professional barber in ${barber.location}. Available services and time slots.`,
    image: '/og-image.jpg',
    type: 'profile',
  })

  const handleBookNow = () => {
    // Navigate to service selection step
    navigate('/booking')
  }

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-2xl font-bold">{barber.displayName.substring(0, 2)}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">{barber.displayName}</h2>
              <p className="text-secondary">{barber.rating} ⭐</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-secondary text-sm">📍 {barber.location}</span>
            <a
              href={`https://wa.me/${barber.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener"
              className="bg-gold text-black px-3 py-1 rounded-md text-sm hover:bg-gold/90 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Services */}
            <Card>
              <h3 className="text-sm font-medium text-secondary uppercase tracking-wider mb-4">{t('services')}</h3>
              <div className="space-y-3">
                {barber.services.map((service) => {
                  if (!service.active) return null
                  return (
                    <div
                      key={service.id}
                      className="px-3 py-2 rounded-md border border-border hover:border-gold/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-black">{service.name}</span>
                        <span className="text-gold">{service.price}</span>
                      </div>
                      <p className="text-xs text-secondary">{service.duration} min</p>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Opening Hours */}
            <Card>
              <h3 className="text-sm font-medium text-secondary uppercase tracking-wider mb-4">{t('openingHours')}</h3>
              <p className="text-black">{t('mondaySaturday', { days: 'Monday - Saturday' })}</p>
              <p className="text-secondary">09:00 - 20:00</p>
            </Card>

            {/* Location & Contact */}
            <Card>
              <h3 className="text-sm font-medium text-secondary uppercase tracking-wider mb-4">{t('location')}</h3>
              <p className="text-black">{barber.location}</p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`https://www.instagram.com/${barber.instagram?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-secondary hover:text-gold transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={`https://wa.me/${barber.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-secondary hover:text-gold transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </Card>
          </div>

          {/* Book CTA */}
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-black mb-3">{t('bookAppointment')}</h2>
            <p className="text-secondary mb-6">
              {t('enterDetails', { name: barber.displayName })}
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/booking')}
            >
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PublicBarberPage