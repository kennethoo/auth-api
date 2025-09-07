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