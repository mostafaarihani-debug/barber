# Premium Barber Booking — Mobile-First

Luxury black/gold barber booking platform. Each barber gets a private shareable page (`/barber/:slug`) and customers book without an account: Service → Date → Time → Customer → Confirm → Confirmed.

**Live:** https://barber-booking-app.pages.dev • **Latest deploy:** https://cb83254a.barber-booking-app.pages.dev
**GitHub:** https://github.com/mostafaarihani-debug/barber

## Tech Stack
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` in `src/index.css`, `@tailwindcss/postcss`)
- React Router 7 + React i18next (en/fr/ar-MA, RTL, `localStorage` persist, browser detect)
- Cloudflare Pages (SPA), Workers/D1/R2 ready via `wrangler.toml`

## Design System
- **Colors:** Black `#0B0B0B` dominates, Gold `#C9A227` / `#E0B83F` accent only, Card `#141414`, Border `#242424`, Text `#F5F5F0` / `#A8A8A3`
- **Typography:** Inter 400/500/600/700/800, -0.02em tracking, antialiased
- **Mobile-first:** 375/390/414 primary, thumb 44px min, bottom nav on mobile / sidebar on desktop, subtle fade/scale
- **Build:** lazy `React.lazy` + `Suspense` code-split (76 modules → 288kB main + 2-8kB per route), gzip ~91k main

## Project Structure
```
src/
  components/ui/  Button, Card, Input, Navbar, Footer, Navigations, QRCode + index.tsx barrel
  components/     ProtectedRoute, seo (useSEO)
  contexts/       AuthContext (login/register/logout, persist)
  hooks/          use-i18n (RTL dir, localStorage, fallback)
  i18n/           en.json, fr.json, ar-MA.json (Arabic script)
  types/          User, BarberProfile, Service, Availability, Break, Booking, BlockedTime
  pages/
    PublicBarberPage/  /barber/:slug + /:slug premium mini-site
    Booking/           ServiceSelection, DateSelection, TimeSelection (engine), CustomerInformation, Confirmation
    LoginPage/, RegisterPage/
    DashboardPage/     overview Today/Upcoming/Total + Copy/View/QR
    Dashboard/         ServicesManagement, AvailabilityManagement, CalendarPage
  main.tsx        BrowserRouter + AuthProvider + ErrorBoundary + lazy + ProtectedRoute + 404
public/
  _redirects      /* /index.html 200 (SPA fallback)
  favicon.svg, icons.svg
```

## Data Model (D1-ready)
```ts
User { id, name, email, phone, role, language }
BarberProfile { id, userId, slug, displayName, bio, avatar, phone, whatsapp, instagram, location }
Service { id, barberId, name, description, price, duration, active }
Availability { id, barberId, dayOfWeek, startTime, endTime }
Break { id, barberId, dayOfWeek, startTime, endTime }
Booking { id, barberId, serviceId, customerName, customerPhone, customerEmail, customerNote, date, startTime, endTime, price, status }
BlockedTime { id, barberId, date, startTime, endTime, reason }
```

Time-slot engine (`TimeSelectionPage.tsx`): `09:00-20:00` step `duration`, skip `bookings 10:00-10:30`, `breaks 13:00-14:00`, `blockedDates`, `!overlaps` check → no double booking.

## Local Development
```bash
npm install
npm run dev          # http://localhost:5173 (serves on ::1, use localhost)
npm run build        # vite build → dist (72→76 modules, _redirects copied)
npx tsc --noEmit     # type check (0 errors)
npm run preview      # preview dist on 4173
```

## Cloudflare Pages Deployment
1. `npm run build` → `dist/index.html + assets/ + _redirects`
2. `npx wrangler pages project create barber-booking-app --production-branch main` (once)
3. `npx wrangler pages deploy ./dist --project-name barber-booking-app` → `https://<hash>.barber-booking-app.pages.dev` + alias `https://barber-booking-app.pages.dev`
4. Env: no secrets hardcoded; use `wrangler.toml` `vars` / Pages env vars. Keep `pages_build_output_dir: dist` if using wrangler.toml for Pages.
5. SPA: `public/_redirects` ensures `/barber/username` refresh/direct works (no 404). Verified via `curl -I /barber/hamza-barber` → 200.
6. Custom domain: Pages → Custom domains → add `yourdomain.com` → CNAME.
7. Workers/D1/R2: `wrangler.toml` already has `barber-db` D1 (id `649bf835...`), add `r2_buckets`/`kv_namespaces` as needed without rewrite.

Verify: `curl -s https://barber-booking-app.pages.dev` → `<script src="/assets/index-...js">` + `curl -s .../assets/index-*.css | grep -q gold` → HAS gold/card/242424.

## Routes
```
/, /barber/:slug, /:slug → PublicBarberPage (SEO useSEO: title, description, og:*)
/booking → Service
/booking/confirm/:serviceId → Date
/booking/times/:serviceId → Time (engine)
/booking/customer/:serviceId/:time? → Customer
/booking/confirmation/:serviceId/:time → Confirmed
/login, /register → Auth
/dashboard, /dashboard/services, /dashboard/availability, /dashboard/calendar, /dashboard/bookings, /dashboard/profile → Protected
* → 404
```

## Security & Quality
- `ProtectedRoute` guards dashboard (skeleton while `isLoading`, redirect to `/login`).
- Validate `name ≥2, phone /^\+?[0-9]{8,15}$/, email regex` in `CustomerInformation` + auth; `useAuth` throws outside provider → ErrorBoundary catches.
- No secrets in frontend; rate-limit note for public booking POST to be added server-side.
- `ErrorBoundary` in `main.tsx` shows stack + URL instead of white screen.
- RTL: `document.documentElement.dir = lng==='ar-MA'?'rtl':'ltr'` + `lang`, layout adapts.

## Branding
Wordmark `HB` gold on black, `Premium Barber Booking` title, `theme-color #0B0B0B`, minimal luxury, no gradients/illustrations.

## MVP Scope (done)
Auth (register/login/logout), Profile/Services/Availability/Public page/Link, Customer flow 6 steps, Dashboard Bookings/Calendar/Services/Profile/Settings stubs, Language switcher (pill, always visible, gold active), QR (SVG 21×21 + canvas PNG download), responsive, SEO, Cloudflare-ready.

## Performance
Lazy `Booking/Dashboard` routes, `modulepreload` for `ui-DzWFTg8S`, `rolldown-runtime`, Inter preconnect, no huge deps, 37k CSS gzip 7.2k.
