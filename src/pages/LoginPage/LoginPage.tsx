import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/components/ui'

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    // In a real app, we'd authenticate here
    if (!email || !password) {
      setError(t('pleaseFillFields'))
      return
    }
    // Successful login - navigate to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-black mb-4">{t('login')}</h2>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form className="grid gap-4">
          <Input
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
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
          onClick={handleLogin}
          mt-4>
          {t('login')}
        </Button>
      </div>
    </main>
  )
}

export default LoginPage