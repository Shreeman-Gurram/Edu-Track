 
## 1. What this project is

Edu-Track is a MERN-style learning application. A student can register/login, take grade-filtered assessments, receive a score, have progress records updated, receive an adaptive learning path, use learning content, and optionally sync assessment work saved while offline. It also contains protected admin APIs to create questions and assessments. The UI does **not** currently contain an admin screen.

`MERN` means MongoDB + Express + React + Node:

```text
Browser
  -> React/Vite client (client/)
  -> fetch() HTTP request with JSON + optional JWT
  -> Express API server (server/)
  -> middleware -> route -> controller -> service -> Mongoose model
  -> MongoDB
  -> JSON response
  -> React state changes -> screen rerenders
```

This is not a strict MVC project: it uses a useful layered design. Routes choose a URL, controllers translate HTTP input/output, services contain business rules and database work, and models define MongoDB document shapes.

## 2. Real project map

```text
Edu-Track/
├─ client/                         React frontend
│  ├─ src/main.jsx                 Browser entry point
│  ├─ src/App.jsx                  React URL routing
│  ├─ src/pages/                   Screens: login, dashboard, assessment, etc.
│  ├─ src/components/layout/       Navbar, Sidebar, MainLayout
│  ├─ src/api/                     Small feature-specific API wrappers
│  ├─ src/services/apiClient.js    Shared fetch client and JWT storage
│  └─ src/offline/                 IndexedDB storage and sync logic
└─ server/                         Node/Express backend
   ├─ src/server.js                Process entry point
   ├─ src/app.js                   Express creation and API mounting
   ├─ src/config/db.js             MongoDB connection
   ├─ src/routes/                  Endpoint definitions
   ├─ src/controllers/             HTTP handlers
   ├─ src/services/                Domain/business logic
   ├─ src/models/                  Mongoose schemas/models
   ├─ src/middleware/              auth, validation, errors
   └─ src/seed/                    Database seed scripts
```

There is no React Context, Redux, Zustand, or custom hooks directory. Page-local `useState` is the main online UI state; `localStorage` holds the JWT; IndexedDB holds offline activity/package data.

## 3. Startup sequence

### Client

Run in `client/`: `npm install`, then `npm run dev` (Vite). Vite serves the React app, normally at `http://localhost:5173`.

1. Browser loads `client/index.html`.
2. `client/src/main.jsx` calls `createRoot(...).render(<App />)`.
3. `App.jsx` creates `BrowserRouter` and selects a page from the browser URL.
4. `/` redirects to `/login`; public routes are `/login` and `/register`.
5. The frontend base API URL is `VITE_API_URL`, or `http://localhost:5000/api`, in `client/src/services/apiClient.js`.

### Server

Run in `server/`: `npm install`, then `npm run dev` or `npm start`.

1. `server/src/server.js` loads server `.env` using `dotenv.config()`.
2. It calls `connectDB()` from `config/db.js`; `mongoose.connect(process.env.MONGODB_URI)` must succeed first.
3. It creates Express through `createApp()` in `app.js`.
4. `app.js` enables JSON parsing and CORS, mounts all `/api/...` route groups, then registers 404/error handlers.
5. Only after MongoDB connects does `app.listen(PORT)` start (default `5000`).

The client and server use different ports, so the browser considers requests cross-origin. The server CORS function only accepts the exact server-side `CLIENT_URL` value (normally `http://localhost:5173`) or requests without an Origin header.

## 4. Core backend terms

- **Route:** decides which URL/method receives a request. Example: `router.post('/login', login)`.
- **Controller:** receives Express `req` and `res`, calls a service, and returns HTTP JSON. It should not contain complicated business logic.
- **Service:** validates domain rules, calculates values, queries models, and throws meaningful errors.
- **Model:** Mongoose object used to query a MongoDB collection.
- **Middleware:** a function between request arrival and controller. It receives `(req, res, next)`. `next()` hands control to the next middleware/controller.

For example, `POST /api/assessments/:id/submit` travels:

```text
assessmentRoutes.js
 -> protect middleware
 -> assessmentController.submitAssessment
 -> assessmentService.submitAssessment
 -> Assessment/User/Result models
 -> progressService.updateProgressFromResult
 -> learningService.generateLearningPath
 -> JSON response
```

## 5. Frontend-to-backend connection

`client/src/services/apiClient.js` is the central connection layer. Its `request(path, options)` calls:

