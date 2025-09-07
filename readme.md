# 🔐 Auth API

**A production-ready authentication microservice built with Node.js and Express**

A stateless authentication service that provides JWT-based user authentication, session management, and secure token handling for web applications.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Let's Talk About Authentication

Authentication has always been an important part of any application. But the truth is, it's often hard to understand how to build one that's both secure and simple for your app. On top of that, explaining concepts like sessions, cookies, JWTs, and the whole debate around stateful vs stateless authentication can get confusing.

So today, let's break all of this down in a way that's easy to understand and implement.

## Stateful Authentication

**How it works:**
- In stateful auth, the server is responsible for tracking who is logged in by creating a session in the backend (usually stored in a database).
- When a user logs in, the server creates a unique session ID tied to that user and their device/browser.
- The browser automatically stores this as a cookie.
- Every time the user makes a request, the browser sends the cookie, and the server looks up the session to confirm the user's identity.
- If the session is missing or expired, the server rejects the request and asks the user to log in again.

**Pros:**
- Secure, since the client doesn't manage much.
- Works well for web apps where cookies are built-in.

**Cons:**
- Doesn't work naturally on mobile apps (since they don't automatically handle cookies the same way browsers do).
- Harder to scale because the server has to store and manage sessions.
- Not great when you need authentication across multiple services.

## Stateless Authentication

**How it works:**
- In stateless auth, the client holds the proof of authentication, usually in the form of a JWT (JSON Web Token).
- When a user logs in, the server creates an access token (short-lived, ~10–15 min) and a refresh token (longer-lived, e.g., days).
- The access token contains user details (userId, username, etc.) and is signed with a secret key that only the backend knows.
- The client stores these tokens (in cookies, local storage, or secure storage in a mobile app) and sends the access token in headers for each request.
- Any service with the secret key can verify the token without calling back to the original server.
- When the access token expires, the refresh token is used to request a new one. If the refresh token is missing or expired, the user must log in again.

**Pros:**
- Easier to scale across multiple microservices.
- Works well with mobile apps.
- No need to maintain session state on the server.

**Cons:**
- More responsibility on the client to store tokens securely.
- If not implemented carefully, refresh token handling can introduce vulnerabilities.

## What We'll Cover

For this guide, we'll start simple and focus on stateless authentication. Specifically, we'll walk through:
- Registering a user
- Logging in
- Checking if a user is logged in
- Issuing tokens
- Refreshing tokens
- Deleting tokens (logging out)

---

## What This API Does

This authentication API handles all the boring but important stuff so you don't have to:

**User Management:**
- Register new users with email verification
- Let users log in with email and password
- Log users out securely
- Delete user accounts completely

**Security (The Important Stuff):**
- Passwords are automatically hashed so they're never stored in plain text
- Uses JWT tokens that expire every 15 minutes for security
- Automatically refreshes tokens so users don't get logged out constantly
- Stores tokens in secure cookies that can't be stolen by malicious scripts

**Email Features:**
- Sends welcome emails to new users
- Handles email verification with OTP codes
- Works with SendGrid (but you can use any email service)

**Developer-Friendly:**
- Simple health check endpoints to see if everything's working
- Clear error messages when something goes wrong
- Easy to integrate with any frontend framework

---

## How It Actually Works

Let's break down what happens when someone uses your app:

### When Someone Registers

1. **User fills out a form** with their email, username, and password
2. **Your frontend sends this data** to `/api/auth/register`
3. **The API checks** if the email or username is already taken
4. **If everything looks good**, it:
   - Hashes the password (so it's never stored in plain text)
   - Saves the user to the database
   - Creates a JWT token (like a temporary ID card)
   - Sends the token back in a secure cookie

### When Someone Logs In

1. **User enters their email and password**
2. **Your frontend sends this** to `/api/auth/login`
3. **The API finds the user** by email
4. **It checks if the password matches** (using the hashed version)
5. **If it's correct**, it creates a new JWT token and sends it back

### When Someone Uses Your App

1. **Every time they make a request**, the browser automatically sends the JWT token
2. **Your API checks if the token is valid** and not expired
3. **If it's good**, the request goes through
4. **If it's expired**, the API tries to refresh it automatically
5. **If it can't refresh**, the user needs to log in again

### Why This Is Secure

- **Passwords are hashed**: Even if someone gets your database, they can't see actual passwords
- **Tokens expire quickly**: If someone steals a token, it only works for 15 minutes
- **Automatic refresh**: Users don't get logged out constantly, but tokens stay secure
- **Secure cookies**: Tokens are stored in cookies that malicious scripts can't access

---

## Code Examples

Here's how to actually use this API in your app:

### Register a New User

```javascript
// Send this from your frontend
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    username: 'johndoe',
    password: 'mypassword123',
    accountType: 'email',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const data = await response.json();
// If successful, user is automatically logged in
console.log(data.isLogIn); // true
```

### Log In a User

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'mypassword123',
    accountType: 'email'
  })
});

const data = await response.json();
console.log(data.isLogIn); // true if successful
```

### Check if User is Logged In

```javascript
// This automatically uses the cookies, no need to send anything
const response = await fetch('/api/auth/check-login');
const data = await response.json();

