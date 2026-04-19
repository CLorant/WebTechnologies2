const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const slugify = require('slugify');

const baseUploadDir = 'uploads';
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

const processImage = async (file, entityId, entityName, subfolder = 'products') => {
  const slug = slugify(entityName, { 
    lower: true, 
    strict: true,
    locale: 'en',
    replacement: '-'
  });
  const filename = `${slug}-${entityId}.webp`;
  const uploadDir = path.join(baseUploadDir, subfolder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  await sharp(file.buffer).webp({ quality: 80 }).toFile(filepath);
  return `/uploads/${subfolder}/${filename}`;
};

const deleteImage = (imagePath) => {
  if (!imagePath) return;
  
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(__dirname, '..', relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted old image: ${fullPath}`);
  }
};

module.exports = { upload, processImage, deleteImage };