import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = ({ className, children }: CardProps) => {
  const classes = `bg-card border border-border rounded-md p-6 ${className}`

  return <div className={classes}>{children}</div>
}

Card.displayName = 'Card'

export { Card }