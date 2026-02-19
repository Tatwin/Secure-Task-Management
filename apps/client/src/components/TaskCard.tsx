import React from "react";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { Task } from "@repo/shared";
import { Button } from "./ui/Button.tsx";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, completed: boolean) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onDelete,
    onUpdateStatus,
}) => {
    const getDueDateStatus = () => {
        if (!task.dueDate || task.completed) return null;
        const now = new Date();
        const due = new Date(task.dueDate);
        const hoursLeft = differenceInHours(due, now);

        if (hoursLeft < 0) return <span className="text-red-500 font-medium">Overdue</span>;

        if (hoursLeft > 24) {
            const daysLeft = differenceInDays(due, now);
            return <span className="text-blue-500 font-medium">{daysLeft} days left</span>;
        }

        return <span className="text-orange-500 font-medium">{hoursLeft} hours left</span>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => onUpdateStatus(task.id!, !task.completed)}
                        className={`mt-1 rounded-full p-1 transition-colors ${task.completed ? "text-green-500" : "text-gray-300 hover:text-gray-400"
                            }`}
                    >
                        {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div>
                        <h3
                            className={`text-lg font-semibold ${task.completed ? "text-gray-500 line-through" : "text-gray-900"
                                }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        )}
                        {task.dueDate && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                                {!task.completed && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        {getDueDateStatus()}
                                    </>
                                )}
                            </div>
                        )}
                        {task.createdAt && (
                            <p className="mt-1 text-xs text-gray-400">
                                Created: {format(new Date(task.createdAt), "MMM d, yyyy p")}
                            </p>
                        )}
                        {task.completed && task.completedAt && (
                            <p className="mt-1 text-xs text-green-600">
                                Completed: {format(new Date(task.completedAt), "MMM d, yyyy p")}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        className="p-2 h-auto text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onDelete(task.id!)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
