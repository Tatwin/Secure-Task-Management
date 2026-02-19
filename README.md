# Secure Task Management Dashboard

A full-stack implementation of a secure task management dashboard, built with modern web technologies and best practices.

## 🚀 Tech Stack

### Frontend (`apps/client`)
- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Framer Motion (Glassmorphism UI)
- **State Management**: React Query (TanStack Query v5) + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Type Safety**: Shared types with backend via Monorepo

### Backend (`apps/server`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (via Docker) + Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt
- **Validation**: Zod (Shared Schemas)
- **Documentation**: Swagger UI

### Infrastructure
- **Monorepo**: NPM Workspaces
- **Containerization**: Docker Compose (PostgreSQL)

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 1. Clone & Install
```bash
git clone <repository-url>
cd secure-task-dashboard
npm install
```

### 2. Environment Variables
Create `.env` files in `apps/server` and `apps/client` based on `.env.example`.

**apps/server/.env**
```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/taskdb?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=3000
```

### 3. Start Database
```bash
docker-compose up -d
```
This starts a PostgreSQL instance on port 5432.

### 4. Database Migration
Initialize the database schema:
```bash
# In root directory
npx prisma migrate dev --name init --schema=apps/server/prisma/schema.prisma
```

### 5. Build Shared Package
Build the shared types package to ensure it's available for client and server:
```bash
npm run build --workspace=@repo/shared
```

### 6. Run Application
Start both frontend and backend in development mode:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs

---

## 🏗️ Architecture

The project follows a Monorepo structure:

```
secure-task-dashboard/
├── apps/
│   ├── client/       # React Frontend
│   └── server/       # Express Backend
├── packages/
│   └── shared/       # Shared Zod schemas & types
├── docker-compose.yml
└── package.json
```

### Key Features
- **Type Safety**: Zod schemas in `packages/shared` are used for:
  - Backend request validation.
  - Frontend form validation.
  - TypeScript type inference (single source of truth).
- **Security**:
  - HTTP-only cookies (optional configuration) or Secure LocalStorage for JWT.
  - Protected Routes (Middleware verifies Bearer token).
  - Password Hashing with Bcrypt.
- **Performance**:
  - React Query for efficient data fetching, caching, and optimistic updates.
  - Tailwind CSS for minimal CSS bundle size.

## 🧪 API Documentation

The API is fully documented using Swagger/OpenAPI.
After starting the server, visit: **http://localhost:3000/api-docs**

### Endpoints
- **Auth**:
  - `POST /auth/register` - Create account
  - `POST /auth/login` - Authenticate
- **Tasks**:
  - `GET /tasks` - List user tasks
  - `POST /tasks` - Create task
  - `PATCH /tasks/:id` - Update task
  - `DELETE /tasks/:id` - Delete task

---

## ✅ Deliverables Checklist
- [x] Monorepo Setup
- [x] Strict TypeScript
- [x] Dockerized PostgreSQL
- [x] JWT Authentication
- [x] Swagger Documentation
- [x] React Query Implementation
- [x] Glassmorphism UI
