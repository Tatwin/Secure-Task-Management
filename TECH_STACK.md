# Tech Stack Rationale

This project utilizes a modern, type-safe, and high-performance tech stack designed for scalability and developer productivity.

## Frontend Stack

### **React (with Vite)**
- **Why?**: React is the industry standard for building dynamic user interfaces. Vite is used as the build tool for its lightning-fast Hot Module Replacement (HMR) and optimized build process.
- **Advantages**: Component-based architecture, huge ecosystem, and excellent performance. Vite significantly reduces development wait times compared to traditional bundlers like Webpack.
- **How to use**: Components are written in `.tsx` files inside `apps/client/src/components`. State is managed via React hooks and Context API.
- **When to use**: Use for all UI elements, client-side routing, and interactive features.

### **TypeScript**
- **Why?**: To provide static typing across the entire monorepo.
- **Advantages**: Catches errors during development, provides excellent IDE autocompletion, and makes refactoring safer.
- **How to use**: Define types/interfaces for all data structures, especially those shared between frontend and backend in `packages/shared`.
- **When to use**: Always. Every file should be `.ts` or `.tsx`.

### **Tailwind CSS**
- **Why?**: Utility-first CSS framework for rapid UI development.
- **Advantages**: No need to write custom CSS classes; highly maintainable and responsive by design. Reduces bundle size by removing unused styles.
- **How to use**: Apply utility classes directly in the `className` attribute of HTML elements.
- **When to use**: For all styling needs, layout, and responsive design.

### **Framer Motion**
- **Why?**: To add high-quality animations and transitions.
- **Advantages**: Simple declarative API for complex animations like layout transitions, gestures, and entrance effects.
- **How to use**: Wrap components with `motion.div` and provide `initial`, `animate`, and `exit` props.
- **When to use**: For page transitions, modal appearances, and interactive hover effects.

### **TanStack React Query**
- **Why?**: For efficient server-state management.
- **Advantages**: Automatic caching, background refetching, and synchronization of data between the client and server.
- **How to use**: Use the `useQuery` and `useMutation` hooks to interact with the backend API.
- **When to use**: For any data fetching, updating, or deleting operations involving the API.

---

## Backend Stack

### **Node.js & Express**
- **Why?**: A fast, unopinionated, minimalist web framework for Node.js.
- **Advantages**: Easy to set up, massive middleware ecosystem, and perfect for building RESTful APIs.
- **How to use**: Define routes in `apps/server/src/routes` and business logic in `apps/server/src/controllers`.
- **When to use**: For creating API endpoints, handling authentication, and interacting with the database.

### **Prisma (ORM)**
- **Why?**: For type-safe database access.
- **Advantages**: Auto-generated migrations, intuitive API, and seamless integration with TypeScript.
- **How to use**: Define the data model in `prisma/schema.prisma` and use `prisma.task.findMany()`, etc., in the controllers.
- **When to use**: Whenever the backend needs to read from or write to the PostgreSQL database.

### **Neon Tech (PostgreSQL)**
- **Why?**: Serverless PostgreSQL with autoscaling and branching capabilities.
- **Advantages**: Zero maintenance, instant scaling, and a generous free tier. It allows for "database branching" which is useful for testing features in isolation.
- **How to use**: Connect via a connection string in the `.env` file.
- **When to use**: Primary data storage for users, tasks, and application state.

### **JWT & Bcryptjs**
- **Why?**: For secure authentication.
- **Advantages**: JWT allows for stateless authentication (no need for sessions on the server), and Bcryptjs ensures passwords are salted and hashed safely.
- **How to use**: Generate tokens upon login, and verify them via middleware (`authMiddleware.ts`) on protected routes.
- **When to use**: For securing user data and ensuring only authorized users can access their tasks.

---

## Shared Package (`@repo/shared`)

- **Why?**: To share types and validation logic between frontend and backend.
- **Advantages**: Ensures that the data the frontend sends matches exactly what the backend expects, preventing runtime errors.
- **How to use**: Define Zod schemas and TypeScript interfaces here and import them in both `apps/client` and `apps/server`.
- **When to use**: For all DTOs (Data Transfer Objects), validation schemas, and common utility types.
