# Vehicle Creation Flow & Debugging Guide

## Current Failure Prediction

### Most Likely Cause (95% probability):
**Form state getting cleared when file input triggers**
- File input `onChange` event might be bubbling up to form submit
- React re-render causing state reset
- Or implicit page reload happening

### Secondary Causes (5% probability):
- Backend Multer not receiving files properly
- Cloudinary auth failing silently
- Network timeout during upload

---

## Complete Flow: Admin Upload → Published Vehicle

### Phase 1: Admin Side (Browser)
```
1. User fills form fields
   - Make, Model, Year, Price, Mileage, etc.
   - Status, Description, optional VIN/Location

2. User adds images
   - Clicks "Select Images" button
   - Browser file picker opens
   - User selects 1-10 images
   - Frontend shows previews (base64)

3. User clicks "Add Vehicle" button
   - Frontend validates form
   - If validation fails → shows errors, stops
   - If validation passes → creates FormData
```

### Phase 2: API Request
```
4. Frontend creates FormData
   const formData = new FormData()
   formData.append('make', 'Toyota')
   formData.append('model', 'Camry')
   // ... all other fields
   imageFiles.forEach(file => {
     formData.append('images', file)
   })

5. Frontend sends POST request
   fetch('http://localhost:5000/api/vehicles', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer <token>'
       // Note: NO Content-Type header! FormData sets it automatically
     },
     body: formData  // multipart/form-data with files
   })
```

### Phase 3: Backend Processing
```
6. Route: POST /api/vehicles

7. Middleware chain executes:
   a) authMiddleware
      - Validates JWT token
      - Attaches req.user with decoded token
   
   b) adminOnly
      - Checks req.user.role === 'ADMIN'
      - Returns 403 if not admin
   
   c) auditLogger
      - Logs CREATE_VEHICLE event to audit log
   
   d) uploadMultiple('images', 10) ← CRITICAL STEP
      - Multer parses multipart/form-data
      - Extracts 'images' field
      - Stores files in memory buffers
      - Attaches to req.files as Express.Multer.File[]
      - Validates file size (max 5MB each)
      - Validates file type (JPEG, PNG, GIF, WebP only)
      - Returns 413 if too large
      - Returns 400 if wrong type
      - If validation passes → calls next()
      - If no images → req.files = [] (empty array)

8. Controller receives request (vehicleController.createVehicle)
   const files = req.files  // Array of Express.Multer.File
   const vehicleData = req.body  // All text fields as strings

9. Image processing:
   IF files.length > 0:
     a) Upload to Cloudinary
        uploadedImages = await uploadMultipleToCloudinary(files)
        - For each file in files:
          - Calls cloudinary.uploader.upload_stream()
          - Sends file buffer to Cloudinary API
          - Cloudinary stores image and returns URL + publicId
        
        uploadedImages = [
          { url: 'https://res.cloudinary.com/my-cloud/vehicles/abc123.jpg',
            publicId: 'vehicles/abc123' },
          { url: 'https://res.cloudinary.com/my-cloud/vehicles/def456.jpg',
            publicId: 'vehicles/def456' },
          // ... more images
        ]
     
     b) Update vehicle data with Cloudinary URLs
        vehicleData.images = uploadedImages.map(img => img.url)
        vehicleData.imageUrl = uploadedImages[0].url  // First image = hero
        vehicleData.imagePublicIds = uploadedImages.map(img => img.publicId)
   
   ELSE (no images uploaded):
     c) Use default image (fallback)
        const defaultImageUrl = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?...'
        vehicleData.imageUrl = defaultImageUrl
        vehicleData.images = [defaultImageUrl]
        vehicleData.imagePublicIds = undefined  // No Cloudinary IDs

10. Save to database
    vehicle = await vehicleService.createVehicle(vehicleData, userId)
    
    - Prisma creates vehicle record in PostgreSQL
    - All fields stored including images array
    - Defaults applied if missing:
      - featured = false
      - isDraft = false
      - status = 'AVAILABLE'
      - deletedAt = null
      - createdAt/updatedAt = now()

11. Create notification
    await notificationService.create({
      type: 'SUCCESS',
      message: 'Vehicle created: Toyota Camry (2026)',
      action: 'VEHICLE_CREATED',
      userId: req.user.id,
      vehicleId: vehicle.id
    })

12. Return success response
    res.status(201).json({
      success: true,
      vehicle: { ...vehicle },
      message: 'Vehicle created successfully'
    })
```

