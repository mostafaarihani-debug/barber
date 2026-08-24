import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant = 'default', ...props }, ref) => {
  const baseClasses = 'w-full rounded-md border border-border bg-card px-3 py-2 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors'

  const variantClasses = variant === 'outline'
    ? 'border-transparent bg-transparent'
    : ''

  const classes = `${baseClasses} ${variantClasses} ${className}`

  return <input ref={ref} className={classes} {...props} />
})

Input.displayName = 'Input'

export { Input }