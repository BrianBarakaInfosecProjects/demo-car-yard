import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Allowed types: jpeg, jpg, png, gif, webp`));
  }

  cb(null, true);
};

export const localUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
    fieldNameSize: 100,
    fieldSize: 100 * 1024,
  },
});

export const uploadMultipleLocal = (fieldName: string = 'images', maxCount: number = 10) => {
  return (req: any, res: any, next: any) => {
    const uploadHandler = localUpload.array(fieldName, maxCount);

    uploadHandler(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
              error: 'File too large. Maximum size is 5MB per file',
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({
              error: `Too many files. Maximum is ${maxCount} files`,
            });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              error: `Unexpected field. Expected field name: ${fieldName}`,
            });
          }
        }

        return res.status(400).json({
          error: err.message || 'File upload failed',
        });
      }

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        req.files = [];
      }

      // Add base URL to each file
      if (Array.isArray(req.files)) {
        req.files = req.files.map((file: any) => ({
          ...file,
          url: `/uploads/${file.filename}`,
        }));
      }

      next();
    });
  };
};
