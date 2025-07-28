const multer = require('multer');
const path = require('path');

// Configure file upload settings
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only csv files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

// Configure multer with size limits and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
