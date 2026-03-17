const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../utils/cloudinary');

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const cloudinaryUrl = await uploadToCloudinary(req.file.path);
    // Delete local file after upload
    fs.unlinkSync(req.file.path);
    res.send(cloudinaryUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/multiple', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
      const url = await uploadToCloudinary(file.path);
      fs.unlinkSync(file.path);
      return url;
    });
    
    const cloudinaryUrls = await Promise.all(uploadPromises);
    res.send(cloudinaryUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
