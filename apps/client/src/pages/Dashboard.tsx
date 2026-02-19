import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/TaskCard";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { Button } from "../components/ui/Button";
import { Plus, LogOut, Loader2 } from "lucide-react";
import { CreateTaskRequest } from "@repo/shared";
import { Input } from "../components/ui/Input";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { tasks, isLoading, error, createTask, deleteTask, updateTask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredTasks = tasks?.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateTask = async (data: CreateTaskRequest) => { // Removed extra closing parenthesis
        await createTask.mutateAsync(data);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>Error loading tasks: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900">Task Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 hidden sm:block">
                        Welcome, {user?.name || user?.email}
                    </div>
                    <Button variant="ghost" onClick={logout} className="text-gray-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="card max-w-xs"
                    />
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks?.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={(id) => deleteTask.mutate(id)}
                            onUpdateStatus={(id, completed) =>
                                updateTask.mutate({ id, data: { completed } })
                            }
                        />
                    ))}
                    {!isLoading && filteredTasks?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                            <p className="text-lg">No tasks found</p>
                            <p className="text-sm">Create a new task to get started.</p>
                        </div>
                    )}
                </div>
            </main>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                isLoading={createTask.isPending}
            />
        </div>
    );
};

export default Dashboard;
