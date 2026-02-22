import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@repo/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
        },
    },
    optimizeDeps: {
        include: ["@repo/shared"],
    },
    build: {
        commonjsOptions: {
            include: [/@repo\/shared/, /node_modules/],
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
})
