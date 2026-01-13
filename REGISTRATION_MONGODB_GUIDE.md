# Registration to MongoDB Connection Guide

## 🎯 Overview

Your registration page is **fully connected** to MongoDB Compass. When users register, their details are automatically saved to the `user_details` database.

## 📊 Database Configuration

### Connection Details
- **Database Name**: `user_details`
- **Connection String**: `mongodb://localhost:27017/user_details`
- **Collection Name**: `user` (automatically created)

### Location in Code
The connection is established in `server/index.js`:
```javascript
const userDbConnection = mongoose.createConnection(
    process.env.USER_DB_URI || 'mongodb://localhost:27017/user_details'
);
```

## 📝 Data Flow

### 1. User Fills Registration Form
**File**: `src/pages/Signup.js`

The form collects:
- Shop Name
- Owner Name
- Email
- Phone
- State
- City
- Pincode
- Full Address
- Password
- KYC Documents (Aadhaar, PAN, GST, Trade License)

### 2. Frontend Sends Data to Backend
**File**: `src/api/authApi.js`

```javascript
// API endpoint
POST http://localhost:5000/api/auth/signup

// Data sent
{
  email: "user@example.com",
  password: "password123",
  shopName: "My Shop",
  ownerName: "John Doe",
  phone: "1234567890",
  state: "Maharashtra",
  city: "Mumbai",
  pincode: "400001",
  address: "Street address...",
  kycUrls: {
    AADHAAR: "https://res.cloudinary.com/...",
    PAN: "https://res.cloudinary.com/...",
    GST: "https://res.cloudinary.com/..."
  }
}
```

### 3. Backend Processes and Saves to MongoDB
**File**: `server/controllers/authController.js`

```javascript
// 1. Check if email already exists
const existingUser = await User.findOne({ email });

// 2. Hash the password (automatic via User model)
// 3. Create new user document
const newUser = new User({
    email,
    password,
    shopName,
    ownerName,
    phone,
    state,
    city,
    pincode,
    address,
    kycUrls,
    status: 'APPROVED'
});

// 4. Save to MongoDB
await newUser.save();
```

### 4. Data Stored in MongoDB
**Database**: `user_details`
**Collection**: `user`

Example document:
```json
{
  "_id": ObjectId("679e1234567890abcdef1234"),
  "email": "user@example.com",
  "password": "$2a$10$hash...", // bcrypt hashed
  "shopName": "My Shop",
  "ownerName": "John Doe",
  "phone": "1234567890",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "address": "123 Main Street, Suburb",
  "kycUrls": {
    "AADHAAR": "https://res.cloudinary.com/...",
    "PAN": "https://res.cloudinary.com/...",
    "GST": "https://res.cloudinary.com/..."
  },
  "status": "APPROVED",
  "createdAt": ISODate("2026-01-13T08:30:00.000Z")
}
```

## 🔍 How to View Data in MongoDB Compass

### Step 1: Open MongoDB Compass
Launch the MongoDB Compass application on your computer.

### Step 2: Connect to Your Database
Use this connection string:
```
mongodb://localhost:27017
```

### Step 3: Navigate to Your Data
1. Click on `user_details` database
2. Click on `user` collection
3. You'll see all registered users

### Step 4: View User Details
Click on any document to see the full user details including:
- Email
- Shop information
- Location details
- KYC document URLs
- Registration timestamp

## 🔐 Security Features

### Password Hashing
Passwords are automatically hashed using bcrypt before storing:

**File**: `server/models/User.js`
```javascript
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
```

### Email Uniqueness
Email field has a unique index to prevent duplicate registrations:
```javascript
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
}
```

## 🧪 Testing the Connection

### Test Script
Run this command to verify the connection:
```bash
cd server
node testConnection.js
```

This will show:
- ✅ Connection status
- 📁 List of collections
- 👥 Number of registered users
- 📄 Sample user document

### Manual Test
1. **Start the server** (if not running):
   ```bash
   cd server
   npm start
   ```

2. **Go to the signup page**:
   ```
   http://localhost:3000/vendor/signup
   ```

3. **Fill the form and submit**

4. **Open MongoDB Compass**:
   - Navigate to `user_details` → `user`
   - You should see the newly registered user

## 📁 File Structure

```
server/
├── models/
│   └── User.js                 # User schema and model
├── controllers/
│   └── authController.js       # Signup and login logic
├── routes/
│   └── authRoutes.js          # API routes
├── index.js                    # MongoDB connection setup
└── .env                        # Database configuration

src/
├── pages/
│   └── Signup.js              # Registration form
└── api/
    └── authApi.js             # API calls to backend
```

## 🔧 Environment Variables

Make sure your `.env` file has:
```env
# MongoDB Connection
USER_DB_URI=mongodb://localhost:27017/user_details
VENDOR_DB_URI=mongodb://localhost:27017/vendor_marketplace

# Other configurations...
PORT=5000
```

## ✅ Verification Checklist

- [x] MongoDB Compass is installed
- [x] MongoDB service is running
- [x] Backend server is connected to `user_details` database
- [x] User model is using the correct connection
- [x] Signup controller saves to MongoDB
- [x] Frontend calls the correct API endpoint
- [x] Passwords are hashed before storage
- [x] Email uniqueness is enforced

## 📊 What Gets Stored

### From Registration Form:
1. **Basic Info**: email, shopName, ownerName
2. **Contact**: phone
3. **Location**: state, city, pincode, address
4. **Security**: password (hashed)
5. **KYC**: URLs of uploaded documents (stored in Cloudinary)
6. **Metadata**: status (APPROVED), createdAt (timestamp)

### KYC Document Flow:
1. User selects KYC documents (PDF/JPG/PNG)
2. Files are uploaded to **Cloudinary** (cloud storage)
3. Cloudinary returns URLs
4. URLs are stored in MongoDB under `kycUrls` field

## 🚀 Everything is Working!

Your registration system is fully functional:
- ✅ Users register via the form
- ✅ Data is validated on frontend and backend
- ✅ Passwords are securely hashed
- ✅ All details are saved to `user_details` database
- ✅ You can view all data in MongoDB Compass
- ✅ Login validates against stored data

No additional setup is needed - the connection is already active! 🎉
