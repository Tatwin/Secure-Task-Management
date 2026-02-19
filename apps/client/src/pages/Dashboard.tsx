import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/TaskCard";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { Button } from "../components/ui/Button";
import { Plus, LogOut, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { CreateTaskRequest, Task } from "@repo/shared";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { tasks, isLoading, error, createTask, deleteTask, updateTask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredTasks = tasks?.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    const ongoingTasks: Task[] = [];
    const completedTasks: Task[] = [];
    const overdueTasks: Task[] = [];

    filteredTasks?.forEach((task) => {
        if (task.completed) {
            completedTasks.push(task);
        } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
            overdueTasks.push(task);
        } else {
            ongoingTasks.push(task);
        }
    });

    const handleCreateTask = async (data: CreateTaskRequest) => {
        try {
            await createTask.mutateAsync(data);
            toast.success("Task created successfully!");
        } catch (e) {
            toast.error("Failed to create task");
            console.error(e)
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask.mutateAsync(id);
            toast.success("Task deleted");
        } catch (e) {
            toast.error("Failed to delete task");
        }
    };

    const handleUpdateStatus = async (id: string, completed: boolean) => {
        try {
            await updateTask.mutateAsync({ id, data: { completed } });
            toast.success(completed ? "Task completed!" : "Task marked as ongoing");
        } catch (e) {
            toast.error("Failed to update task");
        }
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

    const TaskSection = ({ title, tasks, icon, colorClass, borderColor, emptyMsg }: { title: string, tasks: Task[], icon: React.ReactNode, colorClass: string, borderColor: string, emptyMsg: string }) => (
        <section className={`rounded-3xl border ${borderColor} bg-white/50 backdrop-blur-xl shadow-xl overflow-hidden`}>
            {/* Section Header */}
            <div className={`px-6 py-4 border-b ${borderColor} ${colorClass} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tasks Grid */}
            <div className="p-6">
                {tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={handleDelete}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                            {icon}
                        </div>
                        <p className="text-gray-500 font-medium">{emptyMsg}</p>
                    </div>
                )}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] relative">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            TaskBoard
                        </h1>
                        <p className="text-xs text-gray-500">Secure & Simple</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {user?.email}
                        </p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
                    <Button variant="ghost" onClick={logout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Actions Bar */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Input
                            placeholder="Search your tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all pl-10"
                        />
                        <svg
                            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Task
                    </Button>
                </div>

                {/* Vertical Sections */}
                <div className="flex flex-col gap-10 pb-20">
                    {/* Overdue Section - High Priority */}
                    {overdueTasks.length > 0 && (
                        <TaskSection
                            title="Attention Required"
                            tasks={overdueTasks}
                            icon={<AlertCircle className="w-6 h-6 text-red-500" />}
                            colorClass="bg-red-50"
                            borderColor="border-red-100"
                            emptyMsg="No overdue tasks"
                        />
                    )}

                    {/* Ongoing Section - Main Workflow */}
                    <TaskSection
                        title="In Progress"
                        tasks={ongoingTasks}
                        icon={<Clock className="w-6 h-6 text-blue-500" />}
                        colorClass="bg-blue-50"
                        borderColor="border-blue-100"
                        emptyMsg="No active tasks. Time to create one!"
                    />

                    {/* Completed Section - History */}
                    <TaskSection
                        title="Completed"
                        tasks={completedTasks}
                        icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
                        colorClass="bg-green-50"
                        borderColor="border-green-100"
                        emptyMsg="No completed tasks yet. Keep going!"
                    />
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
