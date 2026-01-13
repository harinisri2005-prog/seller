const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/image', upload.single('image'), uploadController.uploadImage);
router.post('/video', upload.single('video'), uploadController.uploadVideo);
router.post('/create', uploadController.createPost);

module.exports = router;
