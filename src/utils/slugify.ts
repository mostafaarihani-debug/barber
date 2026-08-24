export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'barber'
}

export function isSlugAvailable(slug: string): boolean {
  // MVP: check localStorage for existing slugs
  // Later: D1 SELECT WHERE slug = ?
  if (typeof window === 'undefined') return true
  try {
    const keys = Object.keys(localStorage)
    for (const k of keys) {
      if (k.startsWith('barber:profile:')) {
        const raw = localStorage.getItem(k)
        if (raw) {
          const p = JSON.parse(raw)
          if (p.slug === slug) return false
        }
      }
    }
  } catch {}
  return true
}
