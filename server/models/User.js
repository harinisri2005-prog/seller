const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    pincode: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    kycUrls: {
        type: Object,
        default: {},
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'APPROVED', // Auto-approve for now
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Use userDbConnection from global and specify collection name as 'user'
module.exports = global.userDbConnection
    ? global.userDbConnection.model('User', userSchema, 'user')
    : require('mongoose').model('User', userSchema, 'user');
