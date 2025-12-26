# DK Holidays - Car Rental Platform

![DK Holidays](https://img.shields.io/badge/Status-Production%20Ready-success)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)
![React](https://img.shields.io/badge/Frontend-React%20+%20Vite-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20+%20Express-green)

Professional car rental platform for DK Holidays in Dharamshala with flight & train booking integration.

## 🚀 Features

### Customer Features
- 🚗 **Car Rental** - Browse and book vehicles
- ✈️ **Flight Booking** - Search and book flights
- 🚂 **Train Booking** - Search and book trains
- 🏥 **Insurance Services** - Turtlemint integration
- ⭐ **Reviews System** - Customer feedback
- 🎁 **Special Offers** - Promotional deals
- 📱 **WhatsApp Integration** - Direct booking requests
- 📧 **Email Notifications** - Booking confirmations

### Admin Features
- 📊 **Dashboard** - Manage all operations
- 🚘 **Car Management** - Add/Edit/Delete vehicles
- 💬 **Review Management** - Moderate customer reviews
- 🎯 **Offer Management** - Create promotional campaigns
- 🔐 **Secure Authentication** - Firebase Auth with admin controls

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** CSS3 (Pinterest-inspired theme)
- **State Management:** React Hooks
- **Routing:** React Router v6
- **Notifications:** React Toastify
- **Authentication:** Firebase Auth

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Admin SDK
- **Middleware:** CORS, Body Parser

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/lokesh123d/Dk-Holidays.git
cd Dk-Holidays/DK-Holidays-MERN
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd../client
npm install
```

### 3. Environment Setup

**Backend (.env):**
```bash
cd server
cp .env.example .env
# Edit .env with your Firebase credentials
```

**Frontend (.env):**
```bash
cd client
cp .env.example .env
# Edit .env with your Firebase config
```

### 4. Firebase Setup
1. Create Firebase project: https://console.firebase.google.com
2. Enable Authentication (Google Sign-in)
3. Create Firestore database
4. Download service account key → `server/firebase-service-account.json`
5. Get web config → Add to `client/.env`

### 5. Run Development

**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
cd client
npm run dev
```

**Access:** http://localhost:3000

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel):**
```bash
cd client
npm run build
vercel --prod
```

**Backend (Render):**
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Option 2: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 3: VPS (Complete Control)

```bash
# Install Node.js, Nginx, PM2
# Setup reverse proxy
# Configure SSL with Let's Encrypt
```

## 📝 Environment Variables

### Client (.env)
```env
VITE_API_URL=your_api_url
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app_id
```

### Server (.env)
```env
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
ADMIN_EMAILS=admin@example.com
CORS_ORIGINS=https://yourdomain.com
```

## 🔐 Security

- ✅ Environment variables protected
- ✅ Firebase Admin SDK authentication
- ✅ CORS configured
- ✅ Admin-only routes protected
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 📱 Contact Integration

- **WhatsApp:** 7037447309
- **Email:** lokesh25@navgurukul.org

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - See LICENSE file

## 👨‍💻 Author

**Lokesh Dangwal**
- GitHub: [@lokesh123d](https://github.com/lokesh123d)
- Email: lokesh25@navgurukul.org

## 🙏 Acknowledgments

- DK Holidays Dharamshala
- Navgurukul
- Firebase
- React Community

---

**Made with ❤️ for DK Holidays**
