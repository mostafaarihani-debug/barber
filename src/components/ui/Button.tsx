import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
  const variantStyles = {
    primary: 'bg-gold text-black hover:bg-gold-light active:scale-[0.98] shadow-[0_2px_10px_rgba(201,162,39,0.15)]',
    secondary: 'bg-card text-primary border border-border hover:border-gold/20 hover:text-gold',
    ghost: 'text-secondary hover:text-primary hover:bg-white/[0.06]',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'border border-gold text-gold hover:bg-gold hover:text-black',
  }

  const sizeStyles = {
    sm: 'h-9 px-3 text-sm min-h-[36px]',
    md: 'h-11 px-5 text-[15px] min-h-[44px]',
    lg: 'h-12 px-6 text-base min-h-[48px]',
  }

  const base = 'inline-flex items-center justify-center rounded-xl font-semibold tracking-[-0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-0 disabled:opacity-40 disabled:pointer-events-none select-none'

  const classes = `${base} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className || ''}`

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
      {loading ? <span className="animate-pulse">...</span> : children}
    </button>
  )
})

Button.displayName = 'Button'
export { Button }