```js
fetch(`${API_URL}${path}`, {
  method, headers, body: JSON.stringify(body)
})
```

Feature files such as `src/api/authApi.js` turn readable functions into URLs, for example `login(payload) => post('/auth/login', payload)`. The client automatically adds `Content-Type: application/json` when there is a body and adds `Authorization: Bearer <token>` only when `authenticated: true` and a token exists.

- **GET** reads data: assessments, progress, paths.
- **POST** creates/submits/generates data: registration, login, assessment submission, AI generation.
- This codebase has no frontend PUT/PATCH/DELETE API wrapper currently.
- `req.body` is parsed JSON; `req.params` contains URL parameters such as `:id`; `req.query` contains `?key=value`; `req.headers` contains the JWT header.

On non-2xx responses or `{ success: false }`, `apiClient` throws an Error. Pages catch that error, usually show its message through state, and stop loading/submitting.

## 6. Authentication: signup, login, protected requests

### Signup

```text
Register.jsx handleSubmit
 -> authApi.register
 -> POST /api/auth/register
 -> authRoutes.register
 -> authController.register
 -> authService.registerUser
 -> User.findOne(email), bcrypt.hash(password, 10), User.create
 -> JWT generated with JWT_SECRET
 -> { user, token }
 -> apiClient.setAuthToken(token) in localStorage key edutrackToken
 -> navigate('/dashboard')
```

`registerUser` normalizes email, checks required fields/email format/password length, rejects duplicate emails with 409, hashes the password, and never returns the password. `User.password` has `select: false`, so ordinary queries do not return it.

### Login

`Login.jsx` is a controlled form: `handleChange` copies typed values into `formData`; `handleSubmit` validates non-empty fields, invokes `login(formData)`, stores the returned token, then navigates to `/dashboard`.

On the backend `authService.loginUser` uses `User.findOne(...).select('+password')`, runs `bcrypt.compare`, and calls `jwt.sign({ userId, role }, JWT_SECRET, { expiresIn })`.

### Protected API behavior

`protect` in `server/src/middleware/authMiddleware.js` checks `Authorization: Bearer token`, verifies it with `jwt.verify`, loads the user, and adds:

```js
req.user = { _id: user._id, userId: user._id.toString(), role: user.role }
```

The next controller can safely know who made the request. `adminOnly` then allows only `role === 'admin'`.

Important current limitation: React routes themselves are **not protected**. A user can open `/assessment`, but the API call will return 401 if there is no valid token. There is no implemented Logout button/function; `clearAuthToken()` exists but no UI calls it. A robust app would redirect 401 users to login.

## 7. Major frontend pages and what they do

| Page | Route | Main data/action |
|---|---|---|
| Login | `/login` | Submits email/password; stores token; goes Dashboard. |
| Register | `/register` | Creates a student, stores token, goes Dashboard. |
| Dashboard | `/dashboard` | `useEffect` calls `/auth/me`; buttons navigate to assessment/subjects. |
| Assessment | `/assessment` | Lists assessments, loads questions, submits answers, shows Results. |
| Results | `/results` | Displays navigation-state result only; refresh loses it. |
| Subjects | `/subjects` | Uses progress API to summarize subjects; navigates to Topics. |
| Topics | `/topics` | Uses progress API to show concepts for selected subject/topic context. |
| Progress | `/progress` | Reads progress and renders summary/detail views. |
| Learning Path | `/learning-path` | Reads current/history paths, opens lessons/downloads offline package. |
| Learning Content | `/learning-content` | Displays lessons, practice/AI and local/server assessment work. |

`MainLayout` wraps most pages with `Navbar` and `Sidebar`. Login/Register are deliberately outside it. `LearningContent` is also outside it.

## 8. Assessment walkthrough (the most important flow)

### A. Listing and opening

1. Dashboard button calls `navigate('/assessment')` in `Dashboard.jsx`.
2. `Assessment` mounts. Its `useEffect` calls `getAssessments()`.
3. `assessmentApi.getAssessments` sends `GET /api/assessments` with bearer token.
4. In `assessmentRoutes.js`, `protect` runs, then `assessmentController.getAssessments` calls `assessmentService.getAssessments({ userId, role })`.
5. For students, the service reads `User.findById(userId)` and applies `{ grade: user.grade }` if a grade exists. It queries `Assessment.find(filter)`, selecting summary fields.
6. The page stores response `assessments` with `setAssessments`, causing cards to render.
7. Clicking Start Assessment calls `openAssessment(id)`, which sends `GET /api/assessments/:id`.
8. `getAssessmentById` validates Mongo ObjectId, populates question references while excluding `correctAnswer`, checks grade authorization, and returns a student-safe question list.

