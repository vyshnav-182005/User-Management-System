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

Use this split deployment approach:

- Frontend: Vercel
- Backend API: Render (or Railway/Fly)
- Database: MongoDB Atlas

### 1) Deploy Backend (Render)

1. Push this repository to GitHub.
2. In Render, create a new **Web Service** from the backend folder.
3. Configure:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
4. Add backend environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI=<your atlas connection string>`
  - `CORS_ORIGIN=<your vercel frontend url>`
  - `JWT_ACCESS_SECRET=<strong secret>`
  - `JWT_ACCESS_EXPIRES_IN=15m`
  - `JWT_REFRESH_SECRET=<strong refresh secret>`
  - `JWT_REFRESH_EXPIRES_IN=7d`
  - `BCRYPT_SALT_ROUNDS=12`
  - `COOKIE_SAME_SITE=none`
  - `COOKIE_SECURE=true`
  - Optional: `COOKIE_DOMAIN=`
  - Optional bootstrap admin: `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
5. Deploy and copy the backend URL, for example: `https://your-api.onrender.com/api/v1`

### 2) Update Atlas Network Access

1. In MongoDB Atlas, open **Network Access**.
2. Add Render outbound IP(s), or allow `0.0.0.0/0` temporarily for testing.
3. Ensure your database user credentials in `MONGO_URI` are correct.

### 3) Deploy Frontend (Vercel)

1. In Vercel, import the same repository.
2. Configure:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
3. Add frontend environment variable:
  - `VITE_API_URL=<your backend api url>/api/v1`
4. Deploy and copy the frontend URL.

### 4) Final CORS Check

Set backend `CORS_ORIGIN` to include your frontend domain.

- Single origin example: `https://your-app.vercel.app`
- Multiple origins example: `https://your-app.vercel.app,http://localhost:5173`

### 5) Smoke Test

1. Open frontend URL and login.
2. Verify Dashboard/Profile loads.
3. Verify Users page works for admin/manager role.
4. Verify refresh flow by waiting for access token expiry and retrying an API call.
