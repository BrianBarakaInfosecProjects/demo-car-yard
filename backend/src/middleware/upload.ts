import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

const uploadsDir = path.join(__dirname, '../../uploads');

const ensureUploadsDir = async () => {
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    // Directory already exists, ignore
  }
};

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/\s+/g, '_');
    cb(null, `${sanitizedName.split('.')[0]}-${uniqueSuffix}${ext}`);
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

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
  }

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
    fieldNameSize: 100,
    fieldSize: 100 * 1024,
  },
});

export const uploadSingle = (fieldName: string = 'image') => {
  return (req: any, res: any, next: any) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
              error: 'File too large. Maximum size is 5MB',
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({
              error: 'Too many files. Maximum is 10 files',
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
      
      if (!req.file && !req.files) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }
      
      next();
    });
  };
};

export const uploadMultiple = (fieldName: string = 'images', maxCount: number = 10) => {
  return (req: any, res: any, next: any) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
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
        return res.status(400).json({
          error: 'No files uploaded',
        });
      }
      
      next();
    });
  };
};

export const deleteUploadedFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    await unlink(fullPath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

export const validateImageDimensions = async (filePath: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = filePath;
  });
};
