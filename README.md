# University Forum Backend

Lightweight REST API for a university forum — user registration, authentication, student profiles, posts with images (Cloudinary), likes and comments.

This repository implements an Express.js backend using MongoDB. It is organized into controllers, routes, models, middleware and small utility modules for file uploads and email/OTP handling.

## Quick facts

- Node: CommonJS project (see `package.json` - `type: commonjs`)
- Main entry: `server.js`
- API base path: `/api/v1`
- Key folders: `src/controllers`, `src/routes`, `src/models`, `src/middleware`, `src/utils`, `src/config`

## Features

- Student register / login / password reset flows (OTP)
- Protected routes using JWT middleware (`src/middleware/authMiddleware.js`)
- Student profile upload (Cloudinary) via `src/utils/fileUploader.js`
- Post creation with image upload via `src/utils/postImageUploader.js`
- Basic CORS configuration in `server.js` (whitelist for local dev + a deployed origin)

## Tech stack & main dependencies

- Node.js + Express
- MongoDB (mongoose)
- Cloudinary for image hosting (multer-storage-cloudinary)
- JSON Web Tokens for auth

## Prerequisites

- Node.js (14+ recommended; use an LTS release)
- MongoDB (local or Atlas)
- A Cloudinary account (for image uploads)

## Getting started

1. Clone the repo

   git clone <repo-url>
   cd university-forum-backend

2. Install dependencies

```powershell
npm install
```

3. Create an environment file

Copy `sample.env` to `.env` and fill the values. See the `sample.env` file in the project root for keys used by the app.

4. Run the app

```powershell
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server listens on `process.env.PORT` or `5000` by default.

## Environment variables

Use the `sample.env` as a template. Important variables:

- `PORT` - server port
- `NODE_ENV` - development|production
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - secret for signing JWTs
- `JWT_EXPIRE` - JWT lifetime (example: `7d`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
- `CLIENT_URL` - used in CORS / emails
- `MAX_FILE_SIZE` - max upload size (bytes)

See `sample.env` for exact keys.

## API Endpoints

Base URL: <http://localhost:5000/api/v1>

Authentication routes (`src/routes/authRoutes.js`) — public

- POST /auth/register — register a student (request body: user info + email)
- POST /auth/login — login; returns JWT
- POST /auth/verify_account — verify registration OTP
- POST /auth/resend-register-otp — resend OTP for account verification
- POST /auth/forget-password — start password reset (sends OTP)
- POST /auth/verify-reset-otp — verify reset OTP
- POST /auth/reset-password — set new password
- POST /auth/resend-reset-otp — resend reset OTP

Student routes (`src/routes/studentRoutes.js`) — mixed

- GET /getMe — protected: get current authenticated student profile
- PUT /updateProfile — protected: update profile (multipart form; `profileImage` field allowed)
- GET /all_students — public: list students
- GET /student/:id — public: get a student by id

Post routes (`src/routes/postRoutes.js`) — mixed

- GET /post — public: list posts
- GET /post/:id — public: get post by id
- POST /post — protected: create a post (multipart form; `postImage` field allowed)
- PUT /post/:id — protected: update a post (supports `postImage` upload)
- DELETE /post/:id — protected: delete a post
- POST /post/:id/like — protected: like/unlike a post
- POST /post/:id/comment — protected: add a comment to a post

Notes:

- All protected routes use `src/middleware/authMiddleware.js` — the middleware expects a valid JWT (check the controller code to see whether the token is expected in Authorization header or cookie).
- Image uploads use Cloudinary via `multer-storage-cloudinary` and the helper modules in `src/utils`.

## Important files and where to look

- `server.js` — app bootstrap, CORS whitelist, route mounting
- `src/config/db.js` — mongoose connection
- `src/config/cloudinary.js` — Cloudinary config
- `src/controllers/*` — request handlers and business logic
- `src/routes/*` — URL => controller wiring
- `src/middleware/authMiddleware.js` — auth protection
- `src/utils/fileUploader.js`, `src/utils/postImageUploader.js` — multer/cloudinary upload setup

## Debugging / Development tips

- If uploads fail, verify Cloudinary credentials in `.env` and that the storage parser is used in the route (see `studentRoutes.js` and `postRoutes.js`).
- Check CORS origins in `server.js` if your frontend is blocked. Defaults include `http://localhost:3000`, `http://localhost:3001`, and `https://batch44-hub.vercel.app`.
- Enable request logs by adding `morgan` in `server.js` during development (not currently used in the file provided).

## Running on Windows PowerShell (examples)

```powershell
# install
npm install

# start dev
npm run dev
```

## Next steps / suggestions

- Add a dedicated error-handler middleware and centralize API error responses.
- Add tests (jest / supertest) for critical endpoints.
- Add Dockerfile and docker-compose for local MongoDB + app.

## License

ISC## Uni-Forum
