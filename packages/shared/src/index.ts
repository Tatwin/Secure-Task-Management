import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6),
    recoveryPin: z.string().length(4, "PIN must be 4 digits").regex(/^\d+$/, "PIN must be numeric"),
    createdAt: z.date().optional(),
});

export const RegisterSchema = UserSchema.omit({ id: true, createdAt: true });

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    recoveryPin: z.string().length(4),
    newPassword: z.string().min(6),
});

export const PriorityValues = ["LOW", "MEDIUM", "HIGH"] as const;
export const PrioritySchema = z.enum(PriorityValues);

export const TaskSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    completedAt: z.union([z.string(), z.date()]).optional(),
    dueDate: z.string().or(z.date()).optional(), // Accept string for API JSON
    priority: PrioritySchema.default("MEDIUM"),
    userId: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: PrioritySchema.default("MEDIUM"),
    dueDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        return arg;
    }, z.date().optional().refine((date) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Allow a 1-hour buffer for clock drift
        return date.getTime() >= today.getTime() - 3600000;
    }, { message: "Due date cannot be in the past" })),
});

export const UpdateTaskSchema = TaskSchema.partial();

export type Priority = z.infer<typeof PrioritySchema>;
export type User = z.infer<typeof UserSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;
