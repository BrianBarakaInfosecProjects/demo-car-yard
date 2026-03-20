#!/bin/bash

set -e

echo "=========================================="
echo "  Sassy Auto Trading - Pre-deployment Check"
echo "=========================================="
echo ""

PASS=0
FAIL=0

check_pass() {
    echo "  [PASS] $1"
    ((PASS++))
}

check_fail() {
    echo "  [FAIL] $1"
    ((FAIL++))
}

check_warn() {
    echo "  [WARN] $1"
}

echo "1. Checking required environment variables..."
echo ""

REQUIRED_VARS=("DATABASE_URL" "DIRECT_URL" "JWT_SECRET" "CLOUDINARY_CLOUD_NAME" "CLOUDINARY_API_KEY" "CLOUDINARY_API_SECRET")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        check_fail "$var is not set"
    else
        check_pass "$var is set"
    fi
done

echo ""
echo "2. Checking TypeScript compilation..."
echo ""

if npx tsc --noEmit 2>/dev/null; then
    check_pass "TypeScript compiles without errors"
else
    check_fail "TypeScript compilation errors"
fi

echo ""
echo "3. Checking build output..."
echo ""

if [ -d "dist" ]; then
    check_pass "dist/ directory exists"
    if [ -f "dist/server.js" ]; then
        check_pass "dist/server.js exists"
    else
        check_fail "dist/server.js not found"
    fi
else
    check_warn "dist/ directory not found - run 'npm run build' first"
fi

echo ""
echo "4. Checking security configurations..."
echo ""

if grep -q "process.env.JWT_SECRET" src/utils/token.ts 2>/dev/null; then
    if ! grep -q "fallback" src/utils/token.ts 2>/dev/null; then
        check_pass "JWT_SECRET has no fallback default"
    else
        check_fail "JWT_SECRET has fallback default (security risk)"
    fi
else
    check_warn "Could not verify JWT_SECRET handling"
fi

if grep -q "max: 5" src/middleware/rateLimiter.ts 2>/dev/null; then
    check_pass "Auth rate limiter is properly restricted (5 attempts)"
else
    check_fail "Auth rate limiter may be too permissive"
fi

if grep -q "\.min(8" src/utils/validators.ts 2>/dev/null; then
    check_pass "Password minimum length is 8 characters"
else
    check_fail "Password minimum length may be too short"
fi

echo ""
echo "5. Checking Prisma schema..."
echo ""

if grep -q "provider = \"postgresql\"" prisma/schema.prisma 2>/dev/null; then
    check_pass "Database provider is PostgreSQL"
else
    check_fail "Database provider is not PostgreSQL"
fi

if ! grep -q "provider = \"sqlite\"" prisma/schema.prisma 2>/dev/null; then
    check_pass "No SQLite provider in schema"
else
    check_fail "SQLite provider still present in schema"
fi

echo ""
echo "6. Checking dependencies..."
echo ""

if [ -f "node_modules/.prisma/client/index.js" ]; then
    check_pass "Prisma client is generated"
else
    check_fail "Prisma client not generated - run 'npx prisma generate'"
fi

echo ""
echo "=========================================="
echo "  Results: $PASS passed, $FAIL failed"
echo "=========================================="
echo ""

if [ $FAIL -gt 0 ]; then
    echo "DEPLOYMENT BLOCKED: Please fix the failing checks before deploying."
    exit 1
else
    echo "READY FOR DEPLOYMENT: All checks passed!"
    exit 0
fi
