# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase service account added
- [ ] Build tested locally
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Error handling implemented

---

## Option 1: Vercel (Frontend) + Render (Backend) [RECOMMENDED]

### Frontend - Vercel

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Build & Deploy:**
```bash
cd client
npm run build
vercel --prod
```

**3. Configure Environment:**
- Go to Vercel Dashboard
- Add all `VITE_*` variables
- Redeploy

### Backend - Render

**1. Create Account:** https://render.com

**2. New Web Service:**
- Connect GitHub repo
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**3. Environment Variables:**
Add all from `.env`:
- `PORT=5000`
- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY` (entire key)
- `FIREBASE_CLIENT_EMAIL`
- `ADMIN_EMAILS`
- `CORS_ORIGINS` (add your Vercel URL)

**4. Deploy!**

---

## Option 2: Firebase Hosting (Complete)

**1. Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
```

**2. Initialize:**
```bash
firebase init hosting
firebase init functions  # For backend
```

**3. Deploy:**
```bash
# Build frontend
cd client && npm run build

# Deploy
firebase deploy
```

---

## Option 3: VPS Deployment (Ubuntu/Linux)

### Server Setup

**1. Connect to VPS:**
```bash
ssh root@your-server-ip
```

**2. Install Dependencies:**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

**3. Clone & Setup:**
```bash
cd /var/www
git clone https://github.com/lokesh123d/Dk-Holidays.git
cd Dk-Holidays/DK-Holidays-MERN

# Install dependencies
cd server && npm install
cd ../client && npm install
```

**4. Environment Variables:**
```bash
# Server
cd /var/www/Dk-Holidays/DK-Holidays-MERN/server
nano .env
# Paste production variables

# Client
cd ../client
nano .env
# Paste production variables
```

**5. Build Frontend:**
```bash
cd /var/www/Dk-Holidays/DK-Holidays-MERN/client
npm run build
```

**6. Configure PM2:**
```bash
cd /var/www/Dk-Holidays/DK-Holidays-MERN/server

# Start backend
pm2 start server.js --name dk-holidays-backend

# Save PM2 config
pm2 save
pm2 startup
```

**7. Configure Nginx:**
```bash
nano /etc/nginx/sites-available/dk-holidays
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/Dk-Holidays/DK-Holidays-MERN/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/dk-holidays /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**8. SSL Certificate:**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**9. Firewall:**
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

---

## Option 4: Heroku (Simple)

**1. Install Heroku CLI:**
```bash
npm install -g heroku
heroku login
```

**2. Create Apps:**
```bash
# Frontend
cd client
heroku create dk-holidays-frontend

# Backend
cd ../server
heroku create dk-holidays-backend
```

**3. Configure Environment:**
```bash
# Backend
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your_id
# ... all other variables

# Frontend
heroku config:set VITE_API_URL=https://dk-holidays-backend.herokuapp.com/api
# ... all other VITE_ variables
```

**4. Deploy:**
```bash
# Backend
cd server
git push heroku main

# Frontend
cd ../client
git push heroku main
```

---

## Post-Deployment

### 1. Test Everything
- [ ] Homepage loads
- [ ] Login works
- [ ] Car booking works
- [ ] Flight/Train search works
- [ ] WhatsApp integration works
- [ ] Admin panel accessible

### 2. Performance
```bash
# Test with Lighthouse
# Aim for 90+ scores

# Enable compression in Nginx
gzip on;
gzip_types text/css application/javascript;
```

### 3. Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs dk-holidays-backend
```

### 4. Backup
```bash
# Automated Firebase backup
# Use Firebase CLI or Cloud Functions
```

---

## Domain Configuration

**1. Buy Domain:** Namecheap, GoDaddy, etc.

**2. Point DNS:**
```
A Record: @ → your-server-ip
A Record: www → your-server-ip
```

**3. Wait for Propagation:** 24-48 hours

---

## Continuous Deployment

**GitHub Actions:**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd client
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting

### Backend Not Starting
```bash
pm2 logs dk-holidays-backend
# Check for errors
```

### Frontend 404 Errors
```bash
# Rebuild
cd client
npm run build

# Check Nginx config
nginx -t
```

### Firebase Connection Issues
```bash
# Verify service account JSON
# Check FIREBASE_PROJECT_ID matches
```

---

## Support

📧 **Email:** lokesh25@navgurukul.org  
💬 **WhatsApp:** 7037447309

---

**Ready for Production! 🚀**
