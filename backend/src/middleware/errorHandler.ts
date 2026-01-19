import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  code?: string;
  name: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req as any).id || 'unknown';
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] [${requestId}] Error:`, {
    message: error.message,
    name: error.name,
    code: error.code,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    switch (error.code) {
      case 'P2002':
        return res.status(400).json({
          error: 'Unique constraint violation',
          message: 'This record already exists',
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found',
          message: 'The requested resource does not exist',
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Foreign key constraint failed',
          message: 'Referenced record does not exist',
        });
      default:
        return res.status(400).json({
          error: 'Database error',
          message: 'An error occurred while processing your request',
        });
    }
  }

  // Prisma client initialization error
  if (error.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Database connection failed',
    });
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.message.includes('validation')) {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.message,
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or malformed token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Your session has expired. Please login again.',
    });
  }

  // Multer file upload errors
  if (error.name === 'MulterError') {
    const multerError = error as any;
    switch (multerError.code) {
      case 'FILE_TOO_LARGE':
        return res.status(413).json({
          error: 'File too large',
          message: 'The uploaded file exceeds the maximum size limit',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(413).json({
          error: 'Too many files',
          message: 'You have exceeded the maximum number of files allowed',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Invalid file field',
          message: 'Unexpected file field in the request',
        });
      default:
        return res.status(400).json({
          error: 'File upload error',
          message: 'An error occurred while uploading your file',
        });
    }
  }

  // Custom status errors
  if (error.status) {
    return res.status(error.status).json({
      error: error.name,
      message: error.message,
    });
  }

  // Default 500 error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { requestId }),
  });
};
