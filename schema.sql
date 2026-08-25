CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'barber',
  language TEXT DEFAULT 'en',
  createdAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS barber_profiles (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  displayName TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  location TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  barberId TEXT NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price TEXT NOT NULL,
  duration INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  barberId TEXT NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
  serviceId TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customerName TEXT NOT NULL,
  customerPhone TEXT NOT NULL,
  customerEmail TEXT,
  customerNote TEXT,
  date TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  price TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  createdAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_barber_profiles_slug ON barber_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_barber_profiles_userId ON barber_profiles(userId);
CREATE INDEX IF NOT EXISTS idx_services_barberId ON services(barberId);
CREATE INDEX IF NOT EXISTS idx_bookings_barberId_date ON bookings(barberId, date);
