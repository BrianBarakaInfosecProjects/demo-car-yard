/**
 * Feature Flags & Configuration System
 *
 * PRINCIPLE: All features are opt-in via environment variables
 * No feature removal requires refactoring core logic
 * All changes are backward compatible and reversible
 */

/**
 * Configuration Interface
 */
export interface FeatureConfig {
  // Main toggles
  logging: boolean;
  sessionLogging: boolean;
  auditLogging: boolean;
  adminLogsUI: boolean;

  // Data collection
  logUserAgent: boolean;
  logIpAddress: boolean;
  logSessionDuration: boolean;

  // Audit details
  auditBeforeState: boolean;
  auditAfterState: boolean;
  auditChanges: boolean;

  // Session events
  logLoginSuccess: boolean;
  logLoginFailed: boolean;
  logLogout: boolean;
  logSessionExpired: boolean;

  // Vehicle audit events
  logVehicleCreated: boolean;
  logVehicleUpdated: boolean;
  logVehicleDeleted: boolean;
  logVehiclePublished: boolean;
  logVehicleUnpublished: boolean;
}

/**
 * Parse boolean from environment variable
 * Accepts: "true", "false", "1", "0" (case-insensitive)
 * Defaults to: defaultValue
 */
const parseBool = (envVar: string | undefined, defaultValue: boolean): boolean => {
  if (envVar === undefined || envVar === '') return defaultValue;
  const lower = envVar.toLowerCase();
  return lower === 'true' || lower === '1';
};

/**
 * Load configuration from environment
 * All features are safely defaulted to true unless explicitly disabled
 */
export const config: FeatureConfig = {
  // Main toggles
  logging: parseBool(process.env.FEATURE_LOGGING_ENABLED, true),
  sessionLogging: parseBool(process.env.FEATURE_SESSION_LOGGING_ENABLED, true),
  auditLogging: parseBool(process.env.FEATURE_AUDIT_LOGGING_ENABLED, true),
  adminLogsUI: parseBool(process.env.FEATURE_ADMIN_LOGS_UI_ENABLED, true),

  // Data collection
  logUserAgent: parseBool(process.env.FEATURE_LOG_USER_AGENT, true),
  logIpAddress: parseBool(process.env.FEATURE_LOG_IP_ADDRESS, true),
  logSessionDuration: parseBool(process.env.FEATURE_LOG_SESSION_DURATION, true),

  // Audit details
  auditBeforeState: parseBool(process.env.FEATURE_AUDIT_BEFORE_STATE, true),
  auditAfterState: parseBool(process.env.FEATURE_AUDIT_AFTER_STATE, true),
  auditChanges: parseBool(process.env.FEATURE_AUDIT_CHANGES, true),

  // Session events
  logLoginSuccess: parseBool(process.env.FEATURE_LOG_LOGIN_SUCCESS, true),
  logLoginFailed: parseBool(process.env.FEATURE_LOG_LOGIN_FAILED, true),
  logLogout: parseBool(process.env.FEATURE_LOGOUT, true),
  logSessionExpired: parseBool(process.env.FEATURE_SESSION_EXPIRED, true),

  // Vehicle audit events
  logVehicleCreated: parseBool(process.env.FEATURE_LOG_VEHICLE_CREATED, true),
  logVehicleUpdated: parseBool(process.env.FEATURE_LOG_VEHICLE_UPDATED, true),
  logVehicleDeleted: parseBool(process.env.FEATURE_LOG_VEHICLE_DELETED, true),
  logVehiclePublished: parseBool(process.env.FEATURE_LOG_VEHICLE_PUBLISHED, true),
  logVehicleUnpublished: parseBool(process.env.FEATURE_LOG_VEHICLE_UNPUBLISHED, true),
};

/**
 * Helper function to check if logging is enabled globally
 * Can be used to wrap entire logging logic
 */
export const isLoggingEnabled = (): boolean => config.logging;

/**
 * Helper function to check if session logging is enabled
 */
export const isSessionLoggingEnabled = (): boolean =>
  config.logging && config.sessionLogging;

/**
 * Helper function to check if audit logging is enabled
 */
export const isAuditLoggingEnabled = (): boolean =>
  config.logging && config.auditLogging;

/**
 * Helper function to check if specific session event should be logged
 */
export const shouldLogSessionEvent = (eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SESSION_EXPIRED'): boolean => {
  if (!isSessionLoggingEnabled()) return false;

  switch (eventType) {
    case 'LOGIN_SUCCESS': return config.logLoginSuccess;
    case 'LOGIN_FAILED': return config.logLoginFailed;
    case 'LOGOUT': return config.logLogout;
    case 'SESSION_EXPIRED': return config.logSessionExpired;
    default: return false;
  }
};

/**
 * Helper function to check if specific audit event should be logged
 */
export const shouldLogAuditEvent = (action: string): boolean => {
  if (!isAuditLoggingEnabled()) return false;

  switch (action) {
    case 'VEHICLE_CREATED': return config.logVehicleCreated;
    case 'VEHICLE_UPDATED': return config.logVehicleUpdated;
    case 'VEHICLE_DELETED': return config.logVehicleDeleted;
    case 'VEHICLE_PUBLISHED': return config.logVehiclePublished;
    case 'VEHICLE_UNPUBLISHED': return config.logVehicleUnpublished;
    default: return false;
  }
};

/**
 * Safe logging wrapper - only executes if logging is enabled
 * Usage: safeLog(() => logSomething(data))
 */
export const safeLog = (logFn: () => void | Promise<void>): void => {
  if (isLoggingEnabled()) {
    try {
      logFn();
    } catch (error) {
      console.error('[Config] Logging error (suppressed):', error);
    }
  }
};

/**
 * Get user agent for logging (respects feature flag)
 */
export const getUserAgentForLog = (userAgent?: string): string | undefined => {
  return config.logUserAgent ? userAgent : undefined;
};

/**
 * Get IP address for logging (respects feature flag)
 */
export const getIpAddressForLog = (ipAddress?: string): string | undefined => {
  return config.logIpAddress ? ipAddress : undefined;
};

/**
 * Get before state for audit log (respects feature flag)
 */
export const getBeforeStateForLog = (state?: string): string | undefined => {
  return config.auditBeforeState ? state : undefined;
};

/**
 * Get after state for audit log (respects feature flag)
 */
export const getAfterStateForLog = (state?: string): string | undefined => {
  return config.auditAfterState ? state : undefined;
};

/**
 * Get changes for audit log (respects feature flag)
 */
export const getChangesForLog = (changes?: string): string | undefined => {
  return config.auditChanges ? changes : undefined;
};

/**
 * Export config for debugging/admin views
 */
export const getFeatureConfig = (): FeatureConfig => ({ ...config });
