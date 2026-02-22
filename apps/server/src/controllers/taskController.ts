import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { CreateTaskSchema, UpdateTaskSchema } from "@repo/shared";

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const getTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: [
                { completed: "asc" },
                { dueDate: "asc" },
                { priority: "desc" },
                { createdAt: "desc" },
            ],
        });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const data = CreateTaskSchema.parse(req.body);

        if (data.dueDate) {
            const dueDate = new Date(data.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate.getTime() < today.getTime() - 3600000) {
                return res.status(400).json({ message: "Due date cannot be in the past" });
            }
        }

        const task = await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        console.error("Create Task Error:", error);
        next(error);
    }
};

export const updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const data = UpdateTaskSchema.parse(req.body);

        if (data.completed === true) {
            (data as any).completedAt = new Date();
        } else if (data.completed === false) {
            (data as any).completedAt = null;
        }

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data,
        });

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await prisma.task.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
