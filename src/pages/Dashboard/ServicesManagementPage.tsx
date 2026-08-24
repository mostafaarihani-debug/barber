import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Input, Button } from '@/components/ui'

const ServicesManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const [services, setServices] = useState([
    { id: '1', name: 'Haircut', price: '50 DH', duration: 30, active: true },
    { id: '2', name: 'Beard Trim', price: '30 DH', duration: 20, active: true },
    { id: '3', name: 'Haircut + Beard', price: '80 DH', duration: 45, active: true },
  ])
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
  })
  const [error, setError] = useState('')

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      setError(t('pleaseFillFields'))
      return
    }
    const newServiceItem = {
      id: String(Date.now()),
      name: newService.name,
      price: newService.price,
      duration: parseInt(newService.duration),
      active: true,
    }
    setServices([...services, newServiceItem])
    setNewService({ name: '', price: '', duration: '' })
    setError('')
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  return (
    <main className="min-h-screen bg-black p-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">{t('servicesManagement')}</h1>

        {/* Add Service Form */}
        <Card className="mb-6 p-6">
          <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">{t('addService')}</h3>
          <form className="grid gap-3">
            <Input
              placeholder={t('serviceName')}
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
            <Input
              placeholder={t('servicePrice')}
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              type="text"
              required
            />
            <Input
              placeholder={t('serviceDuration')}
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              type="number"
              required
            />
            <Button
              variant="primary"
              onClick={handleAddService}
              style={{ width: '100%' }}
            >
              {t('addService')}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Card>

        {/* Services List */}
        <Card>
          <h3 className="text-secondary text-sm uppercase tracking-wider mb-4">{t('currentServices')}</h3>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center rounded-md p-3 border border-border"
              >
                <span className="text-black">
                  {service.name} - {service.price}
                </span>
                <span className="text-secondary text-sm">
                  {t(`duration${service.duration}`, { duration: service.duration })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteService(service.id)}
                >
                  {t('delete')}
                </Button>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-secondary text-center py-8">
                {t('noServices')}
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}

export default ServicesManagementPage