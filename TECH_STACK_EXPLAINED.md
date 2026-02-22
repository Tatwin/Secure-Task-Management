# Tech Stack Explained: The "Why" and "What"

This document explains the technology choices behind the Secure Task Dashboard, why they were selected, available alternatives, and how to manage the application in different environments.

## 1. The Core Technology Stack

### **Frontend: React + Vite + TypeScript**
*   **Why used?**: React is the industry standard for building interactive user interfaces. Vite provides a lightning-fast development experience compared to older tools like Webpack. TypeScript adds static typing, preventing many common bugs before the code even runs.
*   **Alternatives**: Angular (steeper learning curve), Vue (flexible but less strict ecosystem), Svelte (simpler but smaller community).
*   **Advantages**: Huge ecosystem, component-based architecture, excellent performance, type safety.
*   **Disadvantages**: Requires initial learning curve for hooks and state management.

### **Backend: Node.js + Express**
*   **Why used?**: Node.js allows us to use JavaScript on the server, meaning one language (TypeScript) for both frontend and backend. Express is a minimalist, unopinionated framework that is easy to extend.
*   **Alternatives**: NestJS (more structured, good for large enterprise apps), Fastify (faster but different plugins), Django/Python (good for data science integration).
*   **Advantages**: Non-blocking I/O (great for real-time apps), massive package ecosystem (npm), shared language with frontend.
*   **Disadvantages**: Single-threaded (can be bottleneck for CPU-heavy tasks).

### **Database: PostgreSQL + Prisma ORM**
*   **Why used?**: PostgreSQL is the most advanced open-source relational database, known for reliability and features. Prisma is a modern ORM (Object-Relational Mapping) tool that makes interacting with the database type-safe and intuitive.
*   **Alternatives**: MongoDB (NoSQL, flexible schema but less strict relationships), MySQL (simpler but less feature-rich than Postgres), TypeORM (older standard, verbose).
*   **Advantages**: JSON support (Postgres), auto-generated types (Prisma), powerful migrations, relational integrity.
*   **Disadvantages**: Requires a running database server (hence Docker).

### **Containerization: Docker**
*   **Why used?**: Docker packages the application and its dependencies (like the database) into containers. This ensures it runs the same on your machine, my machine, and the production server.
*   **Alternatives**: Local installations (installing Postgres directly on Windows), Virtual Machines (heavier resource usage).
*   **Advantages**: "It works on my machine" becomes "It works everywhere", simplified setup (just run `docker-compose up`), isolation.
*   **Disadvantages**: Adds complexity layer, consumes system resources.

---

## 2. Why Do I Always Need Docker?

You asked: **"Why do I always need to run Docker in order to run the website?"**

**Short Answer**: You primarily need Docker to run the **PostgreSQL Database**.

**Detailed Answer**:
The application needs a place to store data (Tasks, Users). We use PostgreSQL for this. To run PostgreSQL, you have two options:
1.  **Direct Installation**: Download and install PostgreSQL on your Windows machine, configure ports, create users, and run it as a background service. This clutters your system and can be tricky to configure.
2.  **Docker (Recommended)**: Docker downloads a pre-configured PostgreSQL image and runs it in an isolated "container". This is cleaner and ensures the database version is exactly what the app expects.

**Can I run without Docker?**
Yes! If you install PostgreSQL manually on your computer or reuse a cloud database URL, you can skip running the `db` container in Docker. You would just update the `DATABASE_URL` in your `.env` file to point to your local or cloud installation.

---

## 3. Hosting & Deployment

If you want to host this platform online (e.g., Vercel, Render, Railway), here is the strategy:

### **Database (The Hard Part)**
Since Docker containers on your laptop don't run on the web easily for persistence, you need a **Managed Database**.
*   **Services**: Neon, Supabase, Railway, or AWS RDS.
*   **Action**: Create a PostgreSQL database on one of these platforms. They will give you a connection string (e.g., `postgres://user:pass@host:5432/db`).
*   **Config**: Paste this string into your production `.env` variable as `DATABASE_URL`.

### **Backend (API)**
*   **Services**: Render, Railway, Heroku.
*   **Action**: Connect your GitHub repo. Set the build command to `npm install && npx prisma generate && npm run build` and the start command to `npm start`.
*   **Config**: Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`).

### **Frontend (UI)**
*   **Services**: Vercel, Netlify.
*   **Action**: Connect your GitHub repo. Vercel automatically detects Vite.
*   **Config**: Add an environment variable `VITE_API_URL` pointing to your deployed Backend URL (e.g., `https://my-api.onrender.com`).

---

## 4. Summary of Improvements

We've enhanced the app with:
*   **Vertical Kanban Layout**: For better task prioritization (Overdue -> Ongoing -> Completed).
*   **Splash Cursor**: Interactive particle effects for a modern feel.
*   **Static Date/Time Picker**: A user-friendly calendar and clock interface (React Datepicker).
*   **Framer Motion**: Smooth entry animations for a polished UX.
