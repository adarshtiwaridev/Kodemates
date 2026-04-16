# Code Snippets - Copy & Paste Reference

## 🔧 Environment Variables (.env)

**File Location:** `Edutech/Server/.env`

```env
# ============================================
# EMAIL CONFIGURATION (Gmail)
# ============================================
MAIL_USER=your-email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@yourdomain.com

# ============================================
# DATABASE CONFIGURATION  
# ============================================
MONGODB_URL=mongodb://localhost:27017/edutech

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
JWT_SECRET=your-super-secret-key-here-min-32-chars
```

---

## 📡 Frontend API Call (if customizing)

**Location:** `Edutech/src/Pages/Contact.jsx`

Basic fetch to backend:
```javascript
const response = await fetch("http://localhost:5000/api/users/contactus", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: formData.name.trim(),
    email: formData.email.trim(),
    subject: formData.subject.trim(),
    message: formData.message.trim()
  })
});

const data = await response.json();

if (data.success) {
  // Show success
} else {
  // Show error
}
```

---

## ✅ Validation Function (Reference)

**Location:** `Edutech/Server/utlis/validateContact.js`

```javascript
const validateContactForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || !data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }

  // Email validation  
  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email.trim())) {
    errors.email = "Invalid email format";
  }

  // Subject validation
  if (!data.subject || !data.subject.trim()) {
    errors.subject = "Subject is required";
  } else if (data.subject.trim().length < 5) {
    errors.subject = "Subject must be at least 5 characters";
  }

  // Message validation
  if (!data.message || !data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

---

## 🔒 Rate Limiting (Reference)

**Location:** `Edutech/Server/middleware/rateLimit.js`

```javascript
const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const email = req.body.email ? req.body.email.toLowerCase() : "unknown";
  const now = Date.now();

  // Check IP-based rate limit
  const ipKey = `ip:${clientIP}`;
  if (!rateLimitStore.has(ipKey)) {
    rateLimitStore.set(ipKey, []);
  }

  const ipRequests = rateLimitStore.get(ipKey);
  const recentIPRequests = ipRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentIPRequests.length >= MAX_REQUESTS_PER_IP) {
    return res.status(429).json({
      success: false,
      message: "Too many requests from this IP. Please try again later.",
    });
  }

  next();
};
```

---

## 📧 Email Sending (Reference)

**Location:** `Edutech/Server/Controllers/Contactus.js`

```javascript
const sendContactConfirmationEmail = async (toEmail, firstName, subject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  const htmlContent = `
    <div style="font-family: sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <h2>Hi ${firstName},</h2>
        <p>Thank you for reaching out! We've received your message.</p>
        <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        </div>
        <p>Our team will respond within 24-48 hours.</p>
        <p>Best regards,<br>EdTech Platform Team</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "We've Received Your Message ✓",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
```

---

## 🔑 Routes Setup (Reference)

**Location:** `Edutech/Server/routes/User.js`

```javascript
const rateLimit = require("../middleware/rateLimit");
const { createContactus } = require("../Controllers/Contactus");

// Apply rate limiting to contact form
router.post("/contactus", rateLimit, createContactus);
```

---

## 🧪 Testing with cURL

### Test Valid Submission
```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about courses",
    "message": "I would like to know more about your premium courses and pricing."
  }'
```

### Test Invalid Email
```bash
curl -X POST http://localhost:5000/api/users/contactus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "subject": "Test",
    "message": "Test message"
  }'
```

### Test Rate Limiting (6 rapid requests)
```bash
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/users/contactus \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"User $i\",\"email\":\"user$i@example.com\",\"subject\":\"Test\",\"message\":\"Test message that is longer than minimum chars\"}"
  sleep 0.5
done
```

---

## Browser Console Testing

```javascript
// Send request from browser console
fetch('http://localhost:5000/api/users/contactus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with sufficient length for validation.'
  })
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    console.log('✅ Success!', data);
  } else {
    console.log('❌ Error:', data.errors);
  }
})
.catch(err => console.error('Network error:', err))
```

---

## MongoDB Queries

**Connect to MongoDB:**
```bash
mongosh
use edutech
```

**View all messages:**
```javascript
db.contactuses.find().pretty()
```

**View latest 5 messages:**
```javascript
db.contactuses.find().sort({ createdAt: -1 }).limit(5).pretty()
```

**Find message from specific email:**
```javascript
db.contactuses.findOne({ email: "john@example.com" })
```

**Delete a message:**
```javascript
db.contactuses.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
```

**Count total messages:**
```javascript
db.contactuses.countDocuments()
```

---

## Postman API Collection

Import into Postman as JSON:

```json
{
  "info": {
    "name": "Contact Form API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "noauth"
  },
  "item": [
    {
      "name": "Submit Valid Form",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"subject\": \"Inquiry about courses\", \"message\": \"I would like to know more about your premium courses and pricing information.\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/users/contactus",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "users", "contactus"]
        }
      }
    },
    {
      "name": "Submit Invalid Email",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"email\": \"invalid\", \"subject\": \"Test\", \"message\": \"Test message here\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/users/contactus",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "users", "contactus"]
        }
      }
    }
  ]
}
```

---

## Environment Variables Template

Copy this for quick setup:

```env
# Gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@yourdomain.com

# Database
MONGODB_URL=mongodb://localhost:27017/edutech

# Server
PORT=5000
JWT_SECRET=your-min-32-char-secret-key-change-this
```

---

## Debug Logging

Add to `Contactus.js` for debugging:

```javascript
// At start of createContactus function
console.log("📥 Request received:", {
  name: name || "MISSING",
  email: email || "MISSING",
  subject: subject || "MISSING",
  messageLength: message?.length || 0,
});

// After validation
console.log("✅ Validation passed:", validation);

// After sanitization  
console.log("🔒 Sanitized data:", sanitizedData);

// Before saving
console.log("💾 Saving to database...");

// Before sending emails
console.log("📧 Sending confirmation email to:", sanitizedData.email);
console.log("📧 Sending admin notification to:", adminEmail);

// On success
console.log("✨ Complete! Message ID:", newMessage._id);
```

---

## File Checklist

Verify these files exist:

```bash
# Frontend
ls Edutech/src/Pages/Contact.jsx

# Backend
ls Edutech/Server/Controllers/Contactus.js
ls Edutech/Server/utlis/validateContact.js
ls Edutech/Server/middleware/rateLimit.js
ls Edutech/Server/routes/User.js

# Documentation
ls CONTACT_FORM_DOCUMENTATION.md
ls ENVIRONMENT_SETUP.md
ls TESTING_GUIDE.md
ls IMPLEMENTATION_SUMMARY.md
ls QUICK_START.md
```

---

## Quick Commands

```bash
# Start backend
cd Edutech/Server && npm run dev

# Start frontend (new terminal)
cd Edutech && npm run dev

# Test API (new terminal)
curl http://localhost:5000/api/users/contactus -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message longer than minimum"}'

# Connect to MongoDB (new terminal)
mongosh
use edutech
db.contactuses.find()

# Stop servers
# Press Ctrl+C in each terminal
```

---

**Ready to test? Start the servers and check QUICK_START.md! 🚀**
