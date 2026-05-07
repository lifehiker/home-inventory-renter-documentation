# DepositSafe — Forge Completion Audit

## PRD Requirement → Implementation Mapping

### Authentication
| Requirement | Implementation |
|---|---|
| Email/password sign-in | `src/auth.ts` — NextAuth v5 Credentials provider with bcrypt |
| Account registration | `src/app/api/auth/register/route.ts` |
| Login page | `src/app/login/page.tsx` |
| Register page | `src/app/register/page.tsx` |
| Session persistence | JWT strategy, `src/auth.ts` callbacks |
| Route protection | `src/proxy.ts` — protects /dashboard, /properties |

### Data Model
| Model | File |
|---|---|
| User | `prisma/schema.prisma` — User model |
| Property | `prisma/schema.prisma` — Property model |
| Room | `prisma/schema.prisma` — Room model |
| Photo | `prisma/schema.prisma` — Photo model |
| Report | `prisma/schema.prisma` — Report model |
| NextAuth tables | Account, Session, VerificationToken in schema.prisma |

### Property Management
| Requirement | Implementation |
|---|---|
| Create property (address, type, notes) | `src/app/properties/new/page.tsx` + `src/app/api/properties/route.ts` |
| List properties dashboard | `src/app/(app)/dashboard/page.tsx` + `src/components/PropertyCard.tsx` |
| Property types (Apartment, House, Condo, Other) | Property model type field + new property form |
| Multiple properties per account | Enforced by free tier, unlimited for Pro |
| Property detail view | `src/app/properties/[id]/page.tsx` |

### Room Management
| Requirement | Implementation |
|---|---|
| Add rooms with preset names | `src/app/properties/[id]/page.tsx` — Add Room dialog |
| Custom room names | Free-text input in Add Room dialog |
| Preset list (Living Room, Kitchen, etc.) | Room presets in property detail page |
| Room ordering/reordering | Drag-to-reorder via HTML5 drag events in `src/components/PropertyDetail.tsx` |
| Room condition notes | `src/components/RoomDetail.tsx` textarea, PATCH `/api/properties/[id]/rooms/[roomId]` |

### Photo Capture
| Requirement | Implementation |
|---|---|
| Mobile camera capture | `src/components/PhotoCapture.tsx` — `<input capture="environment">` |
| Desktop drag-drop zone | `src/components/PhotoCapture.tsx` — drag-drop fallback |
| GPS coordinates | `navigator.geolocation.getCurrentPosition()` in PhotoCapture |
| Server-side timestamp | `timestampCaptured: new Date()` in upload route (client cannot supply) |
| Multiple photos per session | `multiple` attribute on file input |
| Photo notes | Per-photo note in `src/components/PhotoGrid.tsx`, PATCH `/api/photos/[id]` |
| Photo thumbnail grid | `src/components/PhotoGrid.tsx` — 2-3 col mobile, 4 col desktop |
| Expand photo on tap | `src/components/PhotoModal.tsx` — full metadata view |

### Storage
| Requirement | Implementation |
|---|---|
| Cloudflare R2 upload | `src/lib/storage.ts` — lazy S3Client with R2 endpoint |
| Sharp resize (1920px max) | `src/lib/storage.ts` + `src/app/api/photos/upload/route.ts` |
| Thumbnail generation (300px) | `src/lib/storage.ts` |
| Local fallback (no R2 creds) | `/tmp/depositsafe-uploads/` + `/api/files/[...key]` serving route |

### PDF Generation
| Requirement | Implementation |
|---|---|
| Server-side PDF | `src/app/api/reports/generate/route.ts` using `@react-pdf/renderer` |
| Cover page (address, date) | ReportDocument component in generate route |
| Room sections with photos | Per-room sections with 2-column photo grid |
| GPS + timestamp per photo | Included in each photo cell |
| Pro tamper-evident badge | Footer varies by `proUnlocked` status |
| Free watermark | "Generated with DepositSafe Free" watermark for non-Pro |
| PDF download | `src/app/api/reports/[id]/download/route.ts` |
| PDF cached in storage | pdfR2Key saved on Report record |