### B. Answering and submission

1. Each option button stores one answer in `selectedAnswers` keyed by `question.id`.
2. Previous/Next only changes `currentQuestion`; it does not call the backend.
3. Submit creates `[{ questionId, answer }]` for every displayed question.
4. Online: `submitAssessment(assessment.id, answers)` sends `POST /api/assessments/:id/submit`.
5. Backend validates ID, answers array, ownership/grade, question membership and duplicate IDs.
6. It compares each chosen answer to the hidden `correctAnswer`, calculates score, percentage, topic/difficulty performance and weak concepts (<60%).
7. It creates a `Result` document, calls `updateProgressFromResult`, and tries `generateLearningPath`. Learning path failure is logged but does not fail submission.
8. The response result is passed to `navigate('/results', { state: { result } })`; `Results.jsx` renders it.

### C. Offline alternative

When `navigator.onLine` is false, Assessment does not submit. It writes a `quiz_submission` object to IndexedDB through `saveActivity`, then the Navbar later calls `syncPendingActivities()` after reconnecting. That calls `POST /api/offline/sync`; `offlineService` loops activities and reuses the same `submitAssessment` service. `offlineActivityId` makes a synced submission idempotent.

## 9. Full backend API map

All entries below are confirmed in route files. `protect` means JWT required.

| Method | Endpoint | Middleware | Controller -> service | Purpose |
|---|---|---|---|---|
| GET | `/api/health` | none | healthController | Server health response |
| POST | `/api/auth/register` | none | authController -> registerUser | Create user + JWT |
| POST | `/api/auth/login` | none | authController -> loginUser | Verify credentials + JWT |
| GET | `/api/auth/me` | protect | authController -> getUserById | Current user |
| GET | `/api/assessments` | protect | assessment -> getAssessments | List available assessments |
| GET | `/api/assessments/:id` | protect | assessment -> getAssessmentById | Student-safe questions |
| POST | `/api/assessments/:id/submit` | protect | assessment -> submitAssessment | Score and persist result |
| POST | `/api/assessments/questions` | protect, adminOnly | assessment -> createQuestion | Admin question creation |
| GET | `/api/assessments/questions` | protect, adminOnly | assessment -> getQuestions | Admin question list/filter |
| POST | `/api/assessments` | protect, adminOnly | assessment -> createAssessment | Admin assessment creation |
| GET | `/api/assessments/admin` | protect, adminOnly | assessment -> getAdminAssessments | Admin assessment list |
| POST | `/api/learning-path/generate` | protect | learning -> generateLearningPath | Generate from resultId |
| GET | `/api/learning-path` | protect | learning -> getLearningPath | Active path |
| GET | `/api/learning-path/history` | protect | learning -> getLearningPaths | Path history |
| GET | `/api/learning-path/next` | protect | learning -> getNextLearningItem | Next priority item |
| GET | `/api/progress` | protect | progress -> getUserProgress | Progress summary/list |
| GET | `/api/progress/:topic` | protect | progress -> getTopicProgress | Topic detail |
| POST | `/api/ai/explanation` | protect | ai -> generateExplanation | OpenAI-supported explanation |
| POST | `/api/ai/practice` | protect | ai -> generatePractice | OpenAI-supported questions |
| GET | `/api/offline/package` | protect | offline -> getLearningPackage | Downloadable learning package |
| POST | `/api/offline/sync` | protect | offline -> syncOfflineActivity | Sync saved activities |

The frontend directly calls auth, assessment, learning-path, progress, AI and offline endpoints through `src/api/*.js`. Some UI-only navigation does not call an API. No profile-update, password-change, search, delete, or logout endpoint/UI is present in the available code.

## 10. Data models and relationships

MongoDB stores documents in collections managed by Mongoose. An `ObjectId` is MongoDB's unique identifier. `ref` lets `populate()` replace an ObjectId with its referenced document.

| Model | Important fields/relationships |
|---|---|
| User | name, unique lowercase email, hidden hashed password, role (`student/admin`), grade. |
| Question | question text, grade, subject/topic/concept, options, correctAnswer, difficulty. |
| Assessment | title/grade/subject/topic and `questions: [ObjectId -> Question]`. |
| Result | `user -> User`, `assessment -> Assessment`, score, answer records, performances, weak concepts, offline id. |
| Progress | one record per user+subject+topic+concept; unique compound index; mastery level. |
| LearningPath | user/result/assessment references and adaptive item subdocuments. |
| LearningPackage | per-user offline package with questions and a version. |
| Topic | standalone curriculum model with prerequisite/next topic references; no route/service currently uses it. |

