#!/bin/bash

# DK Holidays - Full Firebase Deployment Script
# This script deploys both frontend and backend to Firebase

set -e  # Exit on error

echo "🚀 DK Holidays - Firebase Full Deployment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Firebase CLI
echo -e "${BLUE}📋 Step 1: Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
else
    echo -e "${GREEN}✅ Firebase CLI found: $(firebase --version)${NC}"
fi

# Step 2: Login to Firebase (if needed)
echo -e "${BLUE}📋 Step 2: Checking Firebase authentication...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in. Please login to Firebase...${NC}"
    firebase login
fi
echo -e "${GREEN}✅ Logged in to Firebase${NC}"

# Step 3: Install Functions Dependencies
echo -e "${BLUE}📋 Step 3: Installing Functions dependencies...${NC}"
cd functions
npm install
cd ..
echo -e "${GREEN}✅ Functions dependencies installed${NC}"

# Step 4: Build Frontend
echo -e "${BLUE}📋 Step 4: Building frontend...${NC}"
cd client
npm install
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Step 5: Deploy to Firebase
echo -e "${BLUE}📋 Step 5: Deploying to Firebase...${NC}"
echo -e "${YELLOW}⚠️  This will deploy both hosting and functions${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    firebase deploy
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    
    # Step 6: Show URLs
    echo ""
    echo -e "${GREEN}=========================================="
    echo -e "🎉 DEPLOYMENT SUCCESSFUL!"
    echo -e "==========================================${NC}"
    echo ""
    echo -e "${BLUE}Frontend URL:${NC} https://dk-holidays.web.app"
    echo -e "${BLUE}API URL:${NC} https://us-central1-dk-holidays.cloudfunctions.net/api"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Test your application at https://dk-holidays.web.app"
    echo "2. Set environment variables if not already done:"
    echo "   firebase functions:config:set firebase.project_id=\"dk-holidays\""
    echo "3. Check function logs: firebase functions:log"
    echo ""
else
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi
