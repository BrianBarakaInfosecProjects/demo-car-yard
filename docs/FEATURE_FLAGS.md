# 🚦 Feature Flags & Configuration System

## 📋 Overview

This system provides **runtime-safe feature toggles** that allow enabling/disabling functionality **without code removal or refactoring**.

**Core Principle**: All features are **opt-in via environment variables**. Disabling a feature is safe, reversible, and doesn't break existing functionality.

---

## 🎯 Design Principles

1. **Backward Compatible**: Existing behavior preserved when features disabled
2. **Non-Destructive**: No data loss when toggling features
3. **Easily Reversible**: Disable any feature via environment variable
4. **Configuration-Driven**: Behavior controlled centrally
5. **Additive Only**: New features extend, never replace

---

## 📝 Configuration File

### Location: `backend/.env.example`

All feature flags are defined in `.env.example` with clear documentation.

### Quick Reference

```bash
# Main Logging Controls
FEATURE_LOGGING_ENABLED=true              # Master switch for all logging
FEATURE_SESSION_LOGGING_ENABLED=true      # Session/auth event logging
FEATURE_AUDIT_LOGGING_ENABLED=true       # Admin action logging
FEATURE_ADMIN_LOGS_UI_ENABLED=true       # Admin logs UI visibility

# Data Collection Controls
FEATURE_LOG_USER_AGENT=true              # Collect user-agent strings
FEATURE_LOG_IP_ADDRESS=true             # Collect IP addresses
FEATURE_LOG_SESSION_DURATION=true        # Calculate and store session duration

# Audit Log Details
FEATURE_AUDIT_BEFORE_STATE=true          # Capture entity state before change
FEATURE_AUDIT_AFTER_STATE=true           # Capture entity state after change
FEATURE_AUDIT_CHANGES=true              # Capture request payload

# Session Event Toggles
FEATURE_LOG_LOGIN_SUCCESS=true           # Log successful logins
FEATURE_LOG_LOGIN_FAILED=true            # Log failed login attempts
FEATURE_LOG_LOGOUT=true                 # Log user logout events
FEATURE_LOG_SESSION_EXPIRED=true         # Log JWT token expiration

# Vehicle Audit Event Toggles
FEATURE_LOG_VEHICLE_CREATED=true         # Log vehicle creation
FEATURE_LOG_VEHICLE_UPDATED=true         # Log vehicle updates
FEATURE_LOG_VEHICLE_DELETED=true         # Log vehicle deletion
FEATURE_LOG_VEHICLE_PUBLISHED=true       # Log bulk publish actions
FEATURE_LOG_VEHICLE_UNPUBLISHED=true    # Log bulk unpublish actions
```

---

## 🎛️ Usage Examples

### Example 1: Disable All Logging

If the client decides logging is no longer needed:

```bash
# .env
FEATURE_LOGGING_ENABLED=false
```

**Result**: All logging stops immediately. No code changes needed. Existing functionality works exactly as before.

### Example 2: Disable Session Duration Tracking

If session duration is not useful:

```bash
# .env
FEATURE_LOG_SESSION_DURATION=false
```

**Result**: Login/logout logs still created, but `sessionDuration` field is null.

### Example 3: Disable Before/After State Capture

If state snapshots are causing performance issues:

```bash
# .env
FEATURE_AUDIT_BEFORE_STATE=false
FEATURE_AUDIT_AFTER_STATE=false
```

**Result**: Audit logs still created, but without large JSON state data. Existing functionality unaffected.

### Example 4: Disable Admin Logs UI

If the client wants to hide the logs interface temporarily:

```bash
# .env
FEATURE_ADMIN_LOGS_UI_ENABLED=false
```

**Result**: `/admin/logs` route shows maintenance message. Backend APIs still work for other purposes.

### Example 5: Disable Specific Audit Event

If vehicle creation logging causes issues:

```bash
# .env
FEATURE_LOG_VEHICLE_CREATED=false
```

**Result**: Vehicles still created normally, but no audit log is created. All other audit events still work.

---

## 🔧 Implementation Pattern

### For Developers: Adding New Features

When adding new features, follow this pattern:

#### 1. Add Flag to `.env.example`

```bash
FEATURE_NEW_FEATURE_NAME=true  # Default enabled
```

#### 2. Add to `backend/src/config/features.ts`

```typescript
export const config: FeatureConfig = {
  newFeatureName: parseBool(process.env.FEATURE_NEW_FEATURE_NAME, true),
  // ...
};
```

