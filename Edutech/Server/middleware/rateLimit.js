// Rate limiting middleware for contact form
// In-memory rate limiter (use Redis for production)

const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Max 5 requests per IP per hour
const MAX_REQUESTS_PER_EMAIL = 3; // Max 3 submissions per email per hour

const rateLimit = (req, res, next) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const email = req.body.email ? req.body.email.toLowerCase() : "unknown";
    
    const now = Date.now();

    // Check IP-based rate limit
    const ipKey = `ip:${clientIP}`;
    if (!rateLimitStore.has(ipKey)) {
      rateLimitStore.set(ipKey, []);
    }

    const ipRequests = rateLimitStore.get(ipKey);
    const recentIPRequests = ipRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentIPRequests.length >= MAX_REQUESTS_PER_IP) {
      return res.status(429).json({
        success: false,
        message: "Too many requests from this IP. Please try again later.",
      });
    }

    // Check email-based rate limit
    const emailKey = `email:${email}`;
    if (!rateLimitStore.has(emailKey)) {
      rateLimitStore.set(emailKey, []);
    }

    const emailRequests = rateLimitStore.get(emailKey);
    const recentEmailRequests = emailRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentEmailRequests.length >= MAX_REQUESTS_PER_EMAIL) {
      return res.status(429).json({
        success: false,
        message: "Too many requests from this email. Please try again later.",
      });
    }

    // Record this request
    recentIPRequests.push(now);
    rateLimitStore.set(ipKey, recentIPRequests);

    recentEmailRequests.push(now);
    rateLimitStore.set(emailKey, recentEmailRequests);

    next();
  } catch (error) {
    console.error("Rate limit middleware error:", error);
    next(); // Continue even if rate limit fails
  }
};

// Cleanup old entries periodically (runs every 30 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recentTimestamps = timestamps.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
    if (recentTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recentTimestamps);
    }
  }
}, 30 * 60 * 1000);

module.exports = rateLimit;
