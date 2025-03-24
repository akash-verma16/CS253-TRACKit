const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to allow various file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'text/plain',
    
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    
    // Others
    'text/csv',
    'application/json'
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Limit file size to 20MB
});

// Middleware to handle file uploads and errors
const uploadMiddleware = (fieldName, maxFiles) => (req, res, next) => {
  upload.array(fieldName, maxFiles)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    } else if (err) {
      console.error('File filter error:', err);
      return res.status(400).json({ message: 'Unsupported file type', error: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;