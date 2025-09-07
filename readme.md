# 🔐 Auth API

**The simplest, most powerful authentication microservice you'll ever use!**

A production-ready, zero-configuration authentication API built with Node.js and Express. Just deploy and start authenticating users in minutes, not hours.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 **Why Auth API?**

### **⚡ Lightning Fast Setup**
```bash
git clone https://github.com/yourusername/auth-api.git
cd auth-api
npm install
npm start
# That's it! Your auth service is running! 🎉
```

### **🛡️ Enterprise-Grade Security**
- **JWT-based authentication** with automatic token refresh
- **bcrypt password hashing** (10 rounds with salt)
- **HttpOnly secure cookies** (XSS protection)
- **Session management** with Redis support
- **OTP email verification** for account creation
- **CORS configured** for cross-origin requests

### **🎯 Dead Simple Integration**
```javascript
// Register a user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'securepassword123',
    accountType: 'email',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    accountType: 'email'
  })
});
```

### **💎 What Makes It Special?**

#### **1. Zero Configuration Required**
- Works out of the box with sensible defaults
- No complex setup or environment variables needed
- Auto-generates secure tokens and sessions

#### **2. Modern Architecture**
- **Microservice ready** - deploy anywhere
- **Stateless design** - scales horizontally
- **Clean separation** - auth logic isolated
- **RESTful API** - follows industry standards

#### **3. Developer Experience**
- **Comprehensive error handling** with helpful messages
- **Automatic token refresh** - no manual intervention
- **Session management** - track user sessions
- **Email verification** - built-in OTP system

#### **4. Production Ready**
- **Health checks** built-in
- **Error logging** with proper HTTP status codes
- **Input validation** and sanitization
- **Rate limiting** ready (easily configurable)

---

## 📋 **Features**

### 🔐 **Core Authentication**
- ✅ **User Registration** with email verification
- ✅ **User Login** with email/password
- ✅ **Secure Logout** with token invalidation
- ✅ **Session Management** with Redis support
- ✅ **Token Refresh** for seamless user experience
- ✅ **Account Deletion** with complete cleanup

### 🛡️ **Security Features**
- ✅ **Password Hashing** with bcrypt (10 rounds)
- ✅ **JWT Tokens** with configurable expiration
- ✅ **HttpOnly Cookies** for XSS protection
- ✅ **Secure Session Storage** with device tracking
- ✅ **OTP Verification** for account creation
- ✅ **Input Validation** and sanitization

### 📧 **Email Integration**
- ✅ **Welcome Emails** for new users
- ✅ **OTP Verification** via email
- ✅ **SendGrid Integration** (configurable)
- ✅ **Customizable Templates**

### 🔧 **Developer Tools**
- ✅ **Health Check Endpoints**
- ✅ **Session Management** (view/delete sessions)
- ✅ **Comprehensive Error Messages**
- ✅ **CORS Configuration**
- ✅ **Environment-based Configuration**

---

## 🧠 **How It Works**

### **High-Level System Overview**

The Auth API is a **stateless microservice** that handles user authentication through a secure, token-based system. Here's how it works:

#### **🔐 Core Authentication Flow**

```mermaid
graph TD
    A[User Registration/Login] --> B[Validate Credentials]
    B --> C[Generate JWT Access Token]
    C --> D[Create Secure Session]
    D --> E[Store in HttpOnly Cookies]
    E --> F[Return Success Response]
    
    G[API Request] --> H[Extract Token from Cookie/Header]
    H --> I[Validate JWT Token]
    I --> J{Token Valid?}
    J -->|Yes| K[Allow Access]
    J -->|No| L[Try Token Refresh]
    L --> M{Refresh Success?}
    M -->|Yes| N[Generate New Token & Allow Access]
    M -->|No| O[Deny Access - Require Login]
```

#### **🛡️ Security Architecture**

1. **Password Security**: All passwords are hashed using bcrypt with 10 salt rounds
2. **Token Management**: JWT access tokens (15min) + refresh tokens (90 days)
3. **Session Storage**: Secure sessions stored in MongoDB with device tracking
4. **Cookie Security**: HttpOnly, Secure, SameSite cookies prevent XSS/CSRF
5. **OTP Verification**: Email-based verification for account creation

