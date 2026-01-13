const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false, // Optional, as user might not upload image
    },
    videoUrl: {
        type: String,
        required: false, // Optional
    },
    videoAssetId: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    offerPrice: {
        type: Number,
        required: false,
    },
    offerPeriod: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Use vendorDbConnection from global
module.exports = global.vendorDbConnection
    ? global.vendorDbConnection.model('Post', postSchema)
    : require('mongoose').model('Post', postSchema);
