# DK Holidays Server - Express.js + Firebase

Backend API server for DK Holidays car rental application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get Firebase Admin SDK key:
   - Go to Firebase Console
   - Project Settings > Service Accounts
   - Generate New Private Key
   - Save as `config/serviceAccountKey.json`

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

## API Endpoints

See main README.md for complete API documentation.

## Environment Variables

Create a `.env` file with:
```
PORT=5000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_KEY=./config/serviceAccountKey.json
```

## Firebase Collections

- `cars` - Car inventory
- `bookings` - Customer bookings  
- `contacts` - Contact form submissions
- `newsletter` - Newsletter subscribers
