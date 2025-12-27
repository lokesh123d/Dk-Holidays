# Firebase Functions Environment Configuration Guide

## Setting Environment Variables for Cloud Functions

Firebase Functions use a different approach for environment variables. You have two options:

### Option 1: Using Firebase CLI (Recommended for sensitive data)

Run these commands to set your environment variables:

```bash
# Firebase Project Configuration
firebase functions:config:set firebase.project_id="dk-holidays"
firebase functions:config:set firebase.client_email="YOUR_CLIENT_EMAIL"
firebase functions:config:set firebase.private_key="YOUR_PRIVATE_KEY"

# Admin Configuration  
firebase functions:config:set admin.emails="YOUR_ADMIN_EMAILS"

# CORS Configuration
firebase functions:config:set cors.origins="https://dk-holidays.web.app,https://dk-holidays.firebaseapp.com"

# API Keys (if you have any external APIs)
firebase functions:config:set api.flight_key="YOUR_FLIGHT_API_KEY"
```

### Option 2: Using .env file (For local development)

Create `functions/.env` file for local testing:

```env
FIREBASE_PROJECT_ID=dk-holidays
FIREBASE_CLIENT_EMAIL=your-email@dk-holidays.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_EMAILS=your@email.com
CORS_ORIGINS=http://localhost:5173
```

### Option 3: Using Secret Manager (Best for production)

For sensitive data like API keys, use Google Secret Manager:

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secrets
firebase functions:secrets:set FIREBASE_PRIVATE_KEY
# Paste your private key when prompted

firebase functions:secrets:set API_KEYS
# Paste your API keys when prompted
```

## Accessing Environment Variables in Code

In your Cloud Functions code (`functions/index.js` or other files):

### Using functions.config():
```javascript
const functions = require('firebase-functions');

const projectId = functions.config().firebase.project_id;
const adminEmails = functions.config().admin.emails;
```

### Using process.env (if using .env locally):
```javascript
const projectId = process.env.FIREBASE_PROJECT_ID;
```

## View Current Configuration

```bash
firebase functions:config:get
```

## Delete Configuration

```bash
firebase functions:config:unset some.key
```

## Important Notes

1. After setting config, you need to redeploy functions
2. Config changes don't trigger automatic redeployment
3. Secret Manager is recommended for production
4. Never commit .env files to Git
5. Functions config is only available in deployed functions, not in local emulator (use .env for local)
