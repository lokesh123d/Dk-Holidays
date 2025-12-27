---
description: Deploy DK Holidays project to Firebase
---

# 🚀 Full Firebase Deployment Workflow

Complete guide to deploy DK Holidays frontend and backend to Firebase.

## 📦 What's Already Set Up

✅ Firebase configuration (`firebase.json`)  
✅ Cloud Functions setup (`functions/` directory)  
✅ Backend code migrated to functions  
✅ Automated deployment script (`deploy-firebase.sh`)  
✅ Environment configuration templates

---

## 🎯 Quick Deployment (Automated)

### Prerequisites
1. Firebase project created (`dk-holidays`)
2. Firebase CLI installed
3. Firebase credentials available

### Step 1: Authenticate with Firebase
```bash
firebase login
```

### Step 2: Link Project
```bash
echo '{"projects":{"default":"dk-holidays"}}' > .firebaserc
```

### Step 3: Configure Environment Variables

Get your Firebase service account key from:
https://console.firebase.google.com/project/dk-holidays/settings/serviceaccounts/adminsdk

Then set config:
```bash
firebase functions:config:set \
  firebase.project_id="dk-holidays" \
  firebase.client_email="firebase-adminsdk-xxxxx@dk-holidays.iam.gserviceaccount.com" \
  firebase.private_key="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
```

### Step 4: Update Frontend Environment

Create `client/.env.production`:
```env
VITE_API_URL=https://us-central1-dk-holidays.cloudfunctions.net/api
VITE_FIREBASE_PROJECT_ID=dk-holidays
# Add other VITE_ variables from Firebase console
```

### Step 5: Run Deployment Script
// turbo
```bash
chmod +x deploy-firebase.sh && ./deploy-firebase.sh
```

**Your app will be live at:** https://dk-holidays.web.app  
**API endpoint:** https://us-central1-dk-holidays.cloudfunctions.net/api

---

## 🔧 Manual Deployment (Step-by-Step)

### Step 1: Authenticate
```bash
firebase login
```

### Step 2: Install Dependencies
// turbo
```bash
cd functions && npm install && cd ../client && npm install && cd ..
```

### Step 3: Build Frontend
// turbo
```bash
cd client && npm run build && cd ..
```

### Step 4: Deploy
```bash
firebase deploy
```

---

## 📝 Alternative: Hosting Only (Frontend)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase Hosting
```bash
cd /home/sama/Desktop/DK\ Holidays/DK-Holidays-MERN
firebase init hosting
```

**Configuration Answers:**
- Select existing project: `dk-holidays`
- What do you want to use as your public directory? → `client/dist`
- Configure as a single-page app? → `Yes`
- Set up automatic builds and deploys with GitHub? → `No` (for now)
- File `client/dist/index.html` already exists. Overwrite? → `No`

### Step 4: Update Firebase Configuration
The init command will create `firebase.json`. You need to ensure it has:
```json
{
  "hosting": {
    "public": "client/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 5: Build the Frontend
```bash
cd client
npm install
npm run build
```

### Step 6: Deploy to Firebase
```bash
cd ..
firebase deploy --only hosting
```

**Your frontend will be live at:** `https://dk-holidays.web.app` or `https://dk-holidays.firebaseapp.com`

### Step 7: Update Backend CORS (if needed)
Update your backend's CORS configuration to allow the Firebase hosting URL.

---

## OPTION 2: Full Firebase Deployment (Frontend + Backend)

### Part A: Frontend (Same as Option 1)
Follow Steps 1-6 from Option 1 above.

### Part B: Backend to Cloud Functions

### Step 1: Initialize Firebase Functions
```bash
cd /home/sama/Desktop/DK\ Holidays/DK-Holidays-MERN
firebase init functions
```

**Configuration Answers:**
- Select existing project: `dk-holidays`
- Language: `JavaScript`
- Use ESLint? → `No` (or Yes if you prefer)
- Install dependencies now? → `Yes`

### Step 2: Migrate Express App to Cloud Functions
This will create a `functions` directory. You'll need to:
1. Copy your server code into `functions/index.js`
2. Wrap your Express app for Cloud Functions

Example structure:
```javascript
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Your existing Express routes here
// ... (copy from server/server.js)

exports.api = functions.https.onRequest(app);
```

### Step 3: Update package.json in functions
Copy dependencies from `server/package.json` to `functions/package.json`

### Step 4: Set Environment Variables for Functions
```bash
firebase functions:config:set \
  firebase.project_id="dk-holidays" \
  firebase.client_email="your-client-email" \
  firebase.private_key="your-private-key"
```

### Step 5: Deploy Functions
```bash
firebase deploy --only functions
```

**Your API will be at:** `https://us-central1-dk-holidays.cloudfunctions.net/api`

### Step 6: Update Frontend API URL
Update `client/.env.production`:
```
VITE_API_URL=https://us-central1-dk-holidays.cloudfunctions.net/api
```

Rebuild and redeploy:
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

---

## Quick Deploy Commands

### For Hosting Only:
```bash
cd /home/sama/Desktop/DK\ Holidays/DK-Holidays-MERN/client
npm run build
cd ..
firebase deploy --only hosting
```

### For Full Deploy (Hosting + Functions):
```bash
# Build frontend
cd /home/sama/Desktop/DK\ Holidays/DK-Holidays-MERN/client
npm run build

# Deploy everything
cd ..
firebase deploy
```

---

## Custom Domain Setup (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `dkholidays.com`)
4. Follow DNS configuration instructions
5. Firebase will automatically provision SSL certificate

---

## Useful Commands

```bash
# View hosting URL
firebase hosting:channel:list

# Preview before deploying
firebase hosting:channel:deploy preview

# View function logs
firebase functions:log

# View all deployed sites
firebase projects:list
```

---

## Troubleshooting

### Build fails
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf client/node_modules client/dist`
- Reinstall: `cd client && npm install && npm run build`

### 404 errors on refresh
- Ensure `rewrites` are configured in `firebase.json`
- Single-page app setting should be `Yes`

### Functions timeout
- Cloud Functions have 60s timeout by default
- Increase in `firebase.json`: `"timeout": "120s"`

---

## Cost Considerations

**Firebase Free Tier (Spark Plan):**
- Hosting: 10 GB storage, 360 MB/day transfer
- Functions: 2M invocations/month

**Paid Tier (Blaze Plan):**
- Pay as you go
- Required for Cloud Functions with external API calls
- Check pricing: https://firebase.google.com/pricing

---

## Monitoring

1. **Firebase Console**: https://console.firebase.google.com/project/dk-holidays
   - View hosting traffic
   - Monitor function executions
   - Check errors

2. **Google Cloud Console**: https://console.cloud.google.com
   - Detailed logs
   - Performance monitoring

---

**🎉 Your app will be live at: https://dk-holidays.web.app**
