const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Database Connections
// Connection for user_details database
const userDbConnection = mongoose.createConnection(
    process.env.USER_DB_URI || 'mongodb://localhost:27017/user_details'
);

userDbConnection.on('connected', () => {
    console.log('MongoDB connected: user_details database');
});

userDbConnection.on('error', (err) => {
    console.log('MongoDB connection error (user_details):', err);
});

// Connection for vendor_marketplace database (for posts)
const vendorDbConnection = mongoose.createConnection(
    process.env.VENDOR_DB_URI || 'mongodb://localhost:27017/vendor_marketplace'
);

vendorDbConnection.on('connected', () => {
    console.log('MongoDB connected: vendor_marketplace database');
});

vendorDbConnection.on('error', (err) => {
    console.log('MongoDB connection error (vendor_marketplace):', err);
});

// Export connections for use in models
global.userDbConnection = userDbConnection;
global.vendorDbConnection = vendorDbConnection;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Vendor Marketplace API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
