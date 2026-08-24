export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: 'customer' | 'barber'
  language: 'en' | 'fr' | 'ar-MA'
}

export interface BarberProfile {
  id: string
  userId: string
  slug: string
  displayName: string
  bio: string
  avatar: string | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  barberId: string
  name: string
  description: string
  price: string
  duration: number
  active: boolean
}

export interface Availability {
  id: string
  barberId: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
}

export interface Break {
  id: string
  barberId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface Booking {
  id: string
  barberId: string
  serviceId: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  customerNote: string | null
  date: string // "YYYY-MM-DD"
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
  price: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export interface BlockedTime {
  id: string
  barberId: string
  date: string // "YYYY-MM-DD"
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
  reason: string
}

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface TimeSlot {
  start: string
  end: string
  isAvailable: boolean
  isBooked: boolean
  isBreak: boolean
}