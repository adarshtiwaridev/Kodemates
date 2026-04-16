# Contact Us Form - Complete Integration Guide

## 📋 Overview

This is a **production-ready** Contact Us system with:
- ✅ Full frontend validation (React)
- ✅ Backend validation & sanitization (Express)
- ✅ Email integration (Nodemailer)
- ✅ Database storage (MongoDB)
- ✅ Rate limiting (spam protection)
- ✅ Error handling & logging
- ✅ Beautiful UI with Tailwind CSS

---

## 🚀 Setup Instructions

### 1️⃣ **Environment Variables** (.env file)

Add these to your `.env` file in the Server directory:

```env
# Email Configuration (Gmail)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password  # NOT your regular password - use App Password

# Admin Email (where contact messages are sent)
ADMIN_EMAIL=admin@yourdomain.com

# Optional: Admin notification email
# ADMIN_EMAIL=admin@example.com
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Use that password in `MAIL_PASS`

### 2️⃣ **Install Dependencies**

Both frontend and backend already have dependencies. Verify:

```bash
# Backend
cd Edutech/Server
npm install nodemailer mongoose express

# Frontend
cd Edutech
npm install
```

### 3️⃣ **Database Model** (Already created)

Models location: `Edutech/Server/Models/Contactus.js`

Stores:
- firstName
- lastName
- email
- subject
- message
- createdAt (automatic)

### 4️⃣ **File Structure**

```
Edutech/
├── Server/
│   ├── Controllers/
│   │   └── Contactus.js          ✅ Enhanced with validation & email
│   ├── Models/
│   │   └── Contactus.js          ✅ Existing MongoDB schema
│   ├── middleware/
│   │   ├── Auth.js               (existing)
│   │   └── rateLimit.js          ✅ NEW - Spam protection
│   ├── routes/
│   │   └── User.js               ✅ Updated with rate limiting
│   └── utlis/
│       └── validateContact.js    ✅ NEW - Validation utilities
│
└── src/
    └── Pages/
        └── Contact.jsx           ✅ Enhanced with full validation & error handling
```

---

## 📡 API Endpoint

### **POST /api/users/contactus**

**Rate Limiting:** 
- Max 5 requests per IP per hour
- Max 3 requests per email per hour

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about courses",
  "message": "I would like to know more about your premium courses."
}
```

**Validation Rules:**
- `name`: 2-100 characters (required)
- `email`: Valid email format (required)
- `subject`: 5-200 characters (required)
- `message`: 10-5000 characters (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully! We'll be in touch soon.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "createdAt": "2024-04-13T10:30:00Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "message": "Message must be at least 10 characters"
  }
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "message": "Too many requests from this IP. Please try again later."
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "An error occurred while processing your request. Please try again later."
}
```

---

## 🎨 Frontend Features

### Contact.jsx Component

**Features:**
- ✅ Real-time validation with error messages
- ✅ Email format validation
- ✅ Loading state with spinner
- ✅ Success/Error toast notifications
- ✅ Disabled submit button during loading
- ✅ Clears form on success
- ✅ Dark mode support
- ✅ Smooth animations with Framer Motion
- ✅ Responsive design

**Usage:**
```jsx
import Contact from './Pages/Contact';

export default function App() {
  return <Contact />;
}
```

---

## 🔐 Backend Features

### Validation (`validateContact.js`)

```javascript
const { validateContactForm, sanitizeContactData } = require("../utlis/validateContact");

// Validate
const validation = validateContactForm({ name, email, subject, message });

// Sanitize
const safe = sanitizeContactData(userInput);
```

### Rate Limiting (`rateLimit.js`)

Middleware that:
- Limits by IP address
- Limits by email address
- Auto-cleanup of old entries
- In-memory storage (for production use Redis)

### Email Integration (`Contactus.js`)

Two emails sent:
1. **User Confirmation** - Shows they sent the message
2. **Admin Notification** - Alerts you about new inquiry

```javascript
await sendContactConfirmationEmail(email, firstName, subject);
await sendAdminNotificationEmail(sanitizedData, firstName);
```

---

## ✅ Testing the Integration

### 1. **Frontend Test**

Go to http://localhost:5173/contact (or your frontend URL)

Try these scenarios:
1. ✅ Submit valid form
2. ❌ Leave fields empty
3. ❌ Invalid email
4. ❌ Submit 4 times rapidly (rate limiting)
5. ✅ Check loading state
6. ✅ Check error messages

### 2. **Backend Test** (Using cURL or Postman)

```bash
# Valid submission
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test inquiry",
    "message": "This is a test message to verify the system works correctly."
  }'

