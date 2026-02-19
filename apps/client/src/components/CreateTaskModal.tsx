import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskSchema, type CreateTaskRequest } from "@repo/shared";
import { Input } from "./ui/Input.tsx";
import { Button } from "./ui/Button.tsx";
import { X } from "lucide-react";

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
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskRequest>({
        resolver: zodResolver(CreateTaskSchema),
    });

    const handleFormSubmit = (data: CreateTaskRequest) => {
        onSubmit(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-6">Create New Task</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <Input
                            {...register("title")}
                            error={errors.title?.message}
                            placeholder="e.g. Finish report"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional details..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <Input
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                            {...register("dueDate", { setValueAs: (v) => v ? new Date(v) : undefined })}
                            error={errors.dueDate?.message}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Task
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
