import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = ({ className, hover, children, ...props }: CardProps) => {
  const base = 'bg-card border border-border rounded-xl'
  const hoverCls = hover ? 'hover:border-gold/20 hover:bg-white/[0.01] transition-colors cursor-pointer' : ''
  const classes = `${base} ${hoverCls} ${className || ''}`
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
Card.displayName = 'Card'
export { Card }
