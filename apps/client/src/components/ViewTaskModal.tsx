import React from "react";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { Task } from "@repo/shared";
import { X, Calendar as CalendarIcon, Type, AlignLeft, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ViewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
    isOpen,
    onClose,
    task,
}) => {
    if (!isOpen || !task) return null;

    const getDueDateStatus = () => {
        if (!task.dueDate || task.completed) return { text: "Completed", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
        const now = new Date();
        const due = new Date(task.dueDate);
        const hoursLeft = differenceInHours(due, now);

        if (hoursLeft < 0) return { text: "Overdue", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };

        if (hoursLeft > 24) {
            const daysLeft = differenceInDays(due, now);
            return { text: `${daysLeft}d Left`, color: "var(--color-primary)", bg: "var(--color-primary-10)" };
        }

        return { text: `${hoursLeft}h Left`, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
    };

    const status = getDueDateStatus();

    const priorityColors = {
        HIGH: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
        MEDIUM: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        LOW: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    };

    const taskPriority = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.MEDIUM;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-2xl rounded-[2.5rem] border shadow-2xl relative z-[101] overflow-hidden"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                        {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Type className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                                            {task.title}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span
                                                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                                style={{
                                                    color: taskPriority.text,
                                                    backgroundColor: taskPriority.bg,
                                                    borderColor: taskPriority.bg
                                                }}
                                            >
                                                {task.priority || 'MEDIUM'} PRIORITY
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 transition-all rounded-2xl opacity-40 hover:opacity-100 bg-[var(--color-background)]"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--color-text)' }}>
                                        <AlignLeft className="w-4 h-4" />
                                        Description Details
                                    </h4>
                                    <div className="p-6 rounded-2xl border bg-[var(--color-background)]/50 font-medium leading-relaxed" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                        {task.description ? (
                                            <p>{task.description}</p>
                                        ) : (
                                            <p className="opacity-40 italic">No detailed description provided for this task.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl border bg-[var(--color-background)] border-[var(--color-border)]">
                                        <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40 mb-2" style={{ color: 'var(--color-text)' }}>
                                            <CalendarIcon className="w-3 h-3" />
                                            Due / Target Date
                                        </h4>
                                        <p className="font-bold text-sm">
                                            {task.dueDate ? format(new Date(task.dueDate), "dd MMM yyyy, HH:mm") : "No target date"}
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl border bg-[var(--color-background)]" style={{ borderColor: 'var(--color-border)' }}>
                                        <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40 mb-2" style={{ color: 'var(--color-text)' }}>
                                            <Clock className="w-3 h-3" />
                                            Time Remaining
                                        </h4>
                                        <p className="font-bold text-sm" style={{ color: status.color }}>
                                            {status.text}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all bg-[var(--color-border)]/20 hover:bg-[var(--color-border)]/40"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Close Terminal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
