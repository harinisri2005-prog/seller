import express from "express";
import { upload, uploadVideo } from "../config/multer.js";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// 1. Image Upload
router.post("/image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    return res.json({ url: req.file.path });
});

// 2. Video Upload
router.post("/video", uploadVideo.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No video uploaded" });
    }
    // Cloudinary returns path as secure_url usually, but multer-storage-cloudinary maps it to path
    return res.json({
        cloudinary_url: req.file.path,
        mux_asset_id: null // Not using Mux for now
    });
});

// 3. Create Post (Save to DB)
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const {
            description,
            imageUrl,
            videoUrl,
            videoAssetId,
            location,
            offerPrice,
            offerPeriod,
            expiryDate
        } = req.body;

        const vendorId = req.user.id;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await pool.query(
            `INSERT INTO posts 
       (vendor_id, description, image_url, video_url, video_asset_id, location, offer_price, offer_period, expiry_date, approval_status, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', 'ACTIVE')
       RETURNING *`,
            [vendorId, description, imageUrl, videoUrl, videoAssetId, location, offerPrice, offerPeriod, expiryDate]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ message: "Failed to create post" });
    }
});

// 4. Get Vendor Posts
router.get("/my-posts", authMiddleware, async (req, res) => {
    try {
        const vendorId = req.user.id;

        // First, check and deactivate any expired posts
        await pool.query(`
            UPDATE posts 
            SET status = 'EXPIRED' 
            WHERE vendor_id = $1 
            AND expiry_date < NOW() 
            AND status = 'ACTIVE'
        `, [vendorId]);

        // Then fetch all posts
        const result = await pool.query(
            "SELECT * FROM posts WHERE vendor_id = $1 ORDER BY created_at DESC",
            [vendorId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get Posts Error:", err);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

export default router;
