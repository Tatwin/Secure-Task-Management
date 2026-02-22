import React, { useState, useMemo } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
} from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@repo/shared';

interface CalendarViewProps {
    tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const tasksByDay = useMemo(() => {
        const map: Record<string, Task[]> = {};
        tasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
                if (!map[dateKey]) map[dateKey] = [];
                map[dateKey].push(task);
            }
        });
        return map;
    }, [tasks]);

    const priorityColors = {
        HIGH: '#ef4444',
        MEDIUM: '#f59e0b',
        LOW: '#10b981',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-3xl md:rounded-[2rem] border bg-[var(--color-surface)] shadow-xl gap-6 md:gap-0" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-[var(--color-primary)] bg-[var(--color-primary)]/10 shrink-0">
                        <CalendarIcon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 mt-1">Standard Temporal View</p>
                    </div>
                </div>
                <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
                    <button
                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                        className="p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all hover:bg-[var(--color-primary)] hover:text-white group flex items-center justify-center"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-white transition-all text-center"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                        className="p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all hover:bg-[var(--color-primary)] hover:text-white group flex items-center justify-center"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="rounded-3xl md:rounded-[2.5rem] border overflow-hidden bg-[var(--color-surface)] shadow-2xl relative" style={{ borderColor: 'var(--color-border)' }}>
                {/* Mobile scroll indicator */}
                <div className="md:hidden absolute top-0 left-0 right-0 py-2 text-center text-[8px] font-bold uppercase tracking-widest bg-gradient-to-b from-[var(--color-surface)] to-transparent z-10 opacity-50 pointer-events-none">
                    Swipe to explore
                </div>
                <div className="overflow-x-auto custom-scrollbar pb-2 relative z-0">
                    <div className="min-w-[500px] md:min-w-0">
                        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-4 md:py-6 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-40">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {days.map((day) => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const dayTasks = tasksByDay[dateKey] || [];
                                const isToday = isSameDay(day, new Date());
                                const isCurrentMonth = isSameMonth(day, monthStart);

                                return (
                                    <div
                                        key={day.toString()}
                                        className={`min-h-[100px] md:min-h-[160px] p-2 md:p-4 border-r border-b relative transition-all duration-300 ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'
                                            }`}
                                        style={{ borderColor: 'var(--color-border)' }}
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-2 md:mb-4 gap-1 md:gap-0">
                                            <span className={`text-[10px] md:text-sm font-black ${isToday
                                                ? 'w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white shadow-lg'
                                                : 'opacity-40'
                                                }`}>
                                                {format(day, 'd')}
                                            </span>
                                            {dayTasks.length > 0 && (
                                                <span className="text-[7px] md:text-[9px] font-black opacity-40 uppercase hidden sm:block">
                                                    {dayTasks.length} {dayTasks.length === 1 ? 'Task' : 'Tasks'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 overflow-y-auto max-h-[50px] md:max-h-[100px] custom-scrollbar pr-1 hidden sm:block">
                                            {dayTasks.slice(0, 3).map(task => (
                                                <div
                                                    key={task.id}
                                                    className="px-2 py-1.5 rounded-lg text-[8px] md:text-[9px] font-bold truncate transition-all hover:scale-[1.02] cursor-default"
                                                    style={{
                                                        backgroundColor: `${priorityColors[task.priority as keyof typeof priorityColors] || '#3b82f6'}15`,
                                                        color: priorityColors[task.priority as keyof typeof priorityColors] || '#3b82f6',
                                                        borderLeft: `3px solid ${priorityColors[task.priority as keyof typeof priorityColors] || '#3b82f6'}`
                                                    }}
                                                    title={task.title}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[7px] md:text-[8px] font-black opacity-30 text-center py-1">
                                                    + {dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile Tasks Indicator */}
                                        {dayTasks.length > 0 && (
                                            <div className="flex sm:hidden flex-col items-center gap-1 mt-1">
                                                <div className="flex -space-x-1">
                                                    {dayTasks.slice(0, 3).map(task => (
                                                        <div
                                                            key={task.id}
                                                            className="w-2 h-2 rounded-full border border-[var(--color-surface)]"
                                                            style={{ backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] || '#3b82f6' }}
                                                        />
                                                    ))}
                                                </div>
                                                {dayTasks.length > 3 && (
                                                    <span className="text-[8px] font-black opacity-50">+{dayTasks.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        {isToday && (
                                            <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