if (data.isLogIn) {
  console.log('User is logged in:', data.user);
} else {
  console.log('User needs to log in');
}
```

### Using Cookies in Headers (Alternative Method)

```javascript
// If you prefer to send tokens in headers instead of cookies
const response = await fetch('/api/auth/check-login', {
  headers: {
    'x-access-token': 'your-jwt-token-here',
    'x-session-id': 'your-session-id-here'
  }
});
```

### Log Out a User

```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST'
});
// User is now logged out
```

### Refresh Token (Happens Automatically)

```javascript
// This usually happens automatically, but you can call it manually if needed
const response = await fetch('/api/auth/secure/token/refresh', {
  method: 'POST'
});

const data = await response.json();
if (data.isTokenRefresh) {
  console.log('Got new token:', data.accessToken);
}
```

### What Happens Behind the Scenes

When you register or log in, the API:

1. **Validates the data** (checks if email/username is taken, password is strong enough)
2. **Hashes the password** using bcrypt (so it's never stored in plain text)
3. **Creates a JWT token** that contains the user's info and expires in 15 minutes
4. **Stores the token in a secure cookie** that your browser automatically sends with every request
5. **Sends back a success response** with the user's info

When you make API requests, the API:

1. **Looks for the JWT token** in cookies (automatic) or headers (`x-access-token`)
2. **Checks if it's valid** and not expired
3. **If it's expired**, tries to refresh it automatically using the session ID
4. **If everything's good**, lets the request through
5. **If not**, asks the user to log in again

---

## Getting Started

### 1. Install and Run

```bash
git clone https://github.com/yourusername/auth-api.git
cd auth-api
npm install
npm start
```

That's it! Your auth service is running on `http://localhost:5001`

### 2. Test It's Working

```bash
curl http://localhost:5001/health
```

You should see: `{"status":"OK","service":"Auth API","timestamp":"..."}`

## API Reference

**Base URL:** `http://localhost:5001`

### Main Endpoints

**Register a user:**
```http
POST /api/auth/register
```
Send: `{ email, username, password, accountType, firstName, lastName }`

**Log in:**
```http
POST /api/auth/login
```
Send: `{ email, password, accountType }`

**Check if logged in:**
```http
GET /api/auth/check-login
```
Returns: `{ isLogIn: true/false, user: {...} }`

*Note: Uses cookies automatically, or send headers:*
```http
x-access-token: your-jwt-token
x-session-id: your-session-id
```

**Log out:**
```http
POST /api/auth/logout
```

**Delete account:**
```http
POST /api/auth/delete/account
```

**Refresh token (automatic):**
```http
POST /api/auth/secure/token/refresh
```
Returns: `{ isTokenRefresh: true, accessToken: "new-token" }`

**Check session middleware:**
The API automatically validates sessions on protected routes using the `checkUserSession` middleware.

### Email Verification (Optional)

**Request verification code:**
```http
POST /api/auth/requestaccountcreation
```
Send: `{ email }`

**Verify with code:**
```http
POST /api/auth/validateuseremail
```
Send: `{ otpTokenId, code }`

### Health Check

```http
GET /health
```
Returns: `{ status: "OK", service: "Auth API", ... }`

---

## Configuration

### Environment Variables (Optional)

You can create a `.env` file to customize settings, but it works with defaults:

```env
# The only one you might want to change
PORT=5001

# Database (works with local MongoDB by default)
DB=mongodb://localhost:27017/auth-api

# JWT secret (auto-generated if not provided)
TOKEN_SECRET=your-secret-key-here

# Email (optional - for sending welcome emails)
SENDGRID_API_KEY=your-sendgrid-key
```

### What's Inside

The code is organized simply:

- **`server.js`** - Main file that starts everything
- **`router/auth.js`** - All the API endpoints
- **`service/auth/`** - The actual authentication logic
- **`checkUserSession/`** - Middleware that validates user sessions
- **`models/`** - Database schemas for users and sessions
- **`emails/`** - Email templates

### Security Features

- **Passwords are hashed** with bcrypt (industry standard)
- **JWT tokens expire** every 15 minutes for security
- **Automatic token refresh** so users don't get logged out
- **Secure cookies** that can't be accessed by malicious scripts
- **Input validation** to prevent bad data

---

## Deploying Your API

### Easy Deployment Options

**Heroku (Recommended):**
1. Connect your GitHub repo to Heroku
2. Add a MongoDB database (MongoDB Atlas works great)
3. Set your environment variables
4. Deploy!

**Other Options:**
- **Railway** - One-click deployment
- **Render** - Automatic deployments
- **DigitalOcean** - App Platform
- **AWS** - ECS or Lambda

### Testing Your API

**Quick test:**
```bash
curl http://localhost:5001/health
```

**Test registration:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123","accountType":"email","firstName":"Test","lastName":"User"}'
```

## That's It!

You now have a complete authentication system that handles:
- User registration and login
- Secure password storage
- JWT token management
- Session handling
- Email verification

**Built with ❤️ for developers who want authentication that just works.**