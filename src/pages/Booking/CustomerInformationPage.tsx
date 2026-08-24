import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Input, Button } from '@/components/ui'

const CustomerInformationPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string; time: string }>()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    navigate(`/booking/confirmation/${params.serviceId}/${params.time}?name=${customerName}&phone=${customerPhone}&email=${customerEmail}&note=${note}`)
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          {t('customerInformation')}
        </h1>

        <Card className="p-6">
          <form className="grid gap-4">
            <Input
              placeholder={t('fullName')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder={t('phoneNumber')}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder={t('optionalEmail')}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <Input
              placeholder={t('optionalNote')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </form>
        </Card>

        <div className="mt-8 pt-8 border-t border-border">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
          >
            {t('confirmBooking')}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default CustomerInformationPage