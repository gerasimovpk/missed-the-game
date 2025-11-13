# 🚀 Deployment Guide - Missed The Game

## Overview

This guide will help you deploy your application in the correct order. You have two components to deploy:

1. **Cloudflare Worker** (API proxy) - Deploy FIRST
2. **Next.js App** (main application) - Deploy SECOND

---

## Part 1: Deploy Cloudflare Worker

### Prerequisites
- Cloudflare account (free tier is fine)
- Command line access

### Steps

#### 1.1 Login to Cloudflare

```bash
cd cloudflare-worker
npx wrangler login
```

This will open a browser window for you to authenticate.

#### 1.2 Deploy the Worker

```bash
npx wrangler deploy
```

or use the npm script from the root:

```bash
cd ..
npm run worker:deploy
```

#### 1.3 Get Your Worker URL

After deployment, you'll see output like:

```
Published missed-the-game-proxy (0.42 sec)
  https://missed-the-game-proxy.YOUR_SUBDOMAIN.workers.dev
```

**⚠️ IMPORTANT**: Copy this URL! You'll need it for the Next.js app.

---

## Part 2: Deploy Next.js App to Vercel

### Prerequisites
- Vercel account (free tier is fine)
- GitHub repository (optional but recommended)

### Option A: Deploy via Vercel CLI (Quickest)

#### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2.2 Login to Vercel

```bash
vercel login
```

#### 2.3 Deploy

From your project root:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N** (first time)
- What's your project name? **missed-the-game** (or your preference)
- In which directory is your code? **./**
- Auto-detected framework: **Next.js**
- Override settings? **N**

#### 2.4 Set Environment Variables

After first deployment, set your environment variables:

```bash
vercel env add NEXT_PUBLIC_SCOREBAT_PROXY_URL
```

Enter the Cloudflare Worker URL from Part 1.

Repeat for all environment variables:

```bash
# Required Variables
vercel env add NEXT_PUBLIC_GA4_ID
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_BMAC_PROFILE
vercel env add NEXT_PUBLIC_DONATION_RETURN_URL

# Optional Variables
vercel env add NEXT_PUBLIC_TOP_COMPETITIONS
vercel env add MAILCHIMP_API_KEY
vercel env add MAILCHIMP_SERVER_PREFIX
vercel env add MAILCHIMP_AUDIENCE_ID
```

#### 2.5 Redeploy with Environment Variables

```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard (Recommended for GitHub Integration)

#### 2.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2.2 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

#### 2.3 Configure Environment Variables

In the Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add all required variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NEXT_PUBLIC_SCOREBAT_PROXY_URL` | Your Cloudflare Worker URL | From Part 1 |
| `NEXT_PUBLIC_GA4_ID` | G-XXXXXXXXXX | Your Google Analytics 4 ID |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | G-XXXXXXXXXX | From Firebase Console |
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | From Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | From Supabase Dashboard |
| `NEXT_PUBLIC_BMAC_PROFILE` | gerasimovpb | Your Buy Me a Coffee profile |
| `NEXT_PUBLIC_DONATION_RETURN_URL` | https://yourdomain.vercel.app/thanks | Your deployed URL + /thanks |
| `NEXT_PUBLIC_TOP_COMPETITIONS` | ["Premier League","La Liga",...] | Optional: JSON array |
| `MAILCHIMP_API_KEY` | Your Mailchimp API key | Optional |
| `MAILCHIMP_SERVER_PREFIX` | us10 | Optional |
| `MAILCHIMP_AUDIENCE_ID` | Your audience ID | Optional |

#### 2.4 Deploy

Click **"Deploy"** and Vercel will build and deploy your app.

---

## Part 3: Post-Deployment Setup

### 3.1 Update Donation Return URL

After you get your Vercel domain:

1. Go to Vercel → Settings → Environment Variables
2. Update `NEXT_PUBLIC_DONATION_RETURN_URL` to:
   ```
   https://your-domain.vercel.app/thanks
   ```
3. Redeploy

### 3.2 Configure Firebase Auth

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized Domains**:
   - `your-domain.vercel.app`
   - Add custom domain if you have one

### 3.3 Update Supabase Allowed URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL** and **Redirect URLs**

### 3.4 Configure GA4

1. Go to Google Analytics → Admin → Data Streams
2. Add your Vercel domain to allowed domains
3. Configure Consent Mode v2 if needed

### 3.5 Set up Custom Domain (Optional)

In Vercel:
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Quick Deploy Commands

### Deploy Everything

```bash
# 1. Deploy Cloudflare Worker
cd cloudflare-worker
npx wrangler deploy

# 2. Deploy to Vercel
cd ..
vercel --prod
```

### Update Worker Only

```bash
npm run worker:deploy
```

### Update Next.js Only

```bash
vercel --prod
```

---

## Troubleshooting

### Worker Not Working
- Check if the worker is deployed: `npx wrangler deployments list`
- Test the worker URL directly in browser
- Check worker logs: `npx wrangler tail`

### Next.js Build Fails
- Verify all environment variables are set
- Check build logs in Vercel dashboard
- Test build locally: `npm run build`

### Videos Not Loading
- Verify `NEXT_PUBLIC_SCOREBAT_PROXY_URL` is correct
- Check Network tab in browser DevTools
- Verify Cloudflare Worker is responding

### Authentication Not Working
- Verify Firebase configuration is correct
- Check that your domain is added to Firebase Authorized Domains
- Verify Supabase URL configuration

---

## Monitoring

### Vercel Analytics
- Go to Vercel Dashboard → Your Project → Analytics
- Monitor performance, errors, and usage

### Cloudflare Analytics
- Go to Cloudflare Dashboard → Workers & Pages
- Monitor worker requests and errors

### Google Analytics
- Monitor user behavior and conversions
- Check GA4 Real-Time reports

---

## Next Steps

After deployment:

1. ✅ Test all features on production
2. ✅ Set up monitoring and alerts
3. ✅ Configure custom domain
4. ✅ Set up continuous deployment (GitHub → Vercel)
5. ✅ Monitor performance and errors
6. ✅ Share your app! 🎉

---

**Need Help?**
- Check Vercel docs: https://vercel.com/docs
- Check Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Check deployment logs for specific error messages

