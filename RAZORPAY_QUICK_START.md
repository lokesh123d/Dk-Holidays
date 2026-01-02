# 🎯 Razorpay Live Integration - Quick Start

## ✅ **Step 1: Update .env File**

Add these lines to `/server/.env`:

```env
# Razorpay LIVE Configuration
RAZORPAY_KEY_ID=rzp_live_Rz14paGqsGE2Vq
RAZORPAY_KEY_SECRET=6c3dRJ6og6wQqV8BHRg2bTWE
```

---

## ✅ **Step 2: Restart Server**

```bash
# Stop current server (Ctrl+C)
# Then restart:
cd server
npm run dev
```

You should see:
```
✅ Payment provider set to RAZORPAY and ENABLED.
Server running on port 5000
```

---

## ✅ **Step 3: Test on Localhost**

1. **Open**: http://localhost:3000
2. **Navigate to**: Tours or Car Rentals
3. **Click**: "Book Now" on any package
4. **Fill** the booking form
5. **Click**: "Pay Online Now"
6. **Razorpay popup** should appear

### ⚠️ **IMPORTANT - LIVE MODE**:
- **Real money will be charged!**
- Test with **small amounts** (₹1-10)
- Use your own card/UPI
- Refund immediately from Razorpay dashboard if needed

---

## 🌐 **For Production (Live URL)**

### **Recommended: Render.com + Vercel**

#### **Backend (Render.com)**:

1. **Push to GitHub**:
```bash
git add .
git commit -m "Razorpay live integration"
git push origin main
```

2. **Deploy on Render**:
   - Go to https://render.com
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** in Render:
   ```
   RAZORPAY_KEY_ID = rzp_live_Rz14paGqsGE2Vq
   RAZORPAY_KEY_SECRET = 6c3dRJ6og6wQqV8BHRg2bTWE
   PORT = 5000
   NODE_ENV = production
   CLIENT_URL = https://your-frontend.vercel.app
   ```
   
   **Also add your Firebase credentials**:
   ```
   FIREBASE_PROJECT_ID = your-project-id
   FIREBASE_CLIENT_EMAIL = your-email@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. **Deploy** - Your API will be at: `https://your-app.onrender.com`

#### **Frontend (Vercel)**:

1. **Update API URL** in `/client/src/services/apiService.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app.onrender.com/api';
```

2. **Deploy**:
```bash
cd client
npm install -g vercel
vercel login
vercel
```

3. **Add Environment Variable**:
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `REACT_APP_API_URL = https://your-app.onrender.com/api`

4. **Redeploy**: `vercel --prod`

---

## 🔒 **Security Checklist**

- [x] Keys stored in environment variables (not in code)
- [x] .env file in .gitignore
- [ ] Test payment flow on localhost
- [ ] Add CORS configuration for production URL
- [ ] Set up Razorpay webhooks
- [ ] Monitor first transactions closely

---

## 🚨 **Troubleshooting**

### **"Razorpay Keys not configured"**
- Check .env file has the keys
- Restart server after adding keys
- Verify no typos in key names

### **"Payment module missing"**
```bash
cd server
npm install razorpay
npm run dev
```

### **Payment fails immediately**
- Check Razorpay account is activated
- Verify KYC is completed
- Check live mode is enabled in dashboard

---

## 📊 **Monitor Payments**

**Razorpay Dashboard**: https://dashboard.razorpay.com
- View all transactions
- Refund payments
- Download reports
- Set up webhooks

---

## 💡 **Quick Commands**

```bash
# Test Localhost
cd server && npm run dev
cd client && npm run dev

# Deploy to Production
git push origin main
# Then deploy via Render + Vercel dashboards
```

---

## 📖 **Full Documentation**

See `RAZORPAY_DEPLOYMENT_GUIDE.md` for:
- Detailed deployment steps
- Security best practices
- Webhook setup
- Alternative hosting options (Firebase, Heroku)

---

**🎉 You're all set! Test on localhost first, then deploy to production.**
