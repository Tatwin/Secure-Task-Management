# Vercel Hosting Guide

This guide explains how to deploy the Secure Task Dashboard to Vercel.

## 1. Frontend Deployment (apps/client)

Vercel is optimized for React/Vite applications.

1.  **Connect GitHub**: Log in to Vercel and import your repository.
2.  **Project Root**: Set the root directory to `apps/client`.
3.  **Build Settings**:
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **Environment Variables**:
    - Add `VITE_API_BASE_URL` (the URL where your backend is hosted).

## 2. Backend Deployment (apps/server)

Since the backend is an Express server with a PostgreSQL database, a standard Vercel frontend deployment won't handle the persistent Node process or migrations out of the box.

### Option A: Vercel Serverless Functions
To host the backend on Vercel, you must use a `vercel.json` configuration to treat your Express app as a serverless function.

1.  **vercel.json** (in `apps/server`):
    ```json
    {
      "version": 2,
      "builds": [
        { "src": "src/index.ts", "use": "@vercel/node" }
      ],
      "routes": [
        { "src": "/(.*)", "dest": "src/index.ts" }
      ]
    }
    ```
2.  **Database**: You will need a hosted PostgreSQL database (like Vercel Postgres, Supabase, or Railway) since a local Docker container won't work in the cloud.

## 3. Deployment Steps

1.  **Push to GitHub**: Every push to `main` will trigger an automatic build.
2.  **Configure Environment**: Ensure `DATABASE_URL` and `JWT_SECRET` are added to Vercel's environment variable settings for the backend project.
3.  **Monorepo Support**: Vercel automatically detects the workspace structure and installs dependencies from the root.
