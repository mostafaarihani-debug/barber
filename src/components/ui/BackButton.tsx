import React from 'react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  fallback?: string
  label?: string
  className?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ fallback = '/', label, className }) => {
  const navigate = useNavigate()
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(fallback)
  }
  return (
    <button
      onClick={handleBack}
      aria-label={label || 'Go back'}
      className={`inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors min-h-[44px] px-2 -ml-2 group ${className || ''}`}
    >
      <span className="w-8 h-8 rounded-full bg-card border border-border group-hover:border-gold/30 flex items-center justify-center text-primary transition-colors">
        ←
      </span>
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  )
}
