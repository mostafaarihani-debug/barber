import React from 'react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline'

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
  const variantStyles = {
    primary: 'bg-gold text-black hover:bg-gold/90',
    secondary: 'bg-black text-gold hover:bg-gray-600',
    ghost: 'text-gold hover:bg-black/10',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'border-2 border-gold text-black hover:bg-gold/10',
  }

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }

  const classes = `rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold/20 focus:ring-offset-2 ${
    variantStyles[variant] || variantStyles.primary
  } ${sizeStyles[size] || sizeStyles.md} ${className}`

  return asChild ? (
    <button {...props} ref={ref} className={classes} />
  ) : (
    <button className={classes} ref={ref} {...props} />
  )
})

Button.displayName = 'Button'

export { Button }