Mongoose operations used include `find`, `findOne`, `findById`, `create`, `save`, `findOneAndUpdate`, `countDocuments`, `populate`, `select`, `sort`, and `limit`. `populate` is especially important in assessment submission: the Result's question refs are populated so subject/topic/concept can update Progress.

## 11. Learning path, progress and AI

After a submitted assessment, `progressService.updateProgressFromResult` converts answers into concept performance and upserts Progress records. Scores under 60 are `weak`, 60–79.99 are `needs_practice`, and 80+ are `strong`.

`learningService.generateLearningPath` inspects the owned Result, derives concept performance and compares prior results to identify trend. It produces priority/recommended-action items and saves an active LearningPath. `LearningPath.jsx` calls the current/history APIs and opens `LearningContent` with navigation state.

AI endpoints use the official OpenAI SDK only when `AI_API_KEY` is available. The service builds context from an owned result plus the student's grade, calls an OpenAI chat completion requesting JSON, validates the returned structure, and sends it to the UI. The frontend never receives or stores the OpenAI key.

## 12. Middleware, CORS and errors

- `express.json()` parses JSON request bodies before routes.
- `cors(createCorsOptions())` allows browser requests only from `CLIENT_URL`. A preflight OPTIONS request is handled by the cors package. `credentials: true` allows credentialed browser requests, although this app actually uses bearer headers/localStorage rather than cookies.
- `protect` rejects missing/invalid/expired tokens with 401; `adminOnly` rejects non-admins with 403.
- `notFoundHandler` returns `{ success:false, message:'Route not found' }` for unmatched routes.
- `errorHandler` is last in `app.js` and maps thrown errors to status codes, hiding 5xx details as `Internal server error`.

Controllers often catch service promise errors themselves and return `error.statusCode || 500`; therefore not every service error reaches the global error middleware. `validateRequest` exists as reusable middleware but no current route imports it.

Common statuses in this project: 200 successful reads/login/submit, 201 user/question/assessment creation, 400 invalid input, 401 missing/invalid token or bad credentials, 403 forbidden grade/admin access, 404 missing resource/route, 409 duplicate email, and 500 unexpected/configuration/database error. AI may use 502 for invalid/upstream AI response and 503 for missing AI configuration.

## 13. Environment variables

Server `.env` values are read by `process.env` and must never be committed: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `AI_API_KEY` (and optionally `AI_MODEL`).

Client values use `import.meta.env`. Only names beginning `VITE_` are exposed by Vite; `VITE_API_URL` is safe because it is not secret. Never put MongoDB URI, JWT secret, or OpenAI key into `client/.env`.

## 14. Important JavaScript/React ideas seen here

- `useState` stores state that changes the UI, e.g. `selectedAnswers`.
- `useEffect(..., [])` runs after initial rendering; pages use it for initial API reads.
- `async/await` makes a Promise-based request look sequential; `try/catch` handles a rejected request.
- Destructuring, e.g. `const { token } = await login(formData)`, extracts a property.
- Spread, e.g. `{ ...selectedAnswers, [id]: value }`, makes a new object rather than mutating React state.
- `map` transforms arrays into JSX cards/options; `filter` keeps matching items; optional chaining `result?.x` safely handles absent data.
- `BrowserRouter`, `Route`, `Navigate`, and `useNavigate` implement client-side page changes without full reloads.
- CommonJS `require`/`module.exports` is used in Node; ES module `import`/`export` is used in the Vite client.

## 15. Known issues and risks observed

1. Assessment route exists but Sidebar has no Assessment or Results navigation. Assessment is reached from Dashboard or direct URL.
2. React client routes are not protected; protected APIs reject users only after a page loads.
3. Results uses router state, so a browser refresh loses the displayed result. There is no API to fetch past Results directly.
4. If an Assessment has zero/stale question references, `Assessment.jsx` accesses an undefined question and can crash. The backend only rejects zero questions on submit, not on GET.
5. `seed/questions.js` runs `Question.deleteMany({})`. Existing Assessment question refs become stale unless `seed/assessments.js` is run afterwards. No seed scripts are in `server/package.json`.
6. Grade filtering means a student's grade must match stored assessment grade. An empty assessment page can be valid data behavior, not a missing route.
7. Frontend lint currently fails (unused variables and effect warnings/errors in Navbar, offline DB, LearningContent), though `npm run build` succeeds.
8. Text mojibake such as `âœ“` appears in source output, suggesting an encoding issue for visible symbols/content.

