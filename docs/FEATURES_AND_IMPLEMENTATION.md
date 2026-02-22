# Features & Code Implementation

This document explains the core features and the specific code keywords and logic that make them work.

## 1. Secure Authentication
- **Hashing**: We use `bcrypt` to hash passwords before saving them. Even if the database is leaked, user passwords remain safe. 
- **Keywords**: `jwt.sign()`, `bcrypt.hash()`, `authMiddleware`.
- **How it works**: When a user logs in, the server generates a token (`JWT`). This token is then sent with every request in the `Authorization` header. The `authMiddleware` on the backend decodes this token to identify the user.

## 2. Task CRUD Logic
- **CRUD** stands for Create, Read, Update, and Delete.
- **Workflow**: 
  - `GET /tasks`: Uses Prisma's `findMany()` to fetch user-specific tasks.
  - `POST /tasks`: Uses `create()` to add a new task with the user's ID as a foreign key.
  - `PATCH /tasks/:id`: Uses `update()` to toggle completion or edit text.
- **Keywords**: `prisma.task.create`, `taskSchema.parse` (Zod validation).

## 3. Data Validation
- **Logic**: We never trust user input. Before anything touches the database, it must pass through **Zod**.
- **Keyword**: `const schema = z.object({ ... })`.
- **How it works**: If a user tries to send an empty task title, Zod catches it instantly and returns a clear error message to the frontend, preventing database crashes.

## 4. Glassmorphism & Animations
- **Visuals**: Used `backdrop-blur` and `bg-white/10` in Tailwind CSS.
- **Micro-interactions**: Subtle hover effects and modal transitions.
- **Keyword**: `<motion.div>`, `initial`, `animate`, `whileHover`.
- **How it works**: These keywords from Framer Motion define how components enter the screen (e.g., sliding up) and how they react when a user moves their mouse over them.

## 5. Global State & API Sync
- **Logic**: The app needs to know if a user is logged in across all pages.
- **Keyword**: `useContext`, `useQuery`, `useMutation`.
- **How it works**: `AuthContext` holds the user's state. `useQuery` from React Query handles the background fetching of tasks and manages the "loading..." states automatically.
