# Frontend

React + Vite client for the User Management System.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

3. Start dev server:

```bash
npm run dev
```

## Production Deployment (Vercel)

1. Import repository into Vercel.
2. Set Root Directory to `frontend`.
3. Set Build Command to `npm run build`.
4. Set Output Directory to `dist`.
5. Add environment variable:

```env
VITE_API_URL=https://your-backend-domain/api/v1
```

6. Redeploy after any environment changes.