### Shareable Links
| Requirement | Implementation |
|---|---|
| Generate share link | `src/app/api/reports/share/route.ts` — creates Report with shareSlug |
| 30-day expiry | `expiresAt: addDays(new Date(), 30)` in share route |
| Public view (no auth) | `src/app/share/[slug]/page.tsx` |
| Expiry check | expiresAt check in share page |
| CTA on share page | "Create your own" CTA linking to /register |

### Free Tier Enforcement
| Requirement | Implementation |
|---|---|
| 1 property limit | `src/lib/tierCheck.ts` checkPropertyLimit() |
| 3 rooms limit | `src/lib/tierCheck.ts` checkRoomLimit() |
| 30 photos limit | `src/lib/tierCheck.ts` checkPhotoLimit() |
| 402 response on limit | Upload and room creation API routes |
| Upgrade modal on 402 | `src/components/UpgradeModal.tsx` triggered in PhotoCapture |
| Server-side enforcement | Checks in all relevant API routes |

### Payments
| Requirement | Implementation |
|---|---|
| Stripe checkout ($39 one-time) | `src/app/api/checkout/route.ts` — lazy Stripe init |
| Stripe webhook handler | `src/app/api/webhooks/stripe/route.ts` |
| Pro unlock on payment | `prisma.user.update({ proUnlocked: true })` in webhook |
| Upgrade page | `src/app/pro/page.tsx` — feature comparison + CTAs |
| Annual plan option | Second CTA in /pro page (STRIPE_ANNUAL_PRICE_ID) |
| No-credentials fallback | "Payment not configured" error instead of crash |

### Email
| Requirement | Implementation |
|---|---|
| Welcome email on signup | `src/lib/email.ts` sendWelcomeEmail(), called from register API |
| Report ready notification | `src/lib/email.ts` sendReportReadyEmail(), called from generate route |
| Pro confirmation | `src/lib/email.ts` sendProConfirmationEmail(), called from webhook |
| No-credentials fallback | console.log fallback when RESEND_API_KEY not set |

### PWA
| Requirement | Implementation |
|---|---|
| manifest.json | `public/manifest.json` — name, icons, display: standalone |
| Theme color | meta theme-color in layout.tsx |
| PWA icons | `public/icon-192.png`, `public/icon-512.png` |
| Manifest link | `<link rel="manifest">` in `src/app/layout.tsx` |

### SEO Landing Pages
| Page | Implementation |
|---|---|
| Homepage (home inventory app free) | `src/app/page.tsx` — full landing with features, testimonials, CTA |
| /renter (move out documentation) | `src/app/renter/page.tsx` — with metadata export |
| /move-in-checklist | `src/app/move-in-checklist/page.tsx` — with metadata export |
| /compare/sortly-alternative | `src/app/compare/sortly-alternative/page.tsx` |
| /blog/how-to-win-security-deposit-dispute | `src/app/blog/how-to-win-security-deposit-dispute/page.tsx` ~1500 words |

### Infrastructure
| Requirement | Implementation |
|---|---|
| output: standalone | `next.config.ts` |
| SQLite database | `prisma/schema.prisma` provider sqlite |
| Health endpoint | `src/app/api/health/route.ts` → { status: "ok" } |
| Dockerfile | `Dockerfile` — node:20-slim, openssl, prisma, standalone |
| Database init on startup | Dockerfile CMD: `prisma db push && node server.js` |

## Intentionally Deferred (Requires External Credentials)

| Feature | Reason | Fallback |
|---|---|---|
| Stripe payments | Requires STRIPE_SECRET_KEY, live product/price IDs | "Payment not configured" error; Pro page shows pricing but checkout disabled |
| Resend email | Requires RESEND_API_KEY and verified domain | Emails logged to console |
| Cloudflare R2 | Requires account ID, API keys | Files stored in /tmp/depositsafe-uploads/ (ephemeral in container) |
| Google OAuth | Not supported — Credentials provider only per BUILD_INSTRUCTIONS | N/A |

## Build Verification

- `npm run build` — ✅ Passes, 30 routes compiled
- Dev server health check — ✅ `{ status: "ok" }` at /api/health
- Registration API — ✅ Creates user, returns { id, email, name }
- Auth protection — ✅ /dashboard returns 307 redirect to /login when unauthenticated
- Public pages — ✅ /, /login, /register, /renter, /move-in-checklist return 200
