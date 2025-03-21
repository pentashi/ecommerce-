const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage
const crypto = require('crypto'); // For generating signatures

const router = express.Router();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload Product Image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    console.log('Timestamp:', timestamp); // Debug

    // Generate the string to sign
    const stringToSign = `timestamp=${timestamp}${process.env.CLOUD_API_SECRET}`;
    console.log('String to Sign:', stringToSign); // Debug

    // Create the signature
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');
    console.log('Generated Signature:', signature); // Debug

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      timestamp: timestamp,
      signature: signature,
      api_key: process.env.CLOUD_API_KEY, // API Key passed to Cloudinary
    });

    // Return the uploaded image URL
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
