import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        const count = await prisma.task.count();
        console.log("Task count:", count);
        const users = await prisma.user.findMany({ take: 1 });
        console.log("Sample user ID:", users[0]?.id);
    } catch (e) {
        console.error("Database connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
