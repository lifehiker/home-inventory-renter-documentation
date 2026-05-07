# Human Input Needed — DepositSafe

The app is fully functional without these credentials. All external services have safe fallbacks.

## Required for Production Deployment

### Stripe (Payments)
Without these, the upgrade page shows "Payment not configured" instead of crashing.
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...       # $39 one-time product price ID
STRIPE_ANNUAL_PRICE_ID=price_...    # $24/year subscription price ID
```
Setup: Create a Stripe account → Products → Create two products ($39 one-time, $24/year subscription) → copy Price IDs.

### Resend (Email)
Without this, emails are logged to console instead of sent.
```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```
Setup: Create a Resend account → verify your domain → generate API key.

### Cloudflare R2 (Photo Storage)
Without these, photos are stored in /tmp/depositsafe-uploads/ (lost on container restart).
```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=deposit-safe-photos
R2_PUBLIC_URL=https://pub-xxx.r2.dev    # optional, for public bucket
```
Setup: Cloudflare dashboard → R2 → Create bucket → API Tokens → Create R2 token.

## Already Configured (No Action Needed)

- `DATABASE_URL` — defaults to `file:/data/app.db` in Dockerfile. SQLite file created automatically.
- `AUTH_SECRET` — default baked into Dockerfile. Override for production security.
- `NEXT_PUBLIC_APP_URL` — set this to your production URL for share links to work correctly.

## Production Security Note

Override `AUTH_SECRET` with a strong random value:
```bash
openssl rand -base64 32
```
Set this in Coolify environment variables as `AUTH_SECRET`.
