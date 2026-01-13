# Quick Reference: Registration → MongoDB Connection

## ✅ Current Status: FULLY CONNECTED

Your registration page is already saving all user details to MongoDB Compass in the `user_details` database.

## 🔍 View Registered Users in MongoDB Compass

### Step 1: Open MongoDB Compass
Launch MongoDB Compass application

### Step 2: Connect
```
Connection String: mongodb://localhost:27017
```

### Step 3: Navigate
```
Database: user_details
Collection: user
```

### Step 4: See Your Data
All registered users are here with:
- Email
- Password (hashed with bcrypt)
- Shop Name
- Owner Name
- Phone, State, City, Pincode, Address
- KYC Document URLs (stored in Cloudinary)
- Registration timestamp

## 📊 What Data is Stored

### User Collection Fields:
```javascript
{
  _id: ObjectId,              // Auto-generated unique ID
  email: String,              // User's email (unique)
  password: String,           // Hashed password (bcrypt)
  shopName: String,           // Shop name
  ownerName: String,          // Owner's name
  phone: String,              // 10-digit phone number
  state: String,              // Selected state
  city: String,               // Selected city/district
  pincode: String,            // 6-digit pincode
  address: String,            // Full address
  kycUrls: {                  // KYC document URLs
    AADHAAR: String,          // Cloudinary URL
    PAN: String,              // Cloudinary URL
    GST: String,              // Cloudinary URL
    TRADE_LICENSE: String     // Optional
  },
  status: "APPROVED",         // Auto-approved
  createdAt: Date            // Registration timestamp
}
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server/index.js` | MongoDB connection setup |
| `server/models/User.js` | User schema and password hashing |
| `server/controllers/authController.js` | Signup/login logic |
| `server/routes/authRoutes.js` | API routes |
| `src/pages/Signup.js` | Registration form |
| `src/api/authApi.js` | Frontend API calls |

## 🚀 API Endpoints

### Signup
```
POST http://localhost:5000/api/auth/signup

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "shopName": "My Shop",
  "ownerName": "John Doe",
  "phone": "1234567890",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "address": "Full address",
  "kycUrls": {
    "AADHAAR": "https://res.cloudinary.com/...",
    "PAN": "https://res.cloudinary.com/...",
    "GST": "https://res.cloudinary.com/..."
  }
}

Response:
{
  "message": "Signup successful",
  "user": { ... },
  "token": "token-...",
  "vendorStatus": "APPROVED"
}
```

### Login
```
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "token-...",
  "vendorStatus": "APPROVED",
  "vendor": { ... }
}
```

## 🧪 Test the Connection

### Run Test Script
```bash
cd server
node testConnection.js
```

This shows:
- Connection status
- Collections in database
- Number of registered users
- Sample user document

### Manual Test
1. Start server: `cd server && npm start`
2. Go to: `http://localhost:3000/vendor/signup`
3. Fill form and submit
4. Open MongoDB Compass
5. Check `user_details` → `user` collection

## 🔐 Security Features

✅ **Password Hashing**: All passwords are hashed with bcrypt (10 rounds)
✅ **Email Unique**: Cannot register twice with same email
✅ **Validation**: Frontend and backend validation
✅ **Secure Storage**: Passwords never stored in plain text

## 📁 Database Connections

Two separate databases:
1. `user_details` - Stores user registration data
2. `vendor_marketplace` - Stores posts/uploads

Configured in `server/index.js`:
```javascript
const userDbConnection = mongoose.createConnection(
    'mongodb://localhost:27017/user_details'
);

const vendorDbConnection = mongoose.createConnection(
    'mongodb://localhost:27017/vendor_marketplace'
);
```

## ✅ Everything Works!

No additional configuration needed. Your registration page is:
- ✅ Connected to MongoDB
- ✅ Saving all user details
- ✅ Hashing passwords securely
- ✅ Uploading KYC to Cloudinary
- ✅ Ready to use

Just register a new user and check MongoDB Compass to see the data!

## 📚 Additional Documentation

For detailed information, see:
- `REGISTRATION_MONGODB_GUIDE.md` - Complete guide with data flow
- `MONGODB_AUTH_IMPLEMENTATION.md` - Implementation details
