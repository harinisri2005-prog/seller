const cloudinary = require('../config/cloudinary');
const mux = require('../config/mux');
const streamifier = require('streamifier');
const Post = require('../models/Post');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'vendor_marketplace' },
            (error, result) => {
                if (error) return res.status(500).json({ error: error.message });
                res.status(200).json({ url: result.secure_url, public_id: result.public_id });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Note: For large videos, it's better to use direct uploads to Mux from the client
        // or signed URLs. This is a simple implementation for smaller files.

        // Cloudinary can also store the raw video before passing to Mux, 
        // or we can upload to Cloudinary and give Mux the URL.

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'video', folder: 'vendor_videos' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        // Now create a Mux asset from the Cloudinary URL
        const asset = await mux.create({
            input: result.secure_url,
            playback_policy: 'public',
        });

        res.status(200).json({
            mux_asset_id: asset.id,
            playback_id: asset.playback_ids[0].id,
            cloudinary_url: result.secure_url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { description, imageUrl, videoUrl, videoAssetId, location, offerPrice, offerPeriod } = req.body;

        const newPost = new Post({
            description,
            imageUrl,
            videoUrl,
            videoAssetId,
            location,
            offerPrice,
            offerPeriod
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