# Invalid email (should fail)
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "subject": "Test",
    "message": "Test message"
  }'

# Empty fields (should fail)
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "",
    "subject": "",
    "message": ""
  }'
```

### 3. **Database Check**

```bash
# Connect to MongoDB and check stored messages
db.contactuses.find().sort({ createdAt: -1 }).limit(5)
```

### 4. **Email Check**

- Check your email for confirmation message
- Check ADMIN_EMAIL for notification
- Check spam folder if not received

---

## 📊 Monitoring & Admin Features

### Get All Messages

```bash
GET /api/users/contactus
Response: All messages sorted by date (max 100)
```

### Delete a Message

```bash
DELETE /api/users/contactus/:id
```

---

## 🔧 Customization

### Change Rate Limits

Edit `Edutech/Server/middleware/rateLimit.js`:

```javascript
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5;            // Max 5 per IP
const MAX_REQUESTS_PER_EMAIL = 3;         // Max 3 per email
```

### Change Email Template

Edit `Edutech/Server/Controllers/Contactus.js` function `sendContactConfirmationEmail()`

### Customize Frontend

Edit `Edutech/src/Pages/Contact.jsx`:
- Change placeholder texts
- Modify validation messages
- Adjust styling
- Add more form fields

---

## 🐛 Troubleshooting

### ❌ Emails Not Sending

**Error:** `Invalid login credentials`

**Solution:**
1. Use App Password, NOT your Google password
2. Enable 2-Factor Authentication
3. Check MAIL_USER is correct
4. Check MAIL_PASS is exactly 16 characters

### ❌ CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Check that frontend URL is in CORS whitelist in `index.js`:
```javascript
cors({
  origin: [
    "http://localhost:5173",    // Vite frontend
    "http://localhost:3000",    // Other frontend
  ],
  credentials: true,
})
```

### ❌ Validation Always Fails

**Solution:** Check that `validateContact.js` is in the correct path:
`Edutech/Server/utlis/validateContact.js`

### ❌ Database Error

**Error:** `Cannot connect to MongoDB`

**Solution:**
1. Check MongoDB connection string in `config/database.js`
2. Ensure MongoDB is running
3. Check network connectivity

---

## 🚀 Production Deployment

### Before Deploy:

1. ✅ Change frontend API URL from `localhost:5000` to production URL
2. ✅ Change MAIL credentials to production email
3. ✅ Update ADMIN_EMAIL to your email
4. ✅ Use environment-specific .env files
5. ✅ Enable HTTPS on production
6. ✅ Replace in-memory rate limiter with Redis
7. ✅ Add database backups
8. ✅ Enable logging/monitoring

### Update Frontend Contact.jsx:

Find this line:
```javascript
const response = await fetch("http://localhost:5000/api/users/contactus", {
```

Change to:
```javascript
const response = await fetch("https://your-production-api.com/api/users/contactus", {
```

### For Redis Rate Limiting (Production):

Replace `rateLimit.js` implementation with Redis library for distributed rate limiting across multiple servers.

---

## 📝 API Response Codes Summary

| Code | Meaning | 
|------|---------|
| 201 | Successfully created contact message |
| 400 | Validation failed |
| 429 | Too many requests (rate limited) |
| 500 | Server error |

---

## 🎯 Features Summary

### Frontend ✅
- [x] Client-side validation
- [x] Email format validation
- [x] Loading states
- [x] Error messages
- [x] Success notifications
- [x] Disabled button during submission
- [x] Form reset on success
- [x] Dark mode support
- [x] Responsive design
- [x] XSS protection

### Backend ✅
- [x] Server-side validation
- [x] Input sanitization
- [x] XSS prevention
- [x] Email validation
- [x] Length validation
- [x] Database persistence
- [x] User confirmation email
- [x] Admin notification email
- [x] Rate limiting
- [x] Error handling & logging
- [x] Proper HTTP status codes

### Database ✅
- [x] MongoDB integration
- [x] Data persistence
- [x] Timestamps
- [x] Query capabilities
- [x] Delete functionality

---

## 📞 Support

For issues or questions:
1. Check logs in browser console (frontend errors)
2. Check server logs in terminal (backend errors)
3. Check MongoDB for data
4. Check email spam folder
5. Verify .env variables are set

---

**Status:** ✅ Production-Ready
**Last Updated:** April 13, 2024
