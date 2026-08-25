import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Input, Button, BackButton } from '@/components/ui'
import type { Service } from '@/types'

const initialServices: Service[] = [
  { id: '1', barberId: '1', name: 'Haircut', description: '', price: '50 DH', duration: 30, active: true },
  { id: '2', barberId: '1', name: 'Beard Trim', description: '', price: '30 DH', duration: 20, active: true },
  { id: '3', barberId: '1', name: 'Haircut + Beard', description: '', price: '80 DH', duration: 45, active: true },
]

type ModalMode = 'add' | 'edit'

const ServicesManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const [services, setServices] = useState<Service[]>(initialServices)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({ name: '', price: '', duration: '' })
  const [errors, setErrors] = useState<{ name?: string; price?: string; duration?: string }>({})
  const [formError, setFormError] = useState('')

  const openAdd = () => {
    setModalMode('add')
    setEditingId(null)
    setForm({ name: '', price: '', duration: '' })
    setErrors({})
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (s: Service) => {
    setModalMode('edit')
    setEditingId(s.id)
    setForm({ name: s.name, price: s.price, duration: String(s.duration) })
    setErrors({})
    setFormError('')
    setModalOpen(true)
  }

  const validate = () => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = t('pleaseFillFields', { defaultValue: 'Name required' }) as string
    if (!form.price.trim()) next.price = t('pleaseFillFields', { defaultValue: 'Price required' }) as string
    if (!form.duration.trim()) next.duration = t('pleaseFillFields', { defaultValue: 'Duration required' }) as string
    else if (Number.isNaN(Number(form.duration)) || Number(form.duration) <= 0) next.duration = 'Duration must be a positive number'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    setFormError('')
    if (!validate()) return
    const durationNum = parseInt(form.duration, 10)
    if (modalMode === 'add') {
      const newItem: Service = {
        id: String(Date.now()),
        barberId: '1',
        name: form.name.trim(),
        description: '',
        price: form.price.trim(),
        duration: durationNum,
        active: true,
      }
      setServices((prev) => [...prev, newItem])
    } else if (editingId) {
      setServices((prev) => prev.map((s) => (s.id === editingId ? { ...s, name: form.name.trim(), price: form.price.trim(), duration: durationNum } : s)))
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const handleToggle = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  return (
    <main className="min-h-screen bg-black pb-24 lg:pb-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton fallback="/dashboard" />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {t('servicesManagement', { defaultValue: 'Services' })}
            </h1>
            <p className="text-secondary text-sm mt-1">Manage your services, pricing and duration</p>
          </div>
          <Button variant="primary" onClick={openAdd} className="min-h-[44px] w-full sm:w-auto shrink-0">
            {t('addService', { defaultValue: 'Add Service' })}
          </Button>
        </div>

        {/* Services list */}
        {services.length === 0 ? (
          <Card className="p-8 sm:p-10 text-center">
            <p className="text-primary font-semibold">Add your first service</p>
            <p className="text-secondary text-sm mt-2 max-w-md mx-auto whitespace-pre-line">{t('noServices', { defaultValue: 'Add your first service\n\nCreate a service so customers can start booking.' })}</p>
            <Button variant="primary" onClick={openAdd} className="mt-6 min-h-[44px]">
              {t('addService', { defaultValue: 'Add Service' })}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <Card key={service.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-primary font-semibold text-[15px] tracking-tight truncate">{service.name}</h3>
                    <span className="text-gold font-semibold text-sm">{service.price}</span>
                    <span className="text-secondary text-sm">· {service.duration} min</span>
                    {!service.active && <span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-secondary border border-border">Inactive</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Active switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={service.active}
                    onClick={() => handleToggle(service.id)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${service.active ? 'bg-gold' : 'bg-white/10 border border-border'}`}
                    title={service.active ? 'Active' : 'Inactive'}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ${service.active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>

                  <Button variant="ghost" size="sm" onClick={() => openEdit(service)} className="min-h-[44px]">
                    {t('edit', { defaultValue: 'Edit' })}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="min-h-[44px] text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    {t('delete', { defaultValue: 'Delete' })}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close" onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <Card
            className="relative w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-primary tracking-tight">
              {modalMode === 'add' ? t('addService', { defaultValue: 'Add Service' }) : t('editService', { defaultValue: 'Edit Service' })}
            </h2>
            <p className="text-secondary text-xs mt-1">{modalMode === 'add' ? 'Create a new bookable service' : 'Update service details'}</p>

            <div className="grid gap-4 mt-6">
              <Input
                placeholder={t('serviceName', { defaultValue: 'Service Name' })}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                className="min-h-[44px]"
              />
              <Input
                placeholder={t('servicePrice', { defaultValue: 'Service Price' }) + ' e.g. 50 DH'}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={errors.price}
                className="min-h-[44px]"
              />
              <Input
                placeholder={t('serviceDuration', { defaultValue: 'Service Duration' }) + ' (min)'}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                type="number"
                min={5}
                error={errors.duration}
                className="min-h-[44px]"
              />
            </div>

            {formError && <p className="text-red-400 text-sm mt-3">{formError}</p>}

            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1 min-h-[44px]">
                {t('cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button variant="primary" onClick={handleSave} className="flex-1 min-h-[44px]">
                {t('save', { defaultValue: 'Save' })}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  )
}

export default ServicesManagementPage
