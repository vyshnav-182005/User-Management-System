# User Management System (MERN)

Production-ready monorepo setup for a role-based User Management System.

## Repository Structure

```text
User-Management-System/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      validators/
    .env.example
    package.json
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      layouts/
      pages/
      styles/
    .env.example
    package.json
    vite.config.js

## MongoDB Integration Status

- Backend is connected through Mongoose using `MONGO_URI`.
- A local environment file is included at `backend/.env` for immediate development use.
- If `ADMIN_EMAIL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set, a bootstrap admin account is auto-created on server start.
    src/
```

## Backend Features

- JWT authentication (access token + optional refresh token)
- Password hashing with bcrypt
- RBAC with roles: `ADMIN`, `MANAGER`, `USER`
- Protected routes
- Paginated users list with search and filters
- Audit fields: `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Input validation with `express-validator`
- Centralized error handling

## Backend Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables:

```bash
# If needed, copy from .env.example and then update values
```

3. Start in development mode:

```bash
npm run dev
```

Server default URL: `http://localhost:5000`

## Frontend Features

- React with hooks
- Role-based routing and rendering
- Protected routes with auth context
- Login, Dashboard, Profile, and Users pages
- Admin/Manager user list with pagination, search, role/status filters

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Configure frontend environment variables:

```bash
# .env is already added for local development
# VITE_API_URL=http://localhost:5000/api/v1
```

3. Start frontend in development mode:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Run Full Stack Locally

1. Start backend in terminal 1:

```bash
cd backend
npm run dev
```

2. Start frontend in terminal 2:

```bash
cd frontend
npm run dev
```

3. Login using bootstrap admin from `backend/.env`:

- Login ID: `admin@example.com` or `superadmin`
- Password: `Admin12345!`

## API Overview

Base path: `/api/v1`

### Auth

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Users

- `GET /users/me`
- `PATCH /users/me`
- `GET /users` (Admin, Manager)
- `POST /users` (Admin)
- `PATCH /users/:id` (Admin, Manager)
- `DELETE /users/:id` (Admin)

## Notes

- Refresh token is optional: if `JWT_REFRESH_SECRET` is omitted, only access tokens are issued.
- Admin bootstrap user is optional and controlled by `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
- In production, replace local JWT secrets and admin password with strong secure values.

## Deployment Guide

Use this deployment approach:

- Frontend: Vercel
- Backend API (serverless): Vercel
- Database: MongoDB Atlas

### 1) Deploy Backend (Vercel)

1. Push this repository to GitHub.
2. In Vercel, create/import a project for the backend.
3. Configure backend project settings:
  - Root Directory: `backend`
  - Framework Preset: `Other`
  - `vercel.json` is already configured to route traffic to `api/index.js`.
4. Add backend environment variables in **Settings -> Environment Variables**:
  - `NODE_ENV=production`
  - `MONGO_URI=<your atlas connection string>`
    - Supported fallback: `MONGODB_URI`
  - `CORS_ORIGIN=<your frontend vercel url with https://>`
  - `JWT_ACCESS_SECRET=<strong secret>`
    - Supported fallback: `JWT_SECRET`
  - `JWT_ACCESS_EXPIRES_IN=15m`
  - `JWT_REFRESH_SECRET=<strong refresh secret>`
  - `JWT_REFRESH_EXPIRES_IN=7d`
  - `BCRYPT_SALT_ROUNDS=12`
  - `COOKIE_SAME_SITE=none`
  - `COOKIE_SECURE=true`
  - Optional: `COOKIE_DOMAIN=`
  - Optional bootstrap admin: `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
5. Redeploy after adding/changing environment variables (Vercel applies env vars on new deployments).

### 2) Update Atlas Network Access

1. In MongoDB Atlas, open **Network Access**.
2. Allow connections from Vercel runtime:
  - For easiest setup: add `0.0.0.0/0`.
  - For stricter setups, use fixed egress options and allowlist those addresses.
3. Verify your Atlas database user credentials in the Mongo URI.

### 3) Verify Backend URLs

After deploy, check:

- Root: `https://user-management-sys-git-d55516-vyshnavkumars2005-9024s-projects.vercel.app/` (API info response)
- Health: `https://user-management-sys-git-d55516-vyshnavkumars2005-9024s-projects.vercel.app/health`
- API base: `https://user-management-sys-git-d55516-vyshnavkumars2005-9024s-projects.vercel.app/api/v1`

### 4) Deploy Frontend (Vercel)

1. In Vercel, create/import a project for the frontend.
2. Configure:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
3. Add frontend environment variable:
  - `VITE_API_URL=https://user-management-sys-git-d55516-vyshnavkumars2005-9024s-projects.vercel.app/api/v1`
4. Redeploy frontend after setting/changing env vars.

### 5) Final CORS Check

Set backend `CORS_ORIGIN` with protocol included.

- Single origin example: `user-management-system-silk-psi.vercel.app`
- Multiple origins example: `user-management-system-silk-psi.vercel.app,http://localhost:5173`

### 6) Smoke Test

1. Open frontend URL and login.
2. Verify Dashboard/Profile loads.
3. Verify Users page works for admin/manager role.
4. Verify refresh flow by waiting for access token expiry and retrying an API call.

## Troubleshooting (Deployment)

- `Missing required environment variable(s)`:
  - Add variables in the correct Vercel project and correct environment (Production/Preview).
  - Redeploy after saving variables.
- `Could not connect to any servers in your MongoDB Atlas cluster`:
  - Check Atlas Network Access allowlist.
  - Confirm URI credentials and database user permissions.
- `Route not found`:
  - Use `/api/v1/...` routes for API endpoints.
  - Ensure frontend `VITE_API_URL` ends with `/api/v1`.
