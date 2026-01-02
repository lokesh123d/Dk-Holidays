# 🚀 Razorpay Live Integration & Deployment Guide

## 📋 Current Setup (Localhost)

### Your Razorpay LIVE Credentials:
- **Key ID**: `rzp_live_Rz14paGqsGE2Vq`
- **Key Secret**: `6c3dRJ6og6wQqV8BHRg2bTWE`

### ⚠️ IMPORTANT SECURITY NOTES:
1. **NEVER commit these keys to GitHub**
2. **NEVER share these keys publicly**
3. **Always use environment variables**
4. **The .env file is already in .gitignore**

---

## 🔧 Step 1: Update Local Environment (.env file)

Create or update `/server/.env` file with:

```env
# Razorpay LIVE Configuration
RAZORPAY_KEY_ID=rzp_live_Rz14paGqsGE2Vq
RAZORPAY_KEY_SECRET=6c3dRJ6og6wQqV8BHRg2bTWE

# Other configurations...
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Step 2: Test on Localhost

### 1. Restart your server:
```bash
cd server
npm run dev
```

### 2. Test Payment Flow:
1. Go to http://localhost:3000
2. Navigate to a tour package or car rental
3. Click "Book Now"
4. Fill in the form
5. Click "Pay Online Now"
6. **Use REAL payment methods** (Live keys require real cards/UPI)

### 3. Test Cards (Razorpay Live):
⚠️ **LIVE keys will charge REAL money!**
- Use small amounts for testing (₹1-10)
- Or use your own cards and refund immediately from Razorpay dashboard

---

## 🌐 Step 3: Deploy to Production (Live URL)

### Option A: Deploy to Render.com (Recommended)

#### Backend Deployment:

1. **Push code to GitHub** (without .env file):
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to Render.com**:
   - Sign up at https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as root directory

3. **Configure Build Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Add Environment Variables** (CRITICAL):
   Click "Environment" tab and add:
   ```
   RAZORPAY_KEY_ID = rzp_live_Rz14paGqsGE2Vq
   RAZORPAY_KEY_SECRET = 6c3dRJ6og6wQqV8BHRg2bTWE
   PORT = 5000
   NODE_ENV = production
   CLIENT_URL = https://your-frontend-url.vercel.app
   FIREBASE_PROJECT_ID = your-project-id
   FIREBASE_CLIENT_EMAIL = your-email@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

5. **Deploy**: Click "Create Web Service"
   - Your backend will be live at: `https://your-app.onrender.com`

#### Frontend Deployment:

1. **Update API URL** in `/client/src/services/apiService.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app.onrender.com/api';
```

2. **Deploy to Vercel**:
```bash
cd client
npm install -g vercel
vercel login
vercel
```

3. **Add Environment Variable** in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL = https://your-app.onrender.com/api`

4. **Redeploy**: `vercel --prod`

---

### Option B: Deploy to Firebase Hosting + Cloud Functions

#### 1. Backend (Cloud Functions):

```bash
cd server
firebase init functions
# Select your project
# Choose JavaScript
# Install dependencies
```

Update `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const app = require('./app'); // Your Express app

exports.api = functions.https.onRequest(app);
```

Set environment variables:
```bash
firebase functions:config:set razorpay.key_id="rzp_live_Rz14paGqsGE2Vq"
firebase functions:config:set razorpay.key_secret="6c3dRJ6og6wQqV8BHRg2bTWE"
```

Deploy:
```bash
firebase deploy --only functions
```

#### 2. Frontend (Firebase Hosting):

```bash
cd client
npm run build
firebase deploy --only hosting
```

---

### Option C: Deploy to Heroku

#### Backend:

1. **Create Heroku app**:
```bash
cd server
heroku create dk-holidays-api
```

2. **Set environment variables**:
```bash
heroku config:set RAZORPAY_KEY_ID=rzp_live_Rz14paGqsGE2Vq
heroku config:set RAZORPAY_KEY_SECRET=6c3dRJ6og6wQqV8BHRg2bTWE
heroku config:set NODE_ENV=production
```

3. **Deploy**:
```bash
git push heroku main
```

---

## 🔒 Security Best Practices for Production

### 1. Environment Variables:
✅ **DO**:
- Store keys in platform environment variables (Render, Vercel, Heroku)
- Use different keys for development and production
- Rotate keys periodically

❌ **DON'T**:
- Commit .env files to Git
- Hardcode keys in source code
- Share keys in chat/email

### 2. CORS Configuration:
Update server to allow only your frontend:
```javascript
// server/index.js or app.js
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### 3. Webhook Security:
Add webhook signature verification in payment controller:
```javascript
const crypto = require('crypto');

// Verify Razorpay webhook signature
const verifyWebhookSignature = (body, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');
  return expectedSignature === signature;
};
```

### 4. Rate Limiting:
Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/api/payment', paymentLimiter);
```

---

## 📊 Monitoring & Testing

### 1. Razorpay Dashboard:
- Login to https://dashboard.razorpay.com
- Monitor all transactions in real-time
- Set up webhooks for payment events
- Download transaction reports

### 2. Test Payments:
```
⚠️ LIVE MODE - Real money will be charged!

Test with small amounts:
- ₹1 for testing
- Immediately refund from dashboard if needed
```

### 3. Webhook Setup:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-api.onrender.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret and add to environment variables

---

## 🚨 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Double-check environment variables are set correctly on your hosting platform

### Issue: "CORS Error"
**Solution**: Update CLIENT_URL in backend environment variables to match your frontend URL

### Issue: "Payment fails immediately"
**Solution**: 
- Check if Razorpay account is activated
- Verify KYC is completed
- Check if live mode is enabled in Razorpay dashboard

### Issue: "Webhook not receiving events"
**Solution**:
- Verify webhook URL is publicly accessible
- Check webhook secret is correct
- Enable webhook logs in Razorpay dashboard

---

## 📝 Checklist Before Going Live

- [ ] Test payment flow on localhost
- [ ] Verify Razorpay KYC is completed
- [ ] Set up environment variables on hosting platform
- [ ] Configure CORS to allow only your frontend
- [ ] Set up webhooks in Razorpay dashboard
- [ ] Add rate limiting to payment endpoints
- [ ] Test with small real payments
- [ ] Set up refund policy
- [ ] Add payment confirmation emails
- [ ] Monitor first few transactions closely

---

## 💡 Quick Start Commands

### Localhost Testing:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Deploy to Render + Vercel:
```bash
# 1. Push to GitHub
git add .
git commit -m "Production ready"
git push

# 2. Deploy backend to Render (via dashboard)
# 3. Deploy frontend to Vercel
cd client
vercel --prod
```

---

## 🎉 You're Ready!

Your Razorpay integration is now configured with LIVE keys. Test thoroughly on localhost before deploying to production!

**Need help?** Contact Razorpay support: support@razorpay.com
