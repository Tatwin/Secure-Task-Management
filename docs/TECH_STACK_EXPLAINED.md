# Technology Stack & Rationale

This document details the technologies chosen for this project and why they are superior to alternatives for this specific use case.

## 1. Frontend: React + Vite + Tailwind CSS

### Why React?
- **Component-Based**: Perfect for a dashboard with reusable elements like task cards and modals.
- **Ecosystem**: Large library support for UI animations (Framer Motion) and data fetching (React Query).
- **Alternative (Angular/Vue)**: Angular is too heavy for this dashboard; React offers more flexibility with styling.

### Why Vite?
- **Speed**: Significantly faster startup and HMR (Hot Module Replacement) than Create React App (Webpack).
- **Modern**: Optimized for ES Modules.

### Why Tailwind CSS?
- **Utility-First**: Allows for extremely fast styling without writing custom CSS classes.
- **Glassmorphism**: Tailwind's backdrop-filter utilities made implementing the "glass" look easy and consistent.
- **Alternative (Bootstrap)**: Bootstrap feels dated and "generic." Tailwind allows for a premium, custom design.

## 2. Backend: Node.js (Express) + TypeScript

### Why Express?
- **Lightweight**: Minimalist framework that provides exactly what is needed for a REST API without unnecessary bloat.
- **TypeScript Integration**: Excellent support for type-safe middleware and controllers.
- **Alternative (Python/Django)**: Django is great but has a lot of "magic" under the hood. Express gives full control over the request/response flow.

### Why TypeScript?
- **Reliability**: Catches errors during development (e.g., passing a string where a number is expected).
- **Shared Types**: We use a `shared` package so the frontend knows exactly what the backend API will return.

## 3. Database: PostgreSQL + Prisma ORM

### Why PostgreSQL?
- **Reliability**: A robust, industrial-grade relational database.
- **Structured Data**: Perfect for tasks which have clear relationships (User -> Tasks).
- **Alternative (MongoDB)**: While NoSQL is flexible, relational integrity (ensuring a task always belongs to a user) is better handled by SQL.

### Why Prisma?
- **Auto-Completion**: Provides full IDE IntelliSense for database queries.
- **Migrations**: Handles database schema changes automatically.
- **Alternative (TypeORM)**: Prisma is much simpler to set up and provides a cleaner "Prisma Client" API.