#### **📊 Data Flow**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth API      │    │   Database      │
│   Application   │    │   (Node.js)     │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Register/Login     │                       │
         ├──────────────────────►│                       │
         │                       │ 2. Hash Password      │
         │                       ├──────────────────────►│
         │                       │ 3. Store User Data    │
         │                       ├──────────────────────►│
         │                       │ 4. Generate JWT       │
         │                       │                       │
         │ 5. Return Tokens      │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │ 6. Store in Cookies   │                       │
         │                       │                       │
         │ 7. API Requests       │                       │
         ├──────────────────────►│                       │
         │                       │ 8. Validate JWT       │
         │                       │                       │
         │ 9. Allow/Deny Access  │                       │
         │◄──────────────────────┤                       │
```

---

## 📝 **Detailed Examples**

### **🔐 User Registration Flow**

Let's walk through exactly what happens when a user registers:

#### **Step 1: User Sends Registration Request**
```javascript
// Frontend sends this request
const registrationData = {
  email: "john@example.com",
  username: "johndoe", 
  password: "mypassword123",
  accountType: "email",
  firstName: "John",
  lastName: "Doe"
};

fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registrationData)
});
```

#### **Step 2: Server Validates Input**
```javascript
// Auth API validates the data
async registerUser(userData) {
  // 1. Check required fields
  if (!email || !username || !accountType) {
    return { succeeded: false, errorMessage: "Missing required fields" };
  }
  
  // 2. Check if email already exists
  const isEmailTaken = await User.findOne({ email });
  if (isEmailTaken) {
    return { succeeded: false, errorMessage: "Email already registered" };
  }
  
  // 3. Check if username already exists
  const isUsernameTaken = await User.findOne({ username });
  if (isUsernameTaken) {
    return { succeeded: false, errorMessage: "Username already taken" };
  }
}
```

#### **Step 3: Password Hashing**
```javascript
// User model automatically hashes password before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 10, (error, hash) => {
      if (error) return next(error);
      user.password = hash; // Store hashed password
      next();
    });
  } else {
    next();
  }
});
```

#### **Step 4: User Creation & Welcome Email**
```javascript
// Create user in database
const user = await User.create({ ...userData });

// Send welcome email
await sendMorpionAIWelcomeEmail({
  email: user.email,
  username: user.username
});

// Auto-login the user after registration
const loginResult = await this.logUserIn(userData);
```

#### **Step 5: Generate Secure Session**
```javascript
// Create JWT access token (15 minutes)
const accessToken = jwt.sign({
  email: user.email,
  userId: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username
}, process.env.TOKEN_SECRET, { expiresIn: "15m" });

// Create session ID (90 days)
const sessionId = crypto.randomUUID();

// Store session in database
await SecureSession.create({
  sessionId,
  userId: user._id,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
});
```

#### **Step 6: Set Secure Cookies**
```javascript
// Set HttpOnly cookies (XSS protection)
res.cookie("access_token", accessToken, {
  httpOnly: true,    // Can't be accessed by JavaScript
  secure: true,      // Only sent over HTTPS
  sameSite: "None",  // CSRF protection
  path: "/",
  maxAge: 15 * 60 * 1000 // 15 minutes
});

