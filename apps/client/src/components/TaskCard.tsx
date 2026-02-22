import React from "react";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { Task } from "@repo/shared";
import { Trash2, CheckCircle2, Circle, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, completed: boolean) => void;
    onView?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onDelete,
    onUpdateStatus,
    onView,
}) => {
    const getDueDateStatus = () => {
        if (!task.dueDate || task.completed) return null;
        const now = new Date();
        const due = new Date(task.dueDate);
        const hoursLeft = differenceInHours(due, now);

        if (hoursLeft < 0) return <span className="text-red-500 font-black uppercase tracking-widest text-[10px]">Overdue</span>;

        if (hoursLeft > 24) {
            const daysLeft = differenceInDays(due, now);
            return <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-primary)' }}>{daysLeft}D Left</span>;
        }

        return <span className="text-orange-500 font-black uppercase tracking-widest text-[10px]">{hoursLeft}H Left</span>;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group rounded-[2rem] p-6 transition-all duration-300 border relative overflow-hidden shadow-xl"
            style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
            }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'var(--color-primary)' }} />

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <button
                            onClick={() => onUpdateStatus(task.id!, !task.completed)}
                            className={`mt-1 transition-all duration-300 p-0.5 rounded-full ${task.completed
                                ? "scale-110 opacity-100"
                                : "opacity-40 hover:opacity-100"
                                }`}
                            style={{ color: task.completed ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                        >
                            {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-black tracking-tight leading-tight transition-all duration-300 ${task.completed ? "opacity-40 line-through" : ""
                                }`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className="mt-1 text-xs opacity-60 font-medium line-clamp-2 leading-relaxed">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-[var(--color-primary)]/10 rounded-xl transition-all" onClick={onView}>
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t space-y-4" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 opacity-40">
                                <Calendar className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    {task.dueDate ? format(new Date(task.dueDate), "dd MMM yy") : "No Date"}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: 'var(--color-text)' }} />
                            {getDueDateStatus()}
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border"
                                style={{
                                    color: task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981',
                                    borderColor: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                    backgroundColor: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.05)' : task.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)'
                                }}
                            >
                                {task.priority || 'MEDIUM'}
                            </span>
                            <button
                                onClick={() => onDelete(task.id!)}
                                className="p-2 transition-all opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
