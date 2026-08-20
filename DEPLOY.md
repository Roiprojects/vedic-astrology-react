# Deployment Guide — myvedicastrology.in

## Pull latest code

```bash
git pull origin master
npm install
npm run build
```

## Environment variables (REQUIRED)

Create a file called `.env` in the project root. Copy the values from `.env.local` on the developer's machine. The critical ones are:

```env
# Razorpay — get from Razorpay dashboard
RAZORPAY_KEY_ID=<live key id>
RAZORPAY_KEY_SECRET=<live key secret>
VITE_RAZORPAY_KEY_ID=<same as RAZORPAY_KEY_ID>

# Admin portal login
JWT_SECRET=<any long random string>
ADMIN_EMAIL=info@myvedicastrology.in
ADMIN_PASSWORD=<your admin password>

# PostgreSQL database
PG_HOST=<db host>
PG_PORT=5432
PG_DATABASE=<db name>
PG_USER=<db user>
PG_PASSWORD=<db password>
PG_SSL=false

# Email (SMTP)
SMTP_HOST=mail.myvedicastrology.in
SMTP_PORT=465
SMTP_USER=info@myvedicastrology.in
SMTP_PASS=<smtp password>
SMTP_FROM=info@myvedicastrology.in

# Site URL
VITE_SITE_URL=https://myvedicastrology.in
FRONTEND_URL=https://myvedicastrology.in

# AI
GEMINI_API_KEY=<gemini key>
GEMINI_MODEL=gemini-2.5-flash
OPENAI_API_KEY=<openai key>
OPENAI_MODEL=gpt-4o-mini
```

> All actual values are in `.env.local` on the developer's machine — share that file securely with the server team.

## Start the server

### Option A — PM2 (recommended)
```bash
pm2 start server/index.ts \
  --name vedic \
  --interpreter node \
  --interpreter-args "--env-file=.env --import=tsx/esm"

pm2 save
pm2 startup
```

### Option B — Direct node
```bash
node --env-file=.env --import=tsx/esm server/index.ts
```

### Option C — If tsx is not available globally
```bash
npx tsx --env-file=.env server/index.ts
```

## Restart after code update

```bash
git pull origin master
npm install
npm run build
pm2 restart vedic
```

## Verify it's working

- Visit https://myvedicastrology.in — site loads
- Admin login: https://myvedicastrology.in/admin/login
- Book a service and click Pay — Razorpay popup should open

## Notes

- The server serves the static Vite build from `dist/` AND handles all `/api/*` routes
- Default port: 3002 (use nginx reverse proxy or set `PORT=80`)