res.cookie("session_id", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "None", 
  path: "/",
  maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
});
```

#### **Step 7: Return Success Response**
```json
{
  "succeeded": true,
  "isLogIn": true,
  "secureSession": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### **🔑 User Login Flow**

Now let's see what happens when a user logs in:

#### **Step 1: User Sends Login Request**
```javascript
const loginData = {
  email: "john@example.com",
  password: "mypassword123", 
  accountType: "email"
};

fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
});
```

#### **Step 2: Server Validates Credentials**
```javascript
async logUserWithEmail(userLoginData) {
  const { email, password } = userLoginData;
  
  // 1. Find user by email
  const userAccount = await User.findOne({ email });
  if (!userAccount) {
    return { isLogIn: false, errorMessage: "No account found with this email" };
  }
  
  // 2. Verify password
  const isSamePassword = await bcrypt.compare(password, userAccount.password);
  if (!isSamePassword) {
    return { isLogIn: false, errorMessage: "Incorrect password" };
  }
  
  // 3. Generate new session
  return this.logUserInUsingJWT({
    email: userAccount.email,
    userId: userAccount._id,
    firstName: userAccount.firstName,
    lastName: userAccount.lastName,
    username: userAccount.username
  });
}
```

#### **Step 3: Generate New Session & Tokens**
```javascript
// Same process as registration - generate JWT and session
const accessToken = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: "15m" });
const sessionId = crypto.randomUUID();

// Store session in database
await SecureSession.create({ sessionId, userId, ... });
```

#### **Step 4: Set Cookies & Return Response**
```javascript
// Set secure cookies and return success
res.cookie("access_token", accessToken, secureConfig);
res.cookie("session_id", sessionId, sessionConfig);
res.json({ isLogIn: true, secureSession: { accessToken, sessionId } });
```

---

### **🔍 Session Validation Flow**

Here's how the API validates user sessions on each request:

#### **Step 1: Extract Token**
```javascript
// Middleware extracts token from cookie or header
const accessToken = req.headers["x-access-token"] || req.cookies?.access_token;
const sessionId = req.headers["x-session-id"] || req.cookies?.session_id;
```

#### **Step 2: Validate Access Token**
```javascript
async getUserFromAccessToken(access_token) {
  try {
    // Verify JWT signature and expiration
    const user = jwt.verify(access_token, process.env.TOKEN_SECRET);
    return user; // Token is valid
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null; // Token is invalid or expired
  }
}
```

#### **Step 3: Try Token Refresh (if access token fails)**
```javascript
async refreshSecureToken(sessionId) {
  // 1. Check if session exists and is valid
  const session = await SecureSession.findOne({ sessionId });
  if (!session || new Date() > new Date(session.expiresAt)) {
    return { isTokenRefresh: false };
  }
  
  // 2. Get user data
  const user = await User.findById(session.userId);
  if (!user) {
    return { isTokenRefresh: false };
  }
  
  // 3. Generate new access token
  const newAccessToken = jwt.sign({
    email: user.email,
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username
  }, process.env.TOKEN_SECRET, { expiresIn: "15m" });
  
  return { isTokenRefresh: true, accessToken: newAccessToken };
}
```

#### **Step 4: Allow or Deny Access**
```javascript
// If token is valid or refresh succeeded
if (user || refreshResult.isTokenRefresh) {
  req.user = user || refreshedUser;
  return next(); // Allow access to protected route
} else {
  return res.status(401).json({ isLogin: false }); // Deny access
}
```

---

### **🛡️ Security Features in Action**

#### **Password Hashing**
```javascript
// Before saving to database
const hashedPassword = await bcrypt.hash("mypassword123", 10);
// Result: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."

// During login verification
const isValid = await bcrypt.compare("mypassword123", hashedPassword);
// Result: true
```

#### **JWT Token Structure**
```javascript
// Access Token Payload
{
  "email": "john@example.com",
  "userId": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe", 
  "username": "johndoe",
  "iat": 1640995200,  // Issued at
  "exp": 1640996100   // Expires at (15 minutes)
}
```

#### **Session Storage**
```javascript
// Session document in MongoDB
{
  "_id": "507f1f77bcf86cd799439012",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-04-01T00:00:00.000Z",
  "device": "Mozilla/5.0...",
  "location": "192.168.1.1"
}
```

---

## 🚀 **Quick Start**

### **1. Clone & Install**
   ```bash
git clone https://github.com/yourusername/auth-api.git
cd auth-api
   npm install
   ```

### **2. Configure Environment**
   ```bash
   cp .env.example .env
# Edit .env with your settings (optional - works with defaults!)
   ```

### **3. Start the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### **4. Test It Works**
```bash
curl http://localhost:5001/health
# Should return: {"status":"OK","service":"Auth API","timestamp":"..."}
```

**That's it! Your auth service is running! 🎉**

---

## 📚 **API Documentation**

### **Base URL**
```
http://localhost:5001
```

### **Authentication Endpoints**

#### **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "accountType": "email",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "succeeded": true,
  "isLogIn": true,
  "secureSession": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sessionId": "uuid-session-id"
  }
}
```

#### **Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "accountType": "email"
}
```

**Response:**
```json
{
  "isLogIn": true,
  "secureSession": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sessionId": "uuid-session-id"
  }
}
```

#### **Check Login Status**
```http
GET /api/auth/check-login
Authorization: Bearer <access-token>
# OR
# Cookies: access_token and session_id
```

**Response:**
```json
{
  "isLogIn": true,
  "user": {
    "email": "user@example.com",
    "userId": "user-id",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### **Logout**
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
# OR
# Cookies: access_token and session_id
```

**Response:**
```json
{
  "message": "Logged out"
}
```

#### **Refresh Token**
```http
POST /api/auth/secure/token/refresh
Authorization: Bearer <access-token>
# OR
# Cookies: session_id
```

**Response:**
```json
{
  "isTokenRefresh": true,
  "accessToken": "new-access-token"
}
```

#### **Delete Account**
```http
POST /api/auth/delete/account
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "succeeded": true
}
```

### **Email Verification Endpoints**

#### **Request Account Creation (OTP)**
```http
POST /api/auth/requestaccountcreation
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "succeeded": true,
  "otpTokenId": "uuid-otp-token-id"
}
```

