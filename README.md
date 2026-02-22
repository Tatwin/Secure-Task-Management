# Secure Task Dashboard

A full-stack task management application with secure authentication and a modern dashboard.

**Live Demo:** [https://vitask-project.vercel.app](https://vitask-project.vercel.app)

## Features

- **User Authentication**: Secure signup and login using JWT and encrypted passwords.
- **Task Management**: Create, update, view, and delete tasks with ease.
- **Modern UI**: Clean and responsive dashboard built with React and Tailwind CSS.
- **Type Safety**: Built entirely with TypeScript for better code quality and reliability.
- **API Documentation**: Automated documentation via Swagger.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- TanStack Query (React Query)
- React Router

### Backend
- Node.js (Express)
- Prisma (PostgreSQL)
- Zod (Validation)
- JWT (Auth)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `apps/server` directory and configure your environment variables (refer to `.env.example`).

3. **Database Migration**:
   Apply database migrations to your local PostgreSQL instance:
   ```bash
   npx prisma migrate dev --schema=apps/server/prisma/schema.prisma
   ```

4. **Shared Types**:
   Build the shared package:
   ```bash
   npm run build --workspace=@repo/shared
   ```

5. **Run the App**:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, you can view the API documentation at: `https://vitask-project.vercel.app/api-docs` as we have hosted the website.
