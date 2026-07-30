const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SmartShop-AI/banners',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  }
});

const bannerUpload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for banners
});

module.exports = bannerUpload;
