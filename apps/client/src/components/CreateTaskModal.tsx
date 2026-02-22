import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskSchema, type CreateTaskRequest, PriorityValues, type Priority } from "@repo/shared";
import { Button } from "./ui/Button.tsx";
import { X, Calendar as CalendarIcon, Type, AlignLeft, Sparkles, Plus, Flag } from "lucide-react";
import DatePicker from "react-datepicker";
import { TimePicker } from "./TimePicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskRequest) => void;
    isLoading: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreateTaskRequest>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: {
            dueDate: new Date(),
            priority: "MEDIUM",
        }
    });

    const watchPriority = watch("priority");

    const handleFormSubmit = (data: CreateTaskRequest) => {
        onSubmit(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="w-full max-w-5xl rounded-[2.5rem] border shadow-2xl relative z-[101] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />

                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: 'var(--color-primary)' }}>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>Add Task</h2>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Configure your mission</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-3 transition-all rounded-2xl opacity-40 hover:opacity-100 bg-[var(--color-background)]"
                            style={{ color: 'var(--color-text)' }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-12">
                            {/* Inputs Section */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: 'var(--color-text)' }}>
                                        <Type className="w-3 h-3" />
                                        Task Title
                                    </label>
                                    <input
                                        {...register("title")}
                                        placeholder="Enter title..."
                                        className="w-full rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] px-5 py-4 text-sm font-bold bg-[var(--color-background)] transition-all placeholder:opacity-30"
                                        style={{ color: 'var(--color-text)' }}
                                    />
                                    {errors.title && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: 'var(--color-text)' }}>
                                        <AlignLeft className="w-3 h-3" />
                                        Task Description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        className="w-full rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] px-5 py-5 text-sm font-bold bg-[var(--color-background)] transition-all placeholder:opacity-30 resize-none"
                                        placeholder="Describe the objective..."
                                        rows={6}
                                        style={{ color: 'var(--color-text)' }}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: 'var(--color-text)' }}>
                                        <Flag className="w-3 h-3" />
                                        Task Priority
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(PriorityValues as unknown as Priority[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setValue("priority", p)}
                                                className={`py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${watchPriority === p
                                                    ? "scale-105 shadow-lg border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                                    : "opacity-40 border-[var(--color-border)] hover:opacity-100 bg-[var(--color-background)]"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Section */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: 'var(--color-text)' }}>
                                    <CalendarIcon className="w-3 h-3" />
                                    Execution Schedule
                                </label>
                                <div className="rounded-[2.5rem] bg-[var(--color-background)] border-2 border-[var(--color-border)] overflow-hidden shadow-sm">
                                    <Controller
                                        control={control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-[var(--color-border)] h-full" style={{ borderColor: 'var(--color-border)' }}>
                                                {/* Date Picker Section */}
                                                <div className="flex-1 p-8 flex flex-col items-center justify-start bg-[var(--color-surface)]">
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-6 text-center">Select Date</p>
                                                    <DatePicker
                                                        selected={field.value ? new Date(field.value) : null}
                                                        onChange={(date: Date | null) => {
                                                            if (date) {
                                                                const current = field.value ? new Date(field.value) : new Date();
                                                                date.setHours(current.getHours());
                                                                date.setMinutes(current.getMinutes());
                                                                field.onChange(date);
                                                            }
                                                        }}
                                                        inline
                                                        minDate={new Date()}
                                                    />
                                                </div>

                                                {/* Time Picker Section */}
                                                <div className="flex-1 p-8 flex flex-col items-center justify-start bg-[var(--color-background)]/40">
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-6 text-center">Set Time</p>
                                                    <TimePicker
                                                        value={field.value ? new Date(field.value) : new Date()}
                                                        onChange={(date) => field.onChange(date)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors.dueDate && (
                                    <p className="text-[10px] font-bold text-red-500 mt-2 ml-1 text-center">{errors.dueDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 mt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-10 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
                            >
                                Cancel
                            </button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[var(--color-primary)]/20"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Save Task Entry
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
