# Guild Fashion Store - Deployment Guide

This document outlines the steps to configure and deploy the Guild Fashion Store application.

## 1. Frontend Configuration (React)

The frontend uses Vite and requires environment variables to connect to the backend API.

### Local Development

**Important:** The frontend must be run on port `5176` locally, as this port is specifically configured and allowed for Google Authentication.

To start the frontend on the correct port:
```bash
cd frontend
npm run dev
```
*(Note: Ensure no other process is using port 5176, otherwise Vite will fallback to another port like 5177, which will cause Google Auth to fail).*

Create a file named `.env` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000
```

### Production Deployment
When deploying to services like Vercel, Netlify, or AWS Amplify, set the following **Environment Variables** in the project settings:

-   `VITE_API_URL`: The full URL of your live backend API (e.g., `https://api.yourdomain.com/api`).
-   `VITE_MEDIA_URL`: The root URL of your backend server where media files are hosted (e.g., `https://api.yourdomain.com`).

> **Note**: Do not commit `.env` files to version control if they contain sensitive secrets. For the frontend, these variables are exposed to the browser, so they are safe to be public URLs.

## 2. Backend Configuration (Django)

The backend requires environment variables for database connection, security, and debugging.

### Local Development
Create a file named `.env` in the `backend/` directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-for-dev
DATABASE_URL=postgres://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Production Deployment
When deploying to services like Heroku, Railway, or AWS, set the following **Environment Variables**:

-   `DEBUG`: Set to `False` in production.
-   `SECRET_KEY`: A long, random string. Keep this secret!
-   `DATABASE_URL`: Your production database connection string.
-   `ALLOWED_HOSTS`: Comma-separated list of domains your backend is served from (e.g., `api.yourdomain.com`).
-   `CORS_ALLOWED_ORIGINS`: Comma-separated list of frontend domains allowed to access the API (e.g., `https://www.yourdomain.com`).

## 3. Deployment Steps

1.  **Backend**:
    -   Deploy the Django app.
    -   Run migrations: `python manage.py migrate`.
    -   Collect static files: `python manage.py collectstatic`.
    -   Ensure media files are served correctly (e.g., using S3 or WhiteNoise).

2.  **Frontend**:
    -   Build the project: `npm run build`.
    -   Serve the `dist/` folder.
    -   Ensure the build process has access to the `VITE_` environment variables.
