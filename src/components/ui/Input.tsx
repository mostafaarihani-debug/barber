import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  const base = 'w-full h-11 rounded-xl border bg-black/40 px-4 text-[15px] text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-colors min-h-[44px]'
  const state = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border'
  return (
    <div className="w-full">
      <input ref={ref} className={`${base} ${state} ${className || ''}`} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export { Input }
