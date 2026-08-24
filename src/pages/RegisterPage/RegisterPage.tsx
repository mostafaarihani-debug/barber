import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/components/ui'

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')
    if (!name || !email || !phone || !password) {
      setError(t('pleaseFillFields'))
      return
    }
    // Successful registration - navigate to login
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-black mb-4">{t('register')}</h2>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form className="grid gap-4">
          <Input
            placeholder={t('fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <Input
            placeholder={t('phoneNumber')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
          />
          <Input
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </form>

        <Button
          variant="primary"
          fullWidth
          onClick={handleRegister}
          mt-4>
          {t('register')}
        </Button>
      </div>
    </main>
  )
}

export default RegisterPage