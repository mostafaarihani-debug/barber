import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card, BackButton } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = t('pleaseFillFields', { defaultValue: 'Name is required' })
    if (!email.trim()) next.email = t('pleaseFillFields', { defaultValue: 'Email is required' })
    else if (!emailRegex.test(email.trim())) next.email = 'Invalid email address'
    if (!phone.trim()) next.phone = t('pleaseFillFields', { defaultValue: 'Phone is required' })
    if (!password) next.password = t('pleaseFillFields', { defaultValue: 'Password is required' })
    else if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password, phone.trim())
      navigate('/setup')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error', { defaultValue: 'Registration failed' }) as string
      setFormError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="w-full max-w-md mb-2">
        <BackButton fallback="/login" label="Back" />
      </div>
      <Card className="max-w-md w-full bg-card border border-border rounded-xl p-8">
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-primary text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('register', { defaultValue: 'Register' })}
        </h1>
        <p className="text-secondary text-sm text-center mt-2">Create your barber account</p>

        {formError && <p className="text-red-400 text-sm text-center mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{formError}</p>}

        <form onSubmit={handleRegister} className="grid gap-4 mt-6" noValidate>
          <Input
            placeholder={t('fullName', { defaultValue: 'Full Name' })}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            error={errors.name}
            className="min-h-[44px]"
          />
          <Input
            placeholder={t('email', { defaultValue: 'Email' })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            error={errors.email}
            className="min-h-[44px]"
          />
          <Input
            placeholder={t('phoneNumber', { defaultValue: 'Phone Number' })}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            autoComplete="tel"
            required
            error={errors.phone}
            className="min-h-[44px]"
          />
          <Input
            placeholder={t('password', { defaultValue: 'Password' })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            required
            error={errors.password}
            className="min-h-[44px]"
          />

          <Button
            variant="primary"
            className="w-full mt-2 min-h-[44px]"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? t('loading', { defaultValue: 'Loading...' }) : t('register', { defaultValue: 'Register' })}
          </Button>
        </form>

        <p className="text-secondary text-sm text-center mt-6">
          {t('alreadyHaveAccount', { defaultValue: 'Already have an account?' })} {' '}
          <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
            {t('login', { defaultValue: 'Login' })}
          </Link>
        </p>
      </Card>
    </main>
  )
}

export default RegisterPage
