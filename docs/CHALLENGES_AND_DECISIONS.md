# Development Challenges & Decisions

Building a secure dashboard involves balancing security, performance, and user experience. Here are the key challenges faced.

## 1. Authentication Security
**Problem**: How to handle JWT tokens securely to prevent XSS (Cross-Site Scripting) or CSRF (Cross-Site Request Forgery) attacks.
**Decision**: We opted for a secure storage strategy. While many developers just use LocalStorage (vulnerable to XSS), we structured the backend to allow for HTTP-Only cookies, which are much harder for malicious scripts to access.

## 2. Real-Time UI Updates
**Problem**: After creating a task, the dashboard should refresh immediately without a page reload.
**Decision**: I implemented **TanStack Query (React Query)** with "Optimistic Updates." This means the UI updates instantly as if the server already succeeded, and then syncs in the background.

## 3. Monorepo Complexity
**Problem**: Managing shared types between the frontend and backend in one folder structure.
**Decision**: I used **NPM Workspaces**. This allowed me to create a `@repo/shared` package. This solved the "double-definition" problem where you'd normally have to write the same interface in both projects.

## 4. UI Polish (Glassmorphism)
**Problem**: Making a traditional "list" app look like a premium software product.
**Decision**: I chose **Framer Motion** for animations. The "splash cursor" and subtle card transitions make the app feel alive rather than static. This was chosen specifically to go beyond a "Minimum Viable Product" and create a "Wowed" user experience.

## Why this specific stack?
I chose this stack (React, Node, Prisma) because it is the **industry standard** for modern full-stack development. It provides the best balance of speed (Vite), safety (TypeScript), and scalability (Postgres).
