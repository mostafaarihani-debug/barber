export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return s // allow empty during editing, fallback handled on submit
}

export function isSlugAvailable(slug: string, currentUserId?: string | null): boolean {
  if (!slug) return true
  if (typeof window === 'undefined') return true
  try {
    const keys = Object.keys(localStorage)
    for (const k of keys) {
      if (k.startsWith('barber:profile:')) {
        const raw = localStorage.getItem(k)
        if (raw) {
          const p = JSON.parse(raw)
          // allow own slug
          if (p.slug === slug && p.userId !== currentUserId && p.id !== currentUserId) return false
          if (p.slug === slug && !currentUserId) return false
        }
      }
    }
    // also check lastSlug edge
    const lastSlug = localStorage.getItem('barber:lastSlug')
    if (lastSlug === slug) {
      // if it's the same as current user's last, allow
      try {
        const cur = localStorage.getItem(`barber:profile:${currentUserId || '1'}`)
        if (cur && JSON.parse(cur).slug === slug) return true
      } catch {}
    }
  } catch {}
  return true
}
