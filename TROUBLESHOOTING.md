// ============================================
// TROUBLESHOOTING - LOGIN ERRORS
// ============================================

## ISSUE: Login Error on Frontend

### SYMPTOMS
- Getting error when trying to login
- Frontend at: http://localhost:3000/auth/login
- Backend at: http://localhost:5000
- Email: admin@trustauto.co.ke
- Password: Admin123!

### DIAGNOSTIC STEPS

#### Step 1: Check Backend Health
```bash
curl http://localhost:5000/health
```
Expected: {"status":"ok","timestamp":"..."}

#### Step 2: Test Login via Backend API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trustauto.co.ke","password":"Admin123!"}'
```
Expected: {"token":"...","user":{"id":"...","email":"..."}}

#### Step 3: Open Browser DevTools
1. Open http://localhost:3000/auth/login
2. Press F12 to open DevTools
3. Go to "Console" tab
4. Try to login
5. Check for errors in console

#### Step 4: Check Network Requests
1. In DevTools, go to "Network" tab
2. Try to login
3. Find the "/api/auth/login" request
4. Click on it to see:
   - Request payload (should be JSON)
   - Response (should have token)
   - Status code (should be 200)
   - Any error messages

#### Step 5: Test API Page
Open: http://localhost:3000/test-api
- Click "Test Login" button
- Check if token is returned
- Check if token is saved to localStorage
- Click "Get Vehicles" to test authenticated request

### COMMON CAUSES & SOLUTIONS

#### Cause 1: NEXT_PUBLIC_API_URL Not Set
**Problem:** Frontend doesn't know backend URL

**Check:**
```bash
cd frontend
cat .env.local 2>/dev/null || echo "No .env.local file"
echo $NEXT_PUBLIC_API_URL
```

**Solution:**
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Restart frontend:
```bash
pkill -f "next dev"
npm run dev
```

#### Cause 2: CORS Error
**Problem:** Backend blocking frontend requests

**Symptoms:**
- Console shows CORS error
- Network request shows 401/403

**Check Backend Logs:**
```bash
tail -f /tmp/backend.log
```

**Solution:**
Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Restart backend:
```bash
cd backend
pkill -f "ts-node.*server.ts"
npm run dev
```

#### Cause 3: Token Storage Issue
**Problem:** localStorage not accessible

**Symptoms:**
- Login succeeds but redirect fails
- Token not saved

**Check in Browser Console:**
```javascript
// Run in DevTools Console:
localStorage.getItem('token')
```

**Solution:**
The auth.ts file has a check for `typeof window !== 'undefined'` which should handle this.

#### Cause 4: Response Structure Mismatch
**Problem:** Frontend expecting different response format

**Check in Network Tab:**
- What does the API return?
- Expected: `{token: "...", user: {...}}`
- Actual: ???

**Solution:**
If response structure is different, update frontend login page to match.

#### Cause 5: Frontend Not Rebuilding
**Problem:** Changes not reflected

**Solution:**
```bash
cd frontend
pkill -f "next dev"
rm -rf .next
npm run dev
```

### QUICK FIX ATTEMPT

If login still fails, try this in browser console:

```javascript
// 1. Test direct API call
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@trustauto.co.ke',
    password: 'Admin123!'
  })
})
.then(r => r.json())
.then(d => console.log('Direct API call result:', d))
.catch(e => console.error('Direct API call error:', e));

// 2. Check if token gets saved after login
localStorage.setItem('token', 'test-token');
console.log('Token saved:', localStorage.getItem('token'));

// 3. Check API URL configuration
console.log('API URL:', window.location.origin + '/api/backend');
```

### DEBUGGING CHECKLIST

- [ ] Backend is running (curl http://localhost:5000/health)
- [ ] Frontend is running (curl http://localhost:3000)
- [ ] Can login via curl API directly
- [ ] Browser console shows no errors
- [ ] Network request shows 200 status
- [ ] Token is returned by API
- [ ] Token is saved to localStorage
- [ ] Redirect happens after successful login
- [ ] Dashboard page loads

### ENVIRONMENT FILES VERIFICATION

**Backend (backend/.env):**
```bash
cat backend/.env
```

**Frontend (frontend/.env.local):**
```bash
cat frontend/.env.local
```

**Should have:**
```env
# Backend
DATABASE_URL=postgresql://postgres:password@localhost:5432/trustauto
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### STILL HAVING ISSUES?

If all checks pass but login still fails:

1. Clear browser cache:
   - Chrome: F12 → Application → Clear storage → F5
   - Firefox: F12 → Storage → Clear All → F5

2. Try incognito/private mode:
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P

3. Check for conflicting extensions:
   - Disable ad blockers
   - Disable CORS extensions

4. Restart everything:
   ```bash
   ./restart-all.sh
   ```

### CONTACT

If issue persists, check:
- Backend logs: `tail -f /tmp/backend.log`
- Frontend logs: `tail -f /tmp/frontend.log`
- Browser console (F12)
- Network tab in DevTools (F12)
