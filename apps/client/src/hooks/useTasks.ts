import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client.ts"; // Removed .js extension
import { Task, CreateTaskRequest, UpdateTaskRequest } from "@repo/shared";

export const useTasks = () => {
    const queryClient = useQueryClient();

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await apiClient.get<Task[]>("tasks");
            return response.data;
        },
    });

    const createTask = useMutation({
        mutationFn: async (newTask: CreateTaskRequest) => {
            const response = await apiClient.post<Task>("tasks", newTask);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTaskRequest }) => {
            const response = await apiClient.patch<Task>(`tasks/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
    };
};
