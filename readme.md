# MorpionAi Auth API 🔐

**Authentication and user management service for the MorpionAi gaming platform**

A dedicated authentication service built with Node.js and Express that handles user registration, login, profile management, and session handling for the MorpionAi gaming platform.

## 🚀 Features

### 🔐 Authentication
- **JWT-based authentication** with secure token handling
- **Password hashing** with bcryptjs
- **Session management** with Redis
- **Token refresh** mechanism
- **Secure logout** with token invalidation

### 👤 User Management
- **User registration** with validation
- **Profile management** with comprehensive user data
- **Password reset** functionality
- **Email verification** (optional)
- **Account deletion** with data cleanup

### 🔒 Security Features
- **Input validation** and sanitization
- **Rate limiting** for authentication endpoints
- **CORS configuration** for cross-origin requests
- **Error handling** with user-friendly messages
- **Request logging** and monitoring

### 📧 Email Services
- **Welcome emails** for new users
- **Password reset emails** with secure tokens
- **Email verification** for account activation
- **Customizable email templates**

## 🛠 Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for session management
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Nodemailer** for email services

## 📁 Project Structure

```
auth-api/
├── service/                   # Business logic services
│   ├── auth/
│   │   ├── authApi.js        # Authentication logic
│   │   ├── otpApi.js         # OTP verification
│   │   └── secureSession.js  # Session management
│   └── userProfileService.js # User profile management
├── models/                    # Database models
│   ├── customer.js           # User model
│   ├── conversation.js       # Chat model
│   └── follower.js           # Social model
├── router/                    # API routes
│   ├── auth.js               # Authentication endpoints
│   └── userProfileResource.js # User profile endpoints
├── emails/                    # Email templates
│   ├── newUser.js            # Welcome email
│   ├── sendCode.js           # OTP email
│   └── welcome.js            # Welcome message
├── config/                    # Configuration files
├── server.js                  # Main server entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Redis (optional, for session management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MorpionAi.git
   cd MorpionAi/auth-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔌 API Endpoints

### Authentication

#### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt-token>
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <jwt-token>
```

#### Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "newpassword123"
}
```

### User Profile

#### Get Profile
```http
GET /api/userprofile/:userId
Authorization: Bearer <jwt-token>
```

#### Update Profile
```http
PUT /api/userprofile/:userId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith",
  "bio": "Gaming enthusiast"
}
```

#### Delete Account
```http
DELETE /api/userprofile/:userId
Authorization: Bearer <jwt-token>
```

## 📊 Database Models

### Customer Model
```javascript
{
  userId: String,
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String, // hashed
  profileImage: String,
  bio: String,
  level: Number,
  wins: Number,
  losses: Number,
  draws: Number,
  totalGames: Number,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Model
```javascript
{
  conversationId: String,
  participants: [String], // user IDs
  messages: [{
    messageId: String,
    senderId: String,
    content: String,
    timestamp: Date,
    isRead: Boolean
  }],
  lastMessage: {
    content: String,
    timestamp: Date,
    senderId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Follower Model
```javascript
{
  followerId: String,
  followerUserId: String,
  followingUserId: String,
  createdAt: Date
}
```

## 🔐 Security Implementation

### JWT Authentication
- **Token generation** with user data payload
- **Token validation** with secret key
- **Token refresh** mechanism for extended sessions
- **Token blacklisting** for secure logout

### Password Security
- **bcryptjs hashing** with salt rounds
- **Password strength validation**
- **Secure password reset** with time-limited tokens
- **Password history** tracking

### Input Validation
- **Express Validator** for request validation
- **Email format validation**
- **Username uniqueness** checking
- **Password strength** requirements

### Error Handling
- **Centralized error handling** middleware
- **User-friendly error messages**
- **Proper HTTP status codes**
- **Error logging** for debugging

## 📧 Email Services

### Email Templates
- **Welcome emails** for new user registration
- **Password reset emails** with secure tokens
- **Email verification** for account activation
- **Customizable templates** with user data

### Email Configuration
```javascript
// Email service configuration
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};
```

## 🚀 Performance Optimization

### Database Optimization
- **Indexed queries** for fast user lookups
- **Connection pooling** for efficient database usage
- **Query optimization** with proper aggregation
- **Caching** with Redis for session data

### Session Management
- **Redis-based sessions** for scalability
- **Session cleanup** for expired tokens
- **Concurrent session** handling
- **Session invalidation** on logout

### Rate Limiting
- **Authentication endpoint** rate limiting
- **Password reset** request throttling
- **Login attempt** limiting
- **API request** throttling

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "AuthService"
```

### Test Structure
- **Unit tests** for service functions
- **Integration tests** for API endpoints
- **Authentication tests** for security
- **Email service tests** for notifications

## 📊 Monitoring & Logging

### Logging System
- **Structured logging** with timestamps
- **Error tracking** with stack traces
- **Authentication events** logging
- **User activity** tracking

### Health Checks
```http
GET /health              # Basic health check
GET /health/detailed     # Detailed system status
GET /health/database     # Database connectivity
GET /health/redis        # Redis connectivity
```

## 🚀 Deployment

### Environment Variables
```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/morpionai-auth
MONGODB_URI_PROD=mongodb+srv://...

# Redis
REDIS_URL=redis://localhost:6379
REDIS_URL_PROD=redis://...

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_PROD=https://yourdomain.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm start

# Using PM2
pm2 start ecosystem.config.js
```

## 🔧 Development

### Code Style
- **ESLint** for code linting
- **Prettier** for code formatting
- **JSDoc** for documentation
- **Consistent naming** conventions

### API Documentation
- **OpenAPI/Swagger** specification
- **Endpoint documentation** with examples
- **Request/response schemas**
- **Error code documentation**

### Error Message Standards
All error messages are user-friendly and informative:

```javascript
// Good error messages
{
  "error": "Invalid email format",
  "message": "Please enter a valid email address",
  "field": "email"
}

// Bad error messages
{
  "error": "Validation failed",
  "message": "Invalid input"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by the MorpionAi Team**