### Phase 4: Database Storage (PostgreSQL)
```
13. Vehicle record created in Vehicle table
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      slug: '2026-toyota-camry',
      make: 'Toyota',
      model: 'Camry',
      year: 2026,
      priceKES: 5000000,
      mileage: 0,
      bodyType: 'SEDAN',
      fuelType: 'GASOLINE',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      exteriorColor: 'Black',
      interiorColor: 'Black',
      engine: '2.5L I4',
      vin: null,
      location: 'Nairobi Showroom',
      status: 'AVAILABLE',
      featured: false,
      description: 'Test vehicle...',
      imageUrl: 'https://res.cloudinary.com/my-cloud/vehicles/abc123.jpg',
      images: [
        'https://res.cloudinary.com/my-cloud/vehicles/abc123.jpg',
        'https://res.cloudinary.com/my-cloud/vehicles/def456.jpg',
        // ... more images
      ],
      imagePublicIds: ['vehicles/abc123', 'vehicles/def456', ...],
      viewCount: 0,
      isDraft: false,
      deletedAt: null,
      createdAt: '2026-01-16T18:00:00.000Z',
      updatedAt: '2026-01-16T18:00:00.000Z'
    }
```

### Phase 5: Public Site Display
```
14. User visits http://localhost:3000/vehicles
    Next.js renders vehicle listing page

15. Frontend queries API
    GET /api/vehicles?includeDrafts=false

16. Backend queries database
    SELECT * FROM Vehicle
    WHERE deletedAt IS NULL
      AND isDraft = false
    ORDER BY createdAt DESC

17. Returns all vehicles including new one

18. Frontend renders vehicle cards
    Each vehicle card shows:
    - Hero image from vehicle.imageUrl
    - Make, Model, Year
    - Price formatted as KSh X,XXX,XXX
    - Status badge (Available, Sold, etc.)
    - Featured badge if featured = true

19. User clicks vehicle to view details
    GET /api/vehicles/{id}
    Returns full vehicle data

20. Details page shows:
    - Hero image (imageUrl)
    - Image gallery (images array)
    - All vehicle specs
    - Contact form to make inquiry
```

---

## Critical Failure Points

### Point A: Frontend → Backend
**Can fail if:**
- JWT token expired → 401 Unauthorized
- Network down → "Failed to fetch"
- CORS blocked → "Failed to fetch"

### Point B: Multer File Processing
**Can fail if:**
- Files too large (>5MB) → 413 Payload Too Large
- Wrong file type (PDF, DOCX) → 400 Bad Request
- Field name mismatch (using 'image' vs 'images') → req.files = undefined
- FormData corrupted → 400 error

### Point C: Cloudinary Upload
**Can fail if:**
- Invalid credentials → 401 Unauthorized from Cloudinary
- Network timeout → 500 error
- File corrupted → Upload fails
- Cloudinary service down → 503 error

### Point D: Database Save
**Can fail if:**
- Schema validation → 400 Validation Error
- Unique constraint (VIN already exists) → 409 Conflict
- Database connection lost → 500 Internal Server Error

---

## Current Issue Analysis

Based on "form clears when adding images":

**Most probable cause:**
The file input's `onChange` handler is somehow triggering a form reload/reset.

**Possible reasons:**
1. File input inside a `<label>` that has `<form>` as parent
2. `e.preventDefault()` not working correctly
3. React state batching issue causing reset
4. Browser auto-submit on file selection (rare but possible)

---

## Debugging Steps

**Step 1: Check Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Fill form with details
4. Add images
5. Watch for console logs:
   - "handleImageChange called"
   - "Files selected: X"
   - "Setting imageFiles to: X"
   - If form clears → Look for any error

**Step 2: Check Network Tab**
1. Open Network tab in DevTools
2. Fill form and submit
3. Look for POST /api/vehicles request
4. Click request to see:
   - Request Headers (Authorization, Content-Type)
   - Request Payload (FormData structure)
   - Response Status (200, 400, 500)
   - Response Body (error message)

**Step 3: Check Backend Logs**
```bash
tail -f /tmp/backend.log
```
4. Submit form
5. Look for:
   - Upload processing logs
   - Cloudinary upload errors
   - Database errors
   - Stack traces

---

## Expected Success Flow

1. ✅ User fills form details
2. ✅ User adds images (previews shown)
3. ✅ User clicks "Add Vehicle"
4. ✅ Form validates (no errors)
5. ✅ Frontend sends FormData to backend
6. ✅ Backend receives and parses FormData
7. ✅ Multer extracts files from FormData
8. ✅ Cloudinary uploads files (or uses default)
9. ✅ Vehicle saved to database
10. ✅ Notification created
11. ✅ Backend returns 201 with vehicle data
12. ✅ Frontend shows success alert
13. ✅ Frontend redirects to /admin/vehicles
14. ✅ New vehicle appears in list
15. ✅ Vehicle is queryable via /api/vehicles
16. ✅ Public site displays new vehicle
