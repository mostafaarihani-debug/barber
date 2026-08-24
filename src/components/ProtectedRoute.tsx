import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    // Show premium skeleton while checking auth - keep black/gold theme
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="h-8 bg-card border border-border rounded-xl animate-pulse" />
          <div className="h-32 bg-card border border-border rounded-xl animate-pulse" />
          <div className="h-12 bg-gold/20 rounded-xl animate-pulse" />
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
