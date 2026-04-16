# Environment Setup Guide

## 📝 Required Environment Variables

Create a `.env` file in `Edutech/Server/` directory with these variables:

```env
# ============================================
# EMAIL CONFIGURATION (Gmail)
# ============================================

# Your Gmail address
MAIL_USER=your-email@gmail.com

# Gmail App-Specific Password (NOT your regular password)
# How to get it:
# 1. Enable 2-Factor Authentication on Google Account
# 2. Go to https://myaccount.google.com/apppasswords
# 3. Select "Mail" and "Windows Computer"
# 4. Copy the 16-character password
MAIL_PASS=xxxx xxxx xxxx xxxx

# Optional: Admin email where inquiries are sent
# If not specified, it defaults to MAIL_USER
ADMIN_EMAIL=admin@yourdomain.com

# ============================================
# DATABASE CONFIGURATION
# ============================================

# MongoDB Connection String (should already be set)
MONGODB_URL=mongodb://localhost:27017/edutech
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/edutech

# ============================================
# SERVER CONFIGURATION
# ============================================

# Port where backend runs
PORT=5000

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key

# ============================================
# FUTURE CLOUDINARY CONFIG (Already set)
# ============================================

CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## ✅ Verification Checklist

After setting up .env:

- [ ] MAIL_USER is a valid Gmail address
- [ ] MAIL_PASS is a 16-character App Password (not your regular password)
- [ ] 2-Factor Authentication is enabled on Gmail account
- [ ] MongoDB connection string is correct
- [ ] PORT is set (default: 5000)
- [ ] All values are correct (no extra spaces)

## 🛠️ Setup Steps

### Step 1: Gmail Setup

1. Go to your Google Account: https://myaccount.google.com
2. Click on "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" (appears only after 2FA is enabled)
5. Select "Mail" and "Windows Computer"
6. Google will show a 16-character password
7. Copy it to `MAIL_PASS` in your .env file

### Step 2: Create .env File

```bash
# Navigate to Server directory
cd Edutech/Server

# Create .env file (choose based on your OS)

# On Linux/Mac:
touch .env

# On Windows (PowerShell):
New-Item -Name ".env" -ItemType File

# OR just create it manually using your text editor
```

### Step 3: Add Environment Variables

Copy the settings from above into your .env file.

### Step 4: Verify Backend Loads .env

The backend loads .env using `dotenv` package. Make sure in `index.js`:

```javascript
const dotenv = require("dotenv");
dotenv.config(); // This line loads the .env file
```

### Step 5: Restart Backend

```bash
# Terminal 1: Stop the server if running
# Press Ctrl+C

# Terminal 1: Start the server
cd Edutech/Server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Database connected
```

## 💡 Testing Email Configuration

### Test 1: Check .env is loaded

Add this to `Edutech/Server/index.js` (temporarily):

```javascript
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);
```

Restart server - you should see email config logged.

### Test 2: Test Email Sending

Use this cURL command to test:

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "subject": "Test from contact form",
    "message": "This is a test message to verify email is working correctly."
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Message sent successfully! We'll be in touch soon.",
  "data": {
    "id": "...",
    "email": "your-test-email@gmail.com",
    "createdAt": "2024-04-13T..."
  }
}
```

### Test 3: Check Email Inbox

- Go to your MAIL_USER inbox
- Look for an email from "EdTech Platform"
- Subject: "We've Received Your Message ✓"
- If not found, check spam folder

## ⚠️ Common Issues & Fixes

### Issue: "Invalid login credentials"

**Cause:** Using regular Gmail password instead of App Password

**Fix:**
1. Delete current MAIL_PASS from .env
2. Follow Gmail Setup steps above
3. Use only App Password (16 characters)
4. Restart backend

### Issue: App Passwords option not showing

**Cause:** 2-Factor Authentication not enabled

**Fix:**
1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Set up 2-step verification"
4. Follow Google's instructions
5. After enabling, App passwords will appear

### Issue: "Cannot find module 'dotenv'"

**Cause:** Package not installed

**Fix:**
```bash
cd Edutech/Server
npm install dotenv
```

### Issue: .env file is not loading

**Cause:** File not in correct location

**Fix:**
- .env should be in `Edutech/Server/.env` (not in parent directory)
- Make sure file is named exactly `.env` (with the dot)
- No spaces or extension

### Issue: Backend starts but emails don't send

**Cause:** Possible network or Gmail issue

**Fix:**
1. Check MAIL_USER and MAIL_PASS are exactly correct
2. Try sending from your Gmail account directly to test it works
3. Check your Gmail's "Less secure app access" (if not using App Password)
4. Check logs in terminal for specific error

## 📋 .env Template

Copy and paste this template:

```env
# Gmail Configuration
MAIL_USER=your-email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@yourdomain.com

# Database
MONGODB_URL=mongodb://localhost:27017/edutech

# Server
PORT=5000
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (if using image upload)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 Final Verification

Run this to verify everything is set up:

```bash
cd Edutech/Server

# Check if .env file exists
ls -la .env  # Linux/Mac
dir .env    # Windows

# Start the server
npm run dev

# In another terminal, test the endpoint
curl http://localhost:5000/api/users/contactus -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message here"}'
```

✅ All set! Your contact form is now ready to use.
