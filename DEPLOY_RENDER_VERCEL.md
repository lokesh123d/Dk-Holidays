# 🚀 Deploy DK Holidays on Render + Vercel

Complete step-by-step guide to deploy your project for FREE!

---

## 📋 Overview

- **Frontend (Vercel):** React app → https://dk-holidays.vercel.app
- **Backend (Render):** Node.js API → https://dk-holidays-api.onrender.com

**Total Time:** 15-20 minutes

---

## 🎯 Part 1: Deploy Backend on Render

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

---

### Step 2: Connect Repository

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** (if needed)
3. Find and select: **`lokesh123d/Dk-Holidays`**
4. Click **"Connect"**

---

### Step 3: Configure Service

**Fill in the form:**

| Field | Value |
|-------|-------|
| **Name** | `dk-holidays-backend` |
| **Region** | `Singapore` (or closest) |
| **Branch** | `main` |
| **Root Directory** | `DK-Holidays-MERN/server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

Click **"Advanced"** to add environment variables.

---

### Step 4: Add Environment Variables

Click **"Add Environment Variable"** for each:

```env
# Required Variables
PORT=5000
NODE_ENV=production

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Admin
ADMIN_EMAILS=lokesh25@navgurukul.org

# CORS (Will update after deploying frontend)
CORS_ORIGINS=http://localhost:3000
```

**⚠️ Important:**
- For `FIREBASE_PRIVATE_KEY`, include the quotes and `\n` newlines
- Copy the entire private key from your Firebase service account JSON

---

### Step 5: Get Firebase Credentials

**Option A: From Firebase Console**
1. Go to: https://console.firebase.google.com
2. Select your project
3. ⚙️ **Settings** → **Project settings**
4. **Service accounts** tab
5. Click **"Generate new private key"**
6. Download JSON file
7. Copy values from JSON to Render environment variables

**Option B: From Local File**
```bash
# If you have serviceAccountKey.json locally
cat server/config/serviceAccountKey.json

# Copy:
# - project_id → FIREBASE_PROJECT_ID
# - client_email → FIREBASE_CLIENT_EMAIL
# - private_key → FIREBASE_PRIVATE_KEY
```

---

### Step 6: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll see build logs
4. When done, you'll get a URL like: `https://dk-holidays-backend.onrender.com`

**✅ Test Backend:**
```
https://dk-holidays-backend.onrender.com/api/cars
```

Should return car data!

---

## 🎨 Part 2: Deploy Frontend on Vercel

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

---

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find: **`lokesh123d/Dk-Holidays`**
3. Click **"Import"**

---

### Step 3: Configure Project

**Project Settings:**

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `DK-Holidays-MERN/client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```env
# API URL (Use your Render backend URL)
VITE_API_URL=https://dk-holidays-backend.onrender.com/api

# Firebase Config (Get from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

**Get Firebase Config:**
1. Firebase Console → ⚙️ Settings → Project settings
2. Scroll to **"Your apps"**
3. Click **"Web app"** (</> icon)
4. Copy the config values

---

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://dk-holidays.vercel.app`

**✅ Success!** Your frontend is live!

---

## 🔗 Part 3: Connect Frontend & Backend

### Update Backend CORS

1. Go to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Update `CORS_ORIGINS`:
```
https://dk-holidays.vercel.app,https://dk-holidays-*.vercel.app
```
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## 🧪 Part 4: Test Deployment

### Test Checklist:

1. **Frontend Loads:**
   ```
   https://dk-holidays.vercel.app
   ```
   - ✅ Homepage visible
   - ✅ Hero slider works
   - ✅ Service cards display

2. **Backend API:**
   ```
   https://dk-holidays-backend.onrender.com/api/cars
   ```
   - ✅ Returns JSON data

3. **Authentication:**
   - ✅ Login with Google works
   - ✅ Can access Admin Dashboard

4. **Features:**
   - ✅ Car listing works
   - ✅ Flight search works
   - ✅ Train search works
   - ✅ Reviews display
   - ✅ Offers display

---

## 🎉 Your Live URLs

**Frontend (Vercel):**
```
https://dk-holidays.vercel.app
```

**Backend (Render):**
```
https://dk-holidays-backend.onrender.com
```

**Admin Panel:**
```
https://dk-holidays.vercel.app/admin
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Backend Not Loading

**Error:** "Application failed to respond"

**Fix:**
1. Check Render logs
2. Verify all environment variables set
3. Ensure `PORT=5000` is set
4. Check `package.json` has start script:
```json
"scripts": {
  "start": "node server.js"
}
```

---

### Issue 2: CORS Errors

**Error:** "Access to fetch blocked by CORS"

**Fix:**
1. Update `CORS_ORIGINS` in Render
2. Include your Vercel URL
3. Save and redeploy

---

### Issue 3: Firebase Connection Failed

**Error:** "Firebase: Error (auth/...)"

**Fix:**
1. Verify all `VITE_FIREBASE_*` variables in Vercel
2. Check Firebase project is active
3. Ensure Google Sign-in enabled in Firebase

---

### Issue 4: Environment Variables Not Working

**Fix Vercel:**
1. Go to Project → Settings → Environment Variables
2. Select **"Production"**, **"Preview"**, **"Development"**
3. Redeploy from Deployments tab

**Fix Render:**
1. Environment tab → Edit variable
2. Save → Auto redeploys

---

## 🔄 Update Deployment

### Update Backend (Render):
```bash
# Just push to GitHub
git add .
git commit -m "Updated backend"
git push

# Render auto-deploys! ✅
```

### Update Frontend (Vercel):
```bash
# Push to GitHub
git add .
git commit -m "Updated frontend"
git push

# Vercel auto-deploys! ✅
```

---

## 💰 Free Tier Limits

**Render Free:**
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 750 hours/month

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth
- ✅ Always online
- ✅ Custom domain support

---

## 🚀 Optional: Custom Domain

### On Vercel:
1. Go to Project → Settings → Domains
2. Add your domain: `dkholidays.com`
3. Update DNS as instructed
4. SSL auto-configured ✅

### On Render:
1. Service → Settings → Custom Domain
2. Add: `api.dkholidays.com`
3. Update DNS CNAME
4. SSL auto-configured ✅

---

## 📊 Monitoring

### Vercel Dashboard:
- View deployments
- Check analytics
- See error logs

### Render Dashboard:
- Monitor service health
- View logs
- Check metrics

---

## 🎯 Performance Tips

1. **Enable Caching:**
   - Vercel auto-caches static assets

2. **Optimize Images:**
   ```bash
   # Use Vercel Image Optimization
   # Already configured in Vite
   ```

3. **Monitor First Load:**
   - Use Lighthouse in Chrome DevTools
   - Aim for 90+ score

---

## 📞 Need Help?

**Deployment Issues:**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

**Project Issues:**
- GitHub: https://github.com/lokesh123d/Dk-Holidays
- Email: lokesh25@navgurukul.org
- WhatsApp: 7037447309

---

## ✅ Deployment Complete!

**Your app is now live on the internet! 🎉**

**Frontend:** https://dk-holidays.vercel.app  
**Backend:** https://dk-holidays-backend.onrender.com  

**Share your website with the world! 🌍**

---

**Next Steps:**
1. Test all features
2. Add custom domain (optional)
3. Enable analytics
4. Share with users!

**Happy Deploying! 🚀**
