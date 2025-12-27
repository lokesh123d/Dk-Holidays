#!/bin/bash

# DK Holidays - Quick Firebase Commands
# Save this file for quick reference

# ============================================
# DEPLOYMENT COMMANDS
# ============================================

# Full deployment (hosting + functions)
firebase deploy

# Deploy only frontend
firebase deploy --only hosting

# Deploy only backend
firebase deploy --only functions

# Deploy with message
firebase deploy -m "Updated car booking feature"

# ============================================
# ENVIRONMENT CONFIGURATION
# ============================================

# Set environment variable
firebase functions:config:set key.name="value"

# Get all environment variables
firebase functions:config:get

# Delete environment variable
firebase functions:config:unset key.name

# Example: Set Firebase credentials
firebase functions:config:set \
  firebase.project_id="dk-holidays" \
  firebase.client_email="YOUR_EMAIL" \
  firebase.private_key="YOUR_KEY"

# ============================================
# LOCAL DEVELOPMENT
# ============================================

# Start emulators (test locally before deploy)
firebase emulators:start

# Start specific emulators
firebase emulators:start --only functions,hosting

# ============================================
# MONITORING & LOGS
# ============================================

# View function logs
firebase functions:log

# View realtime logs
firebase functions:log --only api

# View last 50 entries
firebase functions:log -n 50

# ============================================
# PROJECT MANAGEMENT
# ============================================

# List all Firebase projects
firebase projects:list

# Switch project
firebase use dk-holidays

# List deployed functions
firebase functions:list

# List hosting deployments
firebase hosting:channel:list

# ============================================
# TROUBLESHOOTING
# ============================================

# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools

# Login/re-authenticate
firebase login --reauth

# Test function locally
firebase functions:shell

# ============================================
# BUILD COMMANDS
# ============================================

# Build frontend
cd client && npm run build && cd ..

# Install function dependencies
cd functions && npm install && cd ..

# Full build and deploy
cd client && npm run build && cd .. && firebase deploy

# ============================================
# USEFUL URLS
# ============================================

# Frontend: https://dk-holidays.web.app
# API: https://us-central1-dk-holidays.cloudfunctions.net/api
# Console: https://console.firebase.google.com/project/dk-holidays

echo "Firebase commands loaded! Use these for quick reference."
