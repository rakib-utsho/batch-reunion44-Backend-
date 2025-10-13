# Repository notes for AI coding agents

These instructions highlight the essential knowledge an AI agent needs to be productive in this Express + MongoDB codebase.

Keep it short and actionable.

1. Project entry & conventions
   - App bootstrap: `server.js`. It registers routes under `/api/v1` and configures CORS (whitelist includes `http://localhost:3000`, `http://localhost:3001`, and `https://batch44-hub.vercel.app`).
   - CommonJS modules (check `package.json` -> `type: commonjs`). Use `require` / `module.exports`.

2. Folder responsibilities
   - `src/controllers` — business logic and response shaping (e.g., `authController.js` handles registration/login/OTP flows).
   - `src/routes` — route definitions (URL -> controller). Use these to infer available endpoints and HTTP methods.
   - `src/models` — Mongoose schema definitions. When adding fields, update controllers that read/write those fields.
   - `src/middleware` — cross-cutting middleware. `authMiddleware.protect` guards protected routes; tokens are validated here.
   - `src/utils` — small utilities: Cloudinary upload helpers (`fileUploader.js`, `postImageUploader.js`), email and OTP helpers.
   - `src/config` — environment-based configuration (DB, Cloudinary).

3. Where to change behavior safely
   - To change auth token location or validation rules: edit `src/middleware/authMiddleware.js` and adjust controllers that read from req.user.
   - To change upload limits or file fields: update `src/utils/fileUploader.js` and `postImageUploader.js` — routes use `parser.single('profileImage')` and `postImageParser.single('postImage')`.

4. Testing & run commands
   - Start dev server: `npm run dev` (nodemon). Production: `npm start`.
   - There are no automated tests in the repo. If you add tests, prefer `jest` + `supertest` for route-level tests.

5. Environment variables
   - Use `sample.env` as the source of truth. Key variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLOUDINARY_*`, `CLIENT_URL`, `MAX_FILE_SIZE`.

6. Common code patterns to follow
   - Controllers use async handlers — keep consistent with `express-async-handler` if present.
   - Route files mount middleware inline: e.g., `router.put('/updateProfile', authMiddleware.protect, parser.single('profileImage'), student.updateProfile)` — preserve middleware order.
   - Use request field names exactly as in routes: `profileImage`, `postImage` for multer upload handlers.

7. Integration points & external services
   - MongoDB (mongoose) — connection logic in `src/config/db.js`.
   - Cloudinary (image uploads) — configured in `src/config/cloudinary.js` and used by `multer-storage-cloudinary` in utils.
   - Email/OTP flows use `nodemailer` and the project utilities; search `mailer.js` and `generateOtp.js` for exact behavior.

8. Pull request guidance for AI agents
   - Keep changes minimal and focused: update one controller or route at a time.
   - Run lint or basic static checks locally (ensure no CommonJS vs ESM mix-ups).
   - When adding fields to models, update controllers, validation (if present), and route tests.

9. Files to inspect first when debugging a reported issue
   - `server.js`, `src/config/db.js`, `src/middleware/authMiddleware.js`, the relevant `src/controllers/*` and `src/routes/*` files.

If anything in these instructions is unclear, ask for the specific file or behavior you'd like to change.
