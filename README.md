# Edu-Track
<!-- Feature Shreeman -->
What was completed

1. Installed required packages
1. Added jsonwebtoken and bcryptjs to `package.json`.

2. Environment variables updated
1. Added JWT_SECRET and JWT_EXPIRES_IN to `.env`.
2. Added JWT_SECRET and JWT_EXPIRES_IN to `.env.example`.
3. Confirmed .env is ignored via /.gitignore.

3. User model updated (existing file reused, no duplicate model)
1. Updated password field to exclude by default in normal queries using select false in `User.js`.
2. Preserved existing requirements already present:
1. unique lowercase email
2. role enum student/admin
3. default role student

4. Auth service created
1. Created `authService.js` with:
1. registerUser
2. loginUser
3. getUserById
2. Includes:
1. email normalization and validation
2. password hashing with bcryptjs
3. password compare on login
4. JWT generation from env vars only
5. safe user shaping without password
6. duplicate email handling and validation errors

5. Auth controller created
1. Created `authController.js` with:
1. register
2. login
3. getCurrentUser
2. Controller handles HTTP input/output and delegates business logic to authService.

6. Auth middleware created
1. Created `authMiddleware.js` with protect middleware.
2. Handles:
1. Bearer token extraction
2. JWT verification
3. expired and invalid token handling
4. user existence check
5. attaching req.user with userId and role

7. Auth routes created and connected
1. Created `authRoutes.js`.
2. Connected route mount in `app.js` at /api/auth.
3. Kept health endpoint intact in `healthRoutes.js`.

API endpoints created

1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me (protected by protect middleware)

Response behavior implemented

1. Register success:
1. success true
2. message User registered successfully
3. safe user object
4. token
2. Login success:
1. success true
2. message Login successful
3. safe user object
4. token
3. Me success:
1. success true
2. safe user object
4. Error cases handled:
1. missing required fields
2. invalid email
3. duplicate email
4. weak password (min 6)
5. invalid login credentials
6. missing token
7. invalid token
8. expired token
9. user no longer exists