#### 3. Create Helper Function

```typescript
export const isNewFeatureEnabled = (): boolean =>
  config.logging && config.newFeatureName;
```

#### 4. Use in Code (Safe Pattern)

```typescript
export const newFeatureFunction = async (data: any) => {
  if (!isNewFeatureEnabled()) {
    return; // Feature disabled - exit gracefully
  }

  // Feature implementation here
};
```

#### 5. Add to Documentation

Update this file with usage examples.

---

## 🛡️ Safety Guarantees

### When Feature is Disabled:

✅ **No Errors**: Functions return early or skip logic gracefully
✅ **No Breaking Changes**: Existing behavior preserved
✅ **No Data Loss**: Disabling doesn't delete existing data
✅ **No Performance Impact**: Code paths are skipped entirely
✅ **Instant Effect**: Changes take effect on server restart
✅ **Rollback Safe**: Re-enable by changing one env var

---

## 🚀 Production Deployment

### Step 1: Update Environment Variables

Copy `.env.example` to production `.env` and adjust flags:

```bash
cp .env.example .env
# Edit .env with production settings
```

### Step 2: Review Flags

Before deployment, review each flag:

- **Is this feature needed in production?**
- **Is this data collection compliant with privacy policy?**
- **Will this logging impact performance?**

### Step 3: Deploy

Deploy with current `.env` settings. Monitor for issues.

### Step 4: Adjust if Needed

If issues arise, disable specific flags:

```bash
# In production .env
FEATURE_PROBLEMATIC_FEATURE=false
# Restart server
```

No code redeployment needed!

---

## 📊 Monitoring & Debugging

### Check Current Feature State

Add this endpoint to `/api/health` or create `/api/features`:

```typescript
// In controller
export const getFeatureConfig = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin only' });
  }

  res.json(getFeatureConfig());
};
```

### Enable Debug Logging

Add to `.env`:

```bash
NODE_ENV=development
LOG_LEVEL=debug
```

Feature flag decisions logged to console when debug enabled.

---

## 🔄 Migration Strategy

### Existing System

If migrating existing code to use feature flags:

1. **Add flag to config** (default: `true` for existing features)
2. **Wrap code with flag check**
3. **Test thoroughly**
4. **Deploy**
5. **Adjust flags as needed**

### Rollback

If feature causes issues:

```bash
# Change .env
FEATURE_PROBLEMATIC_FEATURE=false

# Restart server
```

Instant rollback, no code change needed.

---

## ⚠️ Important Notes

### Default Behavior

- **New features**: Default to `true` (enabled)
- **Existing features**: Default to `true` (preserved)
- **Master switch**: `FEATURE_LOGGING_ENABLED=false` disables everything

### Boolean Parsing

Accepted values:
- `true`, `True`, `TRUE`, `1` → **Enabled**
- `false`, `False`, `FALSE`, `0` → **Disabled**
- Empty or undefined → **Default value used**

### Environment Variables

- Must be set in `.env` file
- Changes require server restart
- No code changes needed to toggle

### Database Safety

- Disabling logging doesn't delete existing logs
- Re-enabling logging continues from where it left off
- No schema changes needed

---

## 📚 Related Files

- `backend/.env.example` - All feature flag definitions
- `backend/src/config/features.ts` - Configuration loader
- `backend/src/services/sessionLogService.ts` - Session logging with flags
- `backend/src/middleware/audit.ts` - Audit logging with flags

---

## 🆘 Troubleshooting

### Feature Not Working?

1. Check `.env` file exists and has correct values
2. Restart server after changing `.env`
3. Check server logs for flag errors
4. Verify flag name matches in `features.ts`

### Need to Disable Feature Quickly?

```bash
# In .env (no server restart needed for this!)
NODE_ENV=maintenance
```

Add custom maintenance check in application code if needed.

### Logging Performance Issues?

Disable expensive logging features:

```bash
FEATURE_AUDIT_BEFORE_STATE=false
FEATURE_AUDIT_AFTER_STATE=false
FEATURE_LOG_SESSION_DURATION=false
```

---

## ✅ Checklist

Before deploying:

- [ ] All flags reviewed for production suitability
- [ ] Privacy policy compliance checked for data collection
- [ ] Performance impact assessed
- [ ] Rollback plan documented
- [ ] Monitoring setup for disabled features
- [ ] Team briefed on flag usage

---

**Last Updated**: 2026-01-16
**System Version**: 1.0.0
