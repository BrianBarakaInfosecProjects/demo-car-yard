// Simple logger utility - production-ready
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

const isProduction = process.env.NODE_ENV === 'production';

const shouldLog = (level: LogLevel): boolean => {
  if (isProduction) {
    return level === 'warn' || level === 'error';
  }
  return true;
};

const formatMessage = (level: LogLevel, message: string, meta?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
};

export const logger = {
  debug: (message: string, meta?: LogContext): void => {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
  
  info: (message: string, meta?: LogContext): void => {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message, meta));
    }
  },
  
  warn: (message: string, meta?: LogContext): void => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  
  error: (message: string, meta?: LogContext): void => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, meta));
    }
  },
};

export const createLogger = (context: string) => {
  return {
    debug: (message: string, meta?: LogContext) => logger.debug(`[${context}] ${message}`, meta),
    info: (message: string, meta?: LogContext) => logger.info(`[${context}] ${message}`, meta),
    warn: (message: string, meta?: LogContext) => logger.warn(`[${context}] ${message}`, meta),
    error: (message: string, meta?: LogContext) => logger.error(`[${context}] ${message}`, meta),
  };
};

export default logger;