## 16. Debugging checklist

### Assessment not accessible

1. Open Dashboard and use Take Assessment, or manually use `/assessment`.
2. Browser DevTools Network: inspect `GET /api/assessments`.
3. 401: inspect localStorage `edutrackToken`, login again, check JWT secret has not changed.
4. CORS/network failure: confirm client URL equals server `CLIENT_URL`; confirm backend port and `VITE_API_URL`.
5. 200 with `assessments: []`: check User.grade and Assessment.grade/data in MongoDB.
6. Start card then crash/no questions: inspect Assessment question ObjectIds and seed assessments after questions.

### Login/register failure

Check form validation, Network URL/body, server terminal, MongoDB connection, `JWT_SECRET`, duplicate email (409), password length, and browser response message. Never log passwords or secrets.

### Generic API failure

Trace UI handler -> `src/api` function -> `apiClient.request` -> Network request -> `app.js` mount prefix -> route -> middleware -> controller -> service -> model/database. A 404 often means wrong method/path; 401 token issue; 403 role/grade issue; 500 requires backend terminal logs and environment/database inspection.

## 17. Interview/viva questions with answers

1. **Why not access MongoDB directly from React?** Database credentials would be exposed and browser code cannot safely enforce authorization. React calls the Express API.
2. **Explain login here.** Login.jsx posts credentials; authService finds user with hidden password selected, bcrypt-compares it, creates a signed JWT, and client stores/sends it as a Bearer token.
3. **What does `protect` do?** It verifies JWT, loads the current user, and writes `req.user` before the controller.
4. **Why have services?** Assessment scoring/progress/path creation can be reused and tested without HTTP concerns; controllers stay focused on req/res.
5. **How does assessment scoring work?** Server loads authoritative questions including correct answers, validates submitted IDs, compares answers, saves Result, then computes derived progress/path data.
6. **Why is `correctAnswer` excluded from GET assessment?** Returning it would let a student read answers before submitting.
7. **Why CORS?** Port 5173 and port 5000 are separate origins. The browser requires backend permission before JavaScript can read that response.
8. **What happens if the JWT expires?** `jwt.verify` returns a TokenExpiredError and `protect` sends 401. Current UI shows error rather than auto-logout/redirect.
9. **How does React update after API data arrives?** The handler calls a `setState` function; React rerenders from the new state.
10. **What relationship is Assessment -> Question?** Assessment stores Question ObjectIds. `populate('questions')` resolves them into question documents.

## 18. The entire project in one flow

```text
User opens localhost:5173
 -> client/src/main.jsx renders App
 -> App.jsx router sends / to Login
 -> Login.jsx handleSubmit -> authApi.login -> apiClient.fetch
 -> POST localhost:5000/api/auth/login
 -> server.js started Express after config/db.js connects MongoDB
 -> app.js mounted authRoutes
 -> authRoutes -> authController.login -> authService.loginUser
 -> User model finds account; bcrypt validates password; jwt signs token
 -> JSON { success, user, token }
 -> localStorage edutrackToken; navigate('/dashboard')
 -> Dashboard useEffect -> GET /api/auth/me -> protect -> getUserById
 -> Dashboard displays profile and Take Assessment
 -> Assessment fetches list/load/submits through assessment API
 -> protect -> assessment service -> Assessment/Question/User/Result models
 -> Result persisted; Progress upserted; LearningPath generated
 -> response result -> navigate('/results') -> Results renders score
```

## 19. Learning roadmap from this codebase

- **Level 1:** React components/state/forms/router, HTTP requests, Express routes/controllers, MongoDB documents, basic Mongoose schemas.
- **Level 2:** JWT/bcrypt, middleware, references/populate, layered services, CORS, error/status handling, environment variables, offline IndexedDB.
- **Level 3:** idempotent offline sync, adaptive progress/path algorithms, input validation, secure token storage design, testing, role-based admin UI, deployment and observability.

Next, practice by adding tests for auth/assessment, route guards and logout, a results-history endpoint/page, safe seed scripts, consistent UTF-8 encoding, and an admin UI for the already-existing admin APIs.
