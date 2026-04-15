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
