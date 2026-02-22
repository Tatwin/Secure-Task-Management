# Code Reference & Important Keywords

This file provides a quick reference for the core React hooks, headers, and specific keywords used throughout the codebase.

## Core React Hooks

### 1. Custom Application Hooks
- **`useAuth()`**:
    - **Purpose**: Accesses global authentication state (user info, login/logout functions).
    - **Location**: `apps/client/src/context/AuthContext.tsx`.
- **`useTasks()`**:
    - **Purpose**: Encapsulates all TanStack Query logic for tasks (fetching, creating, deleting).
    - **Location**: `apps/client/src/hooks/useTasks.ts`.
- **`useTheme()`**:
    - **Purpose**: Controls the visual interface (mode, primary color palette).
    - **Location**: `apps/client/src/context/ThemeContext.tsx`.

### 2. Standard React Hooks
- **`useState()`**: Used for local component state (e.g., whether a modal is open).
- **`useEffect()`**: Used for side effects, like setting up timers or syncing state with LocalStorage.
- **`useMemo()`**: Used to optimize calculations (e.g., sorting tasks by priority) so they don't run on every render.
- **`useNavigate()`**: From `react-router-dom` to programmatically change pages.

---

## Important Keywords & Concepts

### **Zod Schemas**
- Used for "Schema Validation". In `packages/shared`, you will see keywords like `z.object()`, `z.string().email()`. This ensures data integrity before it even reaches the database.

### **Prisma Keywords**
- **`model`**: Defines a database table in `schema.prisma`.
- **`@id` / `@default(uuid())`**: Primary key configuration.
- **`@relation`**: Defines foreign key relationships between Users and Tasks.

### **Middleware**
- **`authMiddleware`**: A function that runs before the actual API logic to check if a valid JWT is present in the request headers.

### **Framer Motion Keywords**
- **`initial`**: The starting state of an animation.
- **`animate`**: The target state of an animation.
- **`exit`**: The state of an animation when a component is removed from the DOM (requires `AnimatePresence`).
- **`layoutId`**: Used for "Magic Move" animations where elements morph smoothly between different positions.

---

## Request/Response Headers

- **`Authorization`**: `Bearer <token>` - Used to send the JWT from the client to the server.
- **`Content-Type`**: `application/json` - Tells the server the body of the request is in JSON format.
- **`Set-Cookie`**: Used by the server to store tokens securely in the user's browser (if utilizing cookie-based auth).

## Technical Glossary

- **UUID**: Universally Unique Identifier. Used for database IDs to prevent guessing of resource URLs.
- **DTO (Data Transfer Object)**: Objects that define the structure of data sent over the network (defined in `packages/shared`).
- **HMR (Hot Module Replacement)**: Vite's ability to update only the changed part of the code without refreshing the entire page.
- **CORS (Cross-Origin Resource Sharing)**: Security feature handled on the backend to allow the frontend (on one domain) to talk to the backend (on another domain).