#### **Validate Email (OTP)**
```http
POST /api/auth/validateuseremail
Content-Type: application/json

{
  "otpTokenId": "uuid-otp-token-id",
  "code": 123456
}
```

**Response:**
```json
{
  "succeeded": true
}
```

### **Session Management**

#### **Get User Sessions**
```http
GET /api/auth/sessions
Authorization: Bearer <access-token>
```

#### **Remove Session**
```http
POST /api/auth/remove/session
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "id": "session-id-to-remove"
}
```

### **Health Check**

#### **Basic Health Check**
```http
GET /
```

**Response:**
```json
{
  "status": "OK",
  "service": "Auth API",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### **Detailed Health Check**
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "service": "Auth API",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB=mongodb://localhost:27017/auth-api

# JWT Configuration
TOKEN_SECRET=your-super-secret-jwt-key-here

# CORS Configuration (optional)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Email Configuration (optional)
SENDGRID_API_KEY=your-sendgrid-api-key

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_ACCESS_SECRET_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### **Default Values**
- **Port**: 5001
- **Database**: MongoDB (local or Atlas)
- **JWT Secret**: Auto-generated if not provided
- **CORS**: Allows all origins by default
- **Session Duration**: 15 minutes (access token), 90 days (session)

---

## 🏗️ **Architecture**

### **Project Structure**
```
auth-api/
├── config/
│   └── index.js              # Centralized configuration
├── models/
│   ├── user.js              # User model with validation
│   └── session.js           # Session model
├── router/
│   └── auth.js              # Authentication routes
├── service/
│   └── auth/
│       ├── authApi.js       # Core authentication logic
│       ├── otpApi.js        # OTP verification
│       └── secureSession.js # Session management
├── checkUserSession/
│   └── checkUserSession.js  # Session validation middleware
├── emails/
│   ├── morpionaiWelcome.js  # Welcome email template
│   ├── newUser.js          # New user email
│   ├── sendCode.js         # OTP email
│   └── welcome.js          # Welcome message
├── redis/
│   └── redisClient.js      # Redis client configuration
├── server.js               # Main server file
└── package.json
```

### **Data Models**

#### **User Model**
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  username: String (required, unique),
  accountType: String (required, default: "email"),
  firstName: String,
  lastName: String
}
```

#### **Session Model**
```javascript
{
  sessionId: String,
  userId: String,
  createdAt: String,
  expiresAt: String,
  device: String,
  location: String
}
```

---

## 🔒 **Security Features**

### **Password Security**
- **bcrypt hashing** with 10 salt rounds
- **Automatic hashing** on password changes
- **No plain text storage** of passwords

### **Token Security**
- **JWT tokens** with configurable expiration
- **Automatic token refresh** mechanism
- **HttpOnly cookies** prevent XSS attacks
- **Secure cookie settings** (SameSite, Secure flags)

### **Session Security**
- **Session tracking** with device information
- **Automatic session cleanup** on logout
- **Session invalidation** on account deletion
- **Concurrent session** management

### **Input Validation**
- **Email format validation**
- **Username uniqueness** checking
- **Required field validation**
- **SQL injection** protection via Mongoose

---

## 🚀 **Deployment**

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

### **Environment Setup**
```bash
# Production environment variables
NODE_ENV=production
PORT=5001
DB=mongodb+srv://username:password@cluster.mongodb.net/auth-api
TOKEN_SECRET=your-production-secret-key
```

### **Cloud Deployment**
- **Heroku**: Ready to deploy with Procfile
- **AWS**: Works with ECS, Lambda, or EC2
- **DigitalOcean**: App Platform compatible
- **Railway**: One-click deployment
- **Render**: Automatic deployments

---

## 🧪 **Testing**

### **Manual Testing**
```bash
# Test health endpoint
curl http://localhost:5001/health

# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123","accountType":"email","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","accountType":"email"}'
```

### **Integration Testing**
```javascript
// Example integration test
const response = await fetch('http://localhost:5001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    accountType: 'email',
    firstName: 'Test',
    lastName: 'User'
  })
});

const data = await response.json();
console.log(data); // Should show successful registration
```

---

## 🤝 **Contributing**

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Setup**
```bash
git clone https://github.com/yourusername/auth-api.git
cd auth-api
npm install
npm run dev
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Express.js** for the amazing web framework
- **MongoDB** for the flexible database
- **JWT** for secure token management
- **bcrypt** for password hashing
- **SendGrid** for email services

---

## 📞 **Support**

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/auth-api/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/auth-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/auth-api/discussions)

---

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ for developers who value simplicity and security.**