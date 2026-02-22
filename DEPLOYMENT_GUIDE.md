# Deployment & Hosting Guide

This guide explains how to manage the code on GitHub and how the frontend and backend are hosted on Vercel and Neon Tech.

## 1. GitHub Integration

### How to push code to GitHub:
1.  **Initialize Git** (if not already done):
    ```bash
    git init
    ```
2.  **Add all files**:
    ```bash
    git add .
    ```
3.  **Commit changes**:
    ```bash
    git commit -m "Initialize/Update Secure Task Dashboard"
    ```
4.  **Link to Remote Repository**:
    - Create a repository on GitHub.
    - Copy the remote URL and run:
    ```bash
    git remote add origin https://github.com/your-username/repository-name.git
    ```
5.  **Push**:
    ```bash
    git push -u origin main
    ```

---

## 2. Vercel Hosting (Separated Frontend & Backend)

The project is hosted on Vercel using two separate deployments for maximum performance and separation of concerns.

### **Frontend Hosting (Client)**:
- **How**: Connect your GitHub repository to Vercel and select the `apps/client` folder as the root.
- **Framework Preset**: Vite.
- **Build Command**: `npm run build`.
- **Output Directory**: `dist`.
- **Environment Variables**: Add `VITE_API_URL` pointing to your backend deployment URL.

### **Backend Hosting (API)**:
- **How**: Create a second project on Vercel and point it to the `apps/server` (or the root if using monorepo detection).
- **Vercel Functions**: The backend runs as "Serverless Functions". Vercel automatically detects the Express app if configured correctly in `vercel.json`.
- **Environment Variables**: Add `DATABASE_URL` (from Neon Tech) and `JWT_SECRET`.

### **Why Separate?**:
- **Scalability**: You can scale the frontend (CDN) and backend (Compute) independently.
- **Security**: The backend can have strict CORS rules that only allow requests from your specific frontend domain.

---

## 3. Database Hosting (Neon Tech)

### **Why Neon Tech?**:
1.  **Serverless Postgres**: Unlike traditional databases, Neon scales to zero when not in use, saving costs.
2.  **Branching**: You can create a "development branch" of your database. This allows you to test new Prisma migrations without affecting your live production data.
3.  **Performance**: It uses a specialized storage engine that is optimized for cloud environments.

### **How to use Neon**:
1.  Create a project on [Neon.tech](https://neon.tech).
2.  Copy the connection string (starting with `postgresql://`).
3.  Paste it into the `DATABASE_URL` variable in your Vercel Backend settings.

---

## 4. Alternatives to this Setup

If you wanted to host this elsewhere, here are common alternatives:

| Component | Alternative 1 (Cloud) | Alternative 2 (Self-Hosted) |
| :--- | :--- | :--- |
| **Frontend** | Netlify / AWS Amplify | Nginx on a VPS |
| **Backend** | Railway / Render | PM2 on a DigitalOcean Droplet |
| **Database** | Supabase / AWS RDS | Local PostgreSQL / Docker |

**Why the current setup is better for this project**: Vercel + Neon offers the fastest deployment pipeline (CI/CD) where every "Git Push" automatically updates your live website and API without any manual server maintenance.
