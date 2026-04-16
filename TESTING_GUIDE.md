# Contact Form - Quick Test & Verification Guide

## 🧪 Frontend Testing

### Test 1: Valid Submission

1. Navigate to http://localhost:5173/contact
2. Fill form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Subject: "Inquiry about courses"
   - Message: "I would like to learn more about your premium courses."
3. Click "Dispatch Message"
4. Expected: Success message appears, form clears

### Test 2: Validation - Empty Fields

1. Click submit without filling any field
2. Expected: Show errors on all 4 fields

### Test 3: Validation - Invalid Email

1. Fill all fields
2. Email: "invalid-email" (without @)
3. Click submit
4. Expected: Red border on email field, error message: "Invalid email format"

### Test 4: Validation - Short Message

1. Fill all fields
2. Message: "Too short" (less than 10 chars)
3. Click submit
4. Expected: Error message: "Message must be at least 10 characters"

### Test 5: Validation - Short Subject

1. Fill all fields
2. Subject: "Hi" (less than 5 chars)
3. Click submit
4. Expected: Error message: "Subject must be at least 5 characters"

### Test 6: Loading State

1. Fill form with valid data
2. Watch the submit button: 
   - Changes to "Sending..." with spinner
   - Button is disabled
   - Cannot click again

### Test 7: Error Handling - Offline

1. Disconnect internet or stop backend server
2. Fill form and submit
3. Expected: "Network error. Please check your connection and try again."

### Test 8: Dark Mode

1. Check if your site has dark mode toggle
2. Switch to dark mode
3. Fill and submit form
4. Expected: Works correctly in dark mode

## 🔌 Backend Testing (Using cURL/Postman)

### Test 1: Valid Submission

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about courses",
    "message": "I would like to learn more about your premium courses. Please contact me ASAP."
  }'
```

Expected Response (201):
```json
{
  "success": true,
  "message": "Message sent successfully! We'll be in touch soon.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "createdAt": "2024-04-13T10:30:00.000Z"
  }
}
```

### Test 2: Missing Fields

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John"
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "subject": "Subject is required",
    "message": "Message is required"
  }
}
```

### Test 3: Invalid Email Format

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid.email",
    "subject": "Test inquiry",
    "message": "This is a test message that is longer than 10 characters."
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### Test 4: Text Too Short

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J",
    "email": "john@example.com",
    "subject": "Hi",
    "message": "Short"
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name must be at least 2 characters",
    "subject": "Subject must be at least 5 characters",
    "message": "Message must be at least 10 characters"
  }
}
```

### Test 5: Rate Limiting (5 requests from same IP per hour)

Send this command 6 times quickly:

```bash
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/users/contactus \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"User $i\",\"email\":\"user$i@example.com\",\"subject\":\"Test\",\"message\":\"Test message $i that is longer than minimum\"}"
  echo ""
done
```

Expected: 6th request returns (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP. Please try again later."
}
```

### Test 6: Sanitization (XSS Prevention)

```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John<script>alert(1)</script>",
    "email": "john@example.com",
    "subject": "Test<javascript:alert(1)>",
    "message": "Test message with <script> tags that should be removed by sanitizer."
  }'
```

Expected: Successfully saved, dangerous tags removed

## 📧 Email Testing

### Check User Confirmation Email

1. After submitting form, check your email inbox
2. Look for email from "EdTech Platform"
3. Subject: "We've Received Your Message ✓"
4. Verify it contains:
   - Your name
   - Your subject line
   - Reference ID

### Check Admin Notification Email

1. Check ADMIN_EMAIL inbox (from .env)
2. Look for email
3. Subject: "[NEW INQUIRY] Your subject line"
4. Verify it contains:
   - User's name
   - User's email
   - User's message

## 🗄️ Database Testing

### Connect to MongoDB

```bash
# Using MongoDB CLI
mongosh

# Or MongoDB Compass (GUI tool)
# - Create connection to localhost:27017
```

### Query Messages

```javascript
// Connect to edutech database
use edutech

// Find all messages
db.contactuses.find()

// Find messages with pretty formatting
db.contactuses.find().pretty()

// Find last 5 messages (newest first)
db.contactuses.find().sort({ createdAt: -1 }).limit(5)

// Find messages from specific email
db.contactuses.findOne({ email: "john@example.com" })

// Count total messages
db.contactuses.countDocuments()

// Delete a specific message
db.contactuses.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

## 📊 Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "Contact Form API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Contact Form - Valid",
      "request": {
        "method": "POST",
        "header": ["{ \"key\": \"Content-Type\", \"value\": \"application/json\" }"],
        "body": {
          "raw": "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"subject\": \"Test inquiry\", \"message\": \"This is a test message to verify the system works correctly.\"}"
        },
        "url": "http://localhost:5000/api/users/contactus"
      }
    },
    {
      "name": "Submit Contact Form - Invalid Email",
      "request": {
        "method": "POST",
        "header": ["{ \"key\": \"Content-Type\", \"value\": \"application/json\" }"],
        "body": {
          "raw": "{\"name\": \"John Doe\", \"email\": \"invalid\", \"subject\": \"Test\", \"message\": \"Test message\"}"
        },
        "url": "http://localhost:5000/api/users/contactus"
      }
    }
  ]
}
```

## ✅ Checklist - Before Production

- [ ] Frontend form loads without errors
- [ ] All validation messages display correctly
- [ ] Loading state works (button disabled, spinner shows)
- [ ] Valid form submission succeeds
- [ ] Success message appears for 5 seconds
- [ ] Form clears after success
- [ ] User receives confirmation email
- [ ] Admin receives notification email
- [ ] Data is saved in MongoDB
- [ ] Rate limiting works (blocks 6th request)
- [ ] Emails blocked after rate count
- [ ] Invalid inputs are rejected
- [ ] Error messages are user-friendly
- [ ] Works in dark mode
- [ ] Responsive on mobile
- [ ] XSS prevention working
- [ ] Environment variables loaded correctly

## 🐛 Debug Mode

Add to `Edutech/Server/Controllers/Contactus.js`:

```javascript
// At the top of createContactus function
console.log("📥 Incoming request:", { name, email, subject });
console.log("✅ Validation result:", validation);
console.log("🔒 Sanitized data:", sanitizedData);
console.log("💾 Saving to DB...");
console.log("📧 Sending email to:", sanitizedData.email);
```

## 📱 Browser Console Testing

Open DevTools (F12) → Console tab:

```javascript
// Test API directly from browser console
fetch('http://localhost:5000/api/users/contactus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message that is longer than minimum characters needed.'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd Edutech/Server
npm run dev

# Terminal 2: Start Frontend
cd Edutech
npm run dev

# Terminal 3: Run tests
curl http://localhost:5000/api/users/contactus -X POST -H "Content-Type: application/json" -d '...'

# Terminal 4: Monitor MongoDB
mongosh
use edutech
db.contactuses.find()
```

---

**Need help?** Check the logs in terminal and browser console first. Most issues will be obvious there.
