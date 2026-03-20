# Rules For Any AI Working On This Project

READ THIS BEFORE MAKING ANY CHANGE.

## The Golden Rule
This is a working application with real bugs being fixed incrementally. Every session should make targeted fixes. Never rewrite entire files. Never restructure what works.

## Before Every Change
1. Read the file you are about to change — fully
2. Read globals.css and tailwind.config.ts for styling context
3. Identify the exact line(s) that need changing
4. Change only those lines
5. Verify build passes after change

## What You Must Never Do
- ❌ Change any useEffect, useState, useCallback, or hook without reading fully
- ❌ Change any fetch() call, API URL, or data fetching logic
- ❌ Change any TypeScript interface or type definition
- ❌ Change any route handler logic in backend
- ❌ Restructure JSX component hierarchy
- ❌ Add npm packages without explicit request
- ❌ Hardcode hex colors — use CSS variables only
- ❌ Use Bootstrap classes — this project uses Tailwind only
- ❌ Create duplicate Navbar or Footer components
- ❌ Add padding/margin to compensate for navbar manually (layout.tsx handles this)
- ❌ Import public Navbar into admin layout
- ❌ Apply dark theme tokens to admin pages

## Color System — Always Use Tokens
```css
/* Backgrounds */
bg-bg-page      → #0c0a08
bg-bg-card      → #1c1814
bg-bg-elevated  → #161310

/* Text */
text-text-primary   → #faf6ef
text-text-secondary → #a09888
text-accent         → #c4933f

/* Borders */
border-border-subtle → #2d2d2d

/* Accent buttons */
bg-accent           → #c4933f
hover:bg-accent-hover → #b08235
text-text-on-accent  → inherit
```

## Button Size Standard
- Default: `py-2 px-5 text-sm font-semibold`
- Small: `py-1.5 px-3.5 text-[13px] font-semibold`
- Large: `py-3 px-7 text-[15px] font-semibold` (hero only)
- **Never use:** `py-4`, `py-5`, `py-6` on buttons

## Admin Theme Is Intentionally Different
Admin pages use a light/blue theme.
- Do NOT apply dark theme tokens to admin pages
- Do NOT import public Navbar into admin layout
- Admin layout wraps AdminLayout component from `components/admin/AdminLayout.tsx`

## Layout Structure
```
Public pages:
  (public)/layout.tsx → Navbar + main + Footer
  main has paddingTop: var(--navbar-height)

Admin pages:
  admin/layout.tsx → AdminLayout wrapper (light theme)
  NO public Navbar or Footer
```

## Key Files to Reference
| Purpose | File |
|---------|------|
| CSS variables | frontend/app/globals.css |
| Tailwind config | frontend/tailwind.config.ts |
| API client | frontend/lib/api.ts |
| Auth helpers | frontend/lib/auth.ts |
| Types | frontend/lib/types.ts |
| Utilities | frontend/lib/utils.ts |

## Database Field Names
- Vehicle view count field is `viewCount` — NOT `views`
- This was a bug that was fixed, never change it back
- View increment: `prisma.vehicle.update({ data: { viewCount: { increment: 1 } } })`

## When In Doubt
- Make the smallest possible change
- Report what you found rather than guessing
- Ask before restructuring anything
- Read KNOWN_ISSUES.md for context on past bugs
- Check that similar patterns exist before implementing new ones

## Git Commit Guidelines
- Only commit when explicitly asked
- Write descriptive commit messages
- Never commit .env files or secrets
- Test builds before committing

## Error Handling
- Read error messages carefully
- Check browser console for frontend errors
- Check server logs for backend errors
- Most errors are caused by small typos or missing imports

## Performance Considerations
- Use Next.js Image component for all images
- Implement lazy loading where appropriate
- Avoid unnecessary re-renders
- Keep bundle size small

## Accessibility
- Use semantic HTML elements
- Include alt text for images
- Ensure sufficient color contrast
- Support keyboard navigation

---

**Remember:** This project is in active development. Many bugs have been fixed through careful, targeted changes. Do not undo that work with sweeping refactors.
