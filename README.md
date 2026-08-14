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

Validation and runtime test results

1. Server boot and MongoDB connection successful.
2. Health endpoint returned 200.
3. Register returned 201 with safe user and token.
4. Duplicate register returned 409.
5. Wrong-password login returned 401.
6. Valid login returned 200 with safe user and token.
7. Protected me with valid token returned 200.
8. Protected me with invalid token returned 401.
9. Missing token returned 401.
10. Password was never returned in tested responses.








Assessment backend is now implemented in your existing architecture, with auth-protected assessment APIs, score calculation, topic performance, weak concept detection, and MongoDB result storage. Existing Phase 1-3 routes remain working.

Files created

1. `assessmentService.js`
2. `assessmentController.js`
3. `assessmentRoutes.js`

Files updated

1. `app.js`

Notes on existing models used (no duplicate models created)

1. `Question.js`
2. `Assessment.js`
3. `Result.js`

What was implemented

1. Assessment service logic
1. Get available assessments with student-grade filtering.
2. Get one assessment with populated questions.
3. Submit assessment answers, calculate:
1. score
2. totalQuestions
3. percentage
4. topicPerformance
5. weakConcepts using deterministic rule (concept percentage < 60)
4. Save result in MongoDB Result collection.
5. Never return correctAnswer to students in GET assessment responses or submit response.

2. Assessment controller
1. Thin request/response handlers.
2. Validation and error handling delegated to service errors/status codes.

3. Assessment routes
1. GET /api/assessments
2. GET /api/assessments/:id
3. POST /api/assessments/:id/submit
4. All routes protected via existing protect middleware from `authMiddleware.js`.

4. App route registration
1. Mounted assessment routes under /api/assessments in `app.js`.
2. Kept existing /api/health and /api/auth routes intact.

Validation and runtime tests performed

1. Unauthorized access check
1. GET /api/assessments without JWT returned 401.

2. Assessment listing and retrieval
1. GET /api/assessments with JWT returned 200.
2. GET /api/assessments/:id returned 200.
3. Confirmed correctAnswer is not exposed in assessment question payload.

3. Submission behavior
1. POST submit with missing answers returned 400.
2. POST submit with duplicate question IDs returned 400.
3. POST submit with question IDs not belonging to the assessment returned 400.
4. POST submit valid payload returned 200 with:
1. score
2. totalQuestions
3. percentage
4. topicPerformance
5. weakConcepts

4. Not found and ID validation
1. Invalid assessment ID returned 400.
2. Valid but non-existent assessment ID returned 404 for both GET and submit.

5. Persistence check
1. Confirmed Result document is saved in MongoDB after successful submission.

Implemented API endpoints

1. GET /api/assessments
2. GET /api/assessments/:id
3. POST /api/assessments/:id/submit

Current structure additions match your expected Phase 4 layout

1. `assessmentRoutes.js`
2. `assessmentController.js`
3. `assessmentService.js`
4. `app.js` updated to register /api/assessments

If you want, I can next add a small set of request examples for Thunder Client/Postman collections for these three endpoints only, without adding any new architecture or phase features.

Made changes.