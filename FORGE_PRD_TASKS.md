# DepositSafe — PRD Task Checklist

## Foundation
- [x] Next.js 15/16 project initialized with TypeScript, Tailwind, App Router
- [x] SQLite via Prisma (libsql adapter for Prisma 7 compatibility)
- [x] NextAuth v5 beta with Credentials provider (JWT strategy)
- [x] All dependencies installed
- [x] shadcn/ui components added

## Data Model
- [x] User (id, email, name, password, proUnlocked, createdAt)
- [x] Account (NextAuth adapter)
- [x] Session (NextAuth adapter)
- [x] VerificationToken (NextAuth adapter)
- [x] Property (id, userId, address, type, notes, timestamps)
- [x] Room (id, propertyId, name, type, notes, order)
- [x] Photo (id, roomId, r2Key, thumbnailKey, timestampCaptured, GPS, notes, order)
- [x] Report (id, propertyId, shareSlug, generatedAt, expiresAt, pdfR2Key)

## Auth
- [x] Credentials provider with bcrypt password hashing
- [x] JWT session strategy
- [x] Register API route
- [x] Login page
- [x] Register page
- [x] Proxy (middleware) protecting /dashboard and /properties routes
- [x] Session type augmentation (id, proUnlocked)
- [x] Sign-out button

## Core API Routes
- [x] GET/POST /api/properties
- [x] GET/DELETE /api/properties/[id]
- [x] GET/POST /api/properties/[id]/rooms
- [x] GET/PATCH/DELETE /api/properties/[id]/rooms/[roomId]
- [x] POST /api/photos/upload (with sharp resize, free tier check)
- [x] PATCH/DELETE /api/photos/[id]
- [x] POST /api/reports/generate (PDF via @react-pdf/renderer)
- [x] GET /api/reports/[id]/download
- [x] POST /api/reports/share
- [x] POST /api/checkout (Stripe, lazy-initialized)
- [x] POST /api/webhooks/stripe
- [x] GET /api/health
- [x] GET /api/files/[...key] (local file fallback)

## Storage
- [x] R2 upload when credentials configured
- [x] Local /tmp fallback when R2 not configured
- [x] Lazy S3 client initialization (no module-level instantiation)

## Email
- [x] Welcome email (sendWelcomeEmail)
- [x] Report ready email (sendReportReadyEmail)
- [x] Pro confirmation email (sendProConfirmationEmail)
- [x] All lazy-initialized with Resend_API_KEY guard

## Free Tier Enforcement
- [x] checkPhotoLimit (30 photos)
- [x] checkRoomLimit (3 rooms per property)
- [x] checkPropertyLimit (1 property)
- [x] 402 response with upgradeUrl on limit hit
- [x] UpgradeModal component

## Pages — Authenticated
- [x] /dashboard — property cards grid, empty state, stats
- [x] /properties/new — create property form
- [x] /properties/[id] — property detail, room list, drag-to-reorder, Add Room dialog
- [x] /properties/[id]/rooms/[roomId] — room detail, photo capture, photo grid, notes
- [x] /properties/[id]/report — generate PDF, share link

## Pages — Public
- [x] / — homepage with hero, features, testimonials, CTA
- [x] /login — email/password login form
- [x] /register — registration form with auto-sign-in
- [x] /pro — feature comparison table, upgrade buttons
- [x] /share/[slug] — public read-only report view with expiry check

## SEO Pages
- [x] /renter — move-out documentation landing page
- [x] /move-in-checklist — checklist landing page with FAQ
- [x] /compare/sortly-alternative — comparison page
- [x] /blog/how-to-win-security-deposit-dispute — ~1500 word guide

## Components
- [x] PropertyCard — dashboard card with stats
- [x] PropertyDetail — property management with drag-to-reorder rooms
- [x] RoomCard — room card with drag handle
- [x] RoomDetail — room page with notes auto-save
- [x] PhotoCapture — camera input, drag-drop, GPS, progress bars
- [x] PhotoGrid — thumbnail grid with timestamp overlays
- [x] PhotoModal — full-screen photo with metadata, notes editing
- [x] UpgradeModal — upgrade prompt dialog
- [x] ProUpgradeClient — Stripe checkout buttons
- [x] SignOutButton — client sign-out button
- [x] NavBar — app header with nav links
- [x] Providers — SessionProvider wrapper

## PWA
- [x] public/manifest.json
- [x] public/icon-192.png (placeholder)
- [x] public/icon-512.png (placeholder)
- [x] manifest link in root layout
- [x] theme-color meta tag

## Deployment
- [x] next.config.ts — output: "standalone"
- [x] Dockerfile — node:20-slim, with OpenSSL, Prisma generate, db push on start
- [x] .env.local — local development env vars
- [x] .env.example — template for deployment
- [x] Prisma binaryTargets: ["native", "debian-openssl-3.0.x"]

## Build Verification
- [x] npm run build passes with zero TypeScript errors
- [x] All 30 routes built successfully
