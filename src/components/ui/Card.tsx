import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

const Card = ({ className, children, ...props }: CardProps) => {
  const classes = `bg-card border border-border rounded-md p-6 ${className || ''}`

  return <div className={classes} {...props}>{children}</div>
}

Card.displayName = 'Card'

export { Card }