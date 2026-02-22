# Project Flow Documentation

This document explains how data and control flow through the Secure Task Management application from the User Interface to the Database.

## 1. Authentication Flow

1.  **Signup/Login**:
    - The user enters credentials on the `RegisterPage` or `LoginPage`.
    - `react-hook-form` and `Zod` validate the input on the client side.
    - An Axios request is sent to `/api/auth/register` or `/api/auth/login`.
    - The backend hashes the password (using `bcryptjs`) or verifies the existing hash.
    - A **JWT (JSON Web Token)** is generated and sent back to the client, typically stored in an HTTP-only cookie or local storage.
    - The `AuthContext` updates the `isAuthenticated` state, granting access to the Dashboard.

2.  **Protected Routes**:
    - The `App.tsx` wraps the Dashboard in a `ProtectedRoute` component.
    - This component checks the `AuthContext`. If the user is not authenticated, they are redirected to `/login`.

## 2. Task Management Flow (CRUD)

1.  **Reading Tasks (GET)**:
    - Upon loading the Dashboard, the `useTasks` hook triggers a TanStack Query.
    - It calls `GET /api/tasks`.
    - The backend `authMiddleware` verifies the JWT.
    - If valid, the `taskController` uses Prisma to fetch tasks from the **Neon PostgreSQL** database filtered by the `userId`.
    - The tasks are returned to the frontend, cached by TanStack Query, and displayed via `TaskCard` components.

2.  **Creating a Task (POST)**:
    - User clicks "New Task" and fills out the `CreateTaskModal`.
    - `handleCreateTask` calls the `createTask` mutation in `useTasks`.
    - A `POST /api/tasks` request is sent with the task details.
    - The backend validates the payload using Zod.
    - Prisma creates a new record in the database.
    - On success, TanStack Query invalidates the `tasks` cache, causing an automatic background refetch to update the UI.

3.  **Updating/Deleting (PATCH/DELETE)**:
    - Similar to creation, specific buttons on the `TaskCard` trigger mutations.
    - The backend ensures the user requesting the change is the owner of the task before performing the database operation.

## 3. Theming & Personalization Flow

1.  **Theme Selection**:
    - In `Settings`, users can toggle between Light and Dark mode or pick a "Neural Palette" (primary color).
    - The `ThemeContext` updates CSS variables (e.g., `--color-primary`, `--color-background`) globally.
    - These changes are persisted (e.g., in LocalStorage) so the dashboard looks the same upon return.

## 4. Frontend-Backend Synchronization

- **Monorepo Structure**: The `packages/shared` folder ensures that if a field name changes in the database (via Prisma), the TypeScript compiler will immediately flag errors in both the server (controllers) and the client (API calls), ensuring perfect synchronization.

## 5. Deployment Architecture

- **Frontend**: Hosted on Vercel as a static site (Vite build).
- **Backend**: Hosted on Vercel as Serverless Functions or a persistent Node.js instance (depending on configuration).
- **Database**: Hosted on Neon Tech, connected via a secure SSL connection string.
