# Hosting Team — Action Required

## What needs to happen (takes ~2 minutes)

The Node.js app on this server needs to pull the latest code from GitHub and restart.

**GitHub repo:** https://github.com/[your-repo-url]
**Latest commit:** fde5a55 — "fix: read Razorpay keys and admin credentials from DB when env vars missing"

---

## Option A — cPanel "Setup Node.js App" (recommended)

1. Log into cPanel
2. Go to **Software → Setup Node.js App**
3. Find the app for `myvedicastrology.in`
4. Click **Pull from Git** (or "Deploy" if using Git Version Control)
5. Click **Restart** (or Stop → Start)

That's it. No env vars needed — credentials are already in the database.

---

## Option B — SSH

```bash
cd /home/$(whoami)/myvedicastrology.in
git pull origin master
npm install --production
# Then restart the Node.js app via pm2, forever, or cPanel
pm2 restart all       # if using pm2
# OR
pm2 restart server    # if named "server"
```

---

## Why this fixes it

The site currently shows:
- "Razorpay keys not configured" → payment broken
- "Admin login not configured" → admin panel broken

The fix is already in the code (committed to GitHub). The code now reads
Razorpay keys and admin credentials from the database automatically —
**no environment variables need to be set on the server**.

The database already has all credentials stored.

---

## After restart, verify

```bash
# Should return {"ok":true} with a Set-Cookie header
curl -X POST https://myvedicastrology.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@myvedicastrology.in","password":"Admin@123"}'

# Should return {"ok":true,"order":{...}}
curl -X POST https://myvedicastrology.in/api/razorpay/order \
  -H "Content-Type: application/json" \
  -d '{"amount":100000}'
```
