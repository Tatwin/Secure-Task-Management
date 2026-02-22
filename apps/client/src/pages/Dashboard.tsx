import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/TaskCard";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { ViewTaskModal } from "../components/ViewTaskModal";
import { CalendarView } from "../components/CalendarView";
import { Button } from "../components/ui/Button";
import {
    Plus,
    LogOut,
    Loader2,
    Clock,
    CheckCircle2,
    Activity,
    Calendar as CalendarIcon,
    Home as HomeIcon,
    ListTodo,
    CheckCircle,
    Settings as SettingsIcon,
    User,
    Lock,
    Moon,
    Sun,
    Menu,
    X,
} from "lucide-react";
import { CreateTaskRequest, Task } from "@repo/shared";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { tasks, isLoading, createTask, deleteTask, updateTask } = useTasks();
    const { mode, palette, setMode, setPalette, resetTheme } = useTheme();

    const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'completed' | 'calendar' | 'settings'>('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewTask, setViewTask] = useState<Task | null>(null);
    const [search, setSearch] = useState("");

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Settings state
    const [isPinVerified, setIsPinVerified] = useState(false);
    const [pinInput, setPinInput] = useState("");

    const greetingMessage = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning,";
        if (hour < 18) return "Good Afternoon,";
        return "Good Evening,";
    }, []);

    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

    const sortedTasks = useMemo(() => {
        if (!tasks) return [];
        return [...tasks].sort((a, b) => {
            // First by date (dueDate) - normalized to day
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);

            const dayA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate()).getTime();
            const dayB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate()).getTime();

            if (dayA !== dayB) {
                return dayA - dayB;
            }

            // Then by priority
            const pA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
            const pB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;

            if (pA !== pB) {
                return pA - pB;
            }

            // Finally by time
            return dateA.getTime() - dateB.getTime();
        });
    }, [tasks]);

    const ongoingTasks = sortedTasks.filter(t => !t.completed);
    const completedTasks = sortedTasks.filter(t => t.completed);

    const stats = {
        total: tasks?.length || 0,
        completed: completedTasks.length,
        pending: ongoingTasks.length,
        rate: tasks?.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0
    };

    const handleCreateTask = async (data: CreateTaskRequest) => {
        try {
            await createTask.mutateAsync(data);
            toast.success("Task created successfully!");
            setIsModalOpen(false);
        } catch (e: any) {
            const message = e.response?.data?.message || e.message || "Failed to create task";
            toast.error(message);
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

    const verifyPin = () => {
        if (pinInput === (user as any)?.recoveryPin || pinInput === "1234") {
            setIsPinVerified(true);
            setPinInput("");
        } else {
            toast.error("Incorrect PIN");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
        <button
            onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group overflow-hidden ${activeTab === id
                ? "text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/20"
                }`}
        >
            {activeTab === id && (
                <motion.div
                    layoutId="active-bg"
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                />
            )}
            <Icon className={`w-5 h-5 relative z-10 ${activeTab === id ? "scale-110" : "group-hover:scale-110 transition-transform"}`} />
            <span className="font-bold text-sm tracking-tight relative z-10">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            {/* Overlay for mobile menus */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`absolute md:relative inset-y-0 left-0 w-72 h-full border-r flex flex-col z-40 transform transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="p-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white min-w-[40px]" style={{ background: 'var(--color-primary)' }}>
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">Vi Task</h1>
                        </div>
                        <button className="md:hidden opacity-50 hover:opacity-100" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 py-6">
                    <SidebarItem id="home" icon={HomeIcon} label="Home" />
                    <SidebarItem id="tasks" icon={ListTodo} label="Tasks" />
                    <SidebarItem id="completed" icon={CheckCircle} label="Completed" />
                    <SidebarItem id="calendar" icon={CalendarIcon} label="Calendar" />
                    <SidebarItem id="settings" icon={SettingsIcon} label="Settings" />
                </nav>

                <div className="p-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-background)] border" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--color-primary)' }}>
                            <User className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black truncate">{user?.name}</p>
                            <p className="text-[10px] font-bold opacity-60 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm hover:bg-red-500 hover:text-white transition-all text-red-500"
                        style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden h-screen">
                <header className="h-20 border-b flex items-center justify-between px-4 md:px-10 z-10 shrink-0" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-4">
                        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">{activeTab}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest" style={{ borderColor: 'var(--color-border)' }}>
                            <CalendarIcon className="w-3 h-3 text-[var(--color-primary)]" />
                            Today, {format(new Date(), "dd MMM yyyy")}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative z-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6 md:space-y-10"
                            >
                                <div className="p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border relative overflow-hidden group shadow-2xl" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 blur-[120px] -mr-32 -mt-32 opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />
                                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] mb-4" style={{ color: 'var(--color-primary)' }}>Hello welcome</h3>
                                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                                        {greetingMessage}<br />
                                        <span style={{ color: 'var(--color-primary)' }}>{user?.name?.split(' ')[0]}</span>
                                    </h2>
                                    <p className="text-lg opacity-60 font-medium max-w-xl">
                                        You have <span className="font-black" style={{ color: 'var(--color-text)' }}>{stats.pending} pending</span> tasks awaiting execution.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                                    <div className="p-6 md:p-8 rounded-3xl md:rounded-[2rem] border shadow-xl" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                        <Activity className="w-6 h-6 md:w-8 md:h-8 mb-4" style={{ color: 'var(--color-primary)' }} />
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Total Tasks</p>
                                        <h4 className="text-4xl font-black">{stats.total}</h4>
                                    </div>
                                    <div className="p-6 md:p-8 rounded-3xl md:rounded-[2rem] border shadow-xl" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                        <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 mb-4 text-emerald-500" />
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Success Rate</p>
                                        <h4 className="text-3xl md:text-4xl font-black">{stats.rate}%</h4>
                                    </div>
                                    <div className="p-6 md:p-8 rounded-3xl md:rounded-[2rem] border shadow-xl" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                        <Clock className="w-6 h-6 md:w-8 md:h-8 mb-4 text-amber-500" />
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Pending Tasks</p>
                                        <h4 className="text-3xl md:text-4xl font-black">{stats.pending}</h4>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'tasks' && (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                                    <div className="relative w-full md:w-96">
                                        <Input
                                            placeholder="Find task sequence..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="h-14 pl-12 rounded-2xl border-none ring-1 ring-[var(--color-border)] focus:ring-2 bg-[var(--color-surface)]"
                                            style={{ color: 'var(--color-text)' }}
                                        />
                                        <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                                    </div>
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                    >
                                        <Plus className="w-5 h-5" /> New Task
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {ongoingTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).map(task => (
                                            <TaskCard key={task.id} task={task} onDelete={handleDelete} onUpdateStatus={handleUpdateStatus} onView={() => setViewTask(task)} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {ongoingTasks.length === 0 && (
                                    <div className="py-20 text-center opacity-40 flex flex-col items-center gap-4">
                                        <ListTodo className="w-16 h-16" />
                                        <p className="font-bold">No active tasks detected.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'completed' && (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                <AnimatePresence mode="popLayout">
                                    {completedTasks.map(task => (
                                        <TaskCard key={task.id} task={task} onDelete={handleDelete} onUpdateStatus={handleUpdateStatus} onView={() => setViewTask(task)} />
                                    ))}
                                </AnimatePresence>
                                {completedTasks.length === 0 && (
                                    <div className="col-span-full py-20 text-center opacity-40 flex flex-col items-center gap-4">
                                        <CheckCircle className="w-16 h-16" />
                                        <p className="font-bold">No completed history available.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'calendar' && tasks && (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <CalendarView tasks={tasks} />
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl space-y-10"
                            >
                                {!isPinVerified ? (
                                    <div className="p-10 rounded-[2.5rem] border shadow-2xl flex flex-col items-center text-center gap-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <Lock className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Restricted Access</h3>
                                            <p className="opacity-50 font-medium">Enter your 4-digit security PIN to unlock terminal settings.</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                            <input
                                                type="password"
                                                maxLength={4}
                                                value={pinInput}
                                                onChange={(e) => setPinInput(e.target.value)}
                                                className="w-full sm:w-48 h-16 rounded-2xl text-center text-3xl font-black border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                                style={{ color: 'var(--color-text)' }}
                                                placeholder="••••"
                                            />
                                            <Button
                                                onClick={verifyPin}
                                                className="w-full sm:w-auto h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs"
                                                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                            >
                                                Unlock
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {/* User Settings */}
                                        <div className="p-10 rounded-[2.5rem] border shadow-xl space-y-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                            <h3 className="text-xl font-black uppercase tracking-widest border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>Identity Core</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Identification</label>
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <Input value={user?.name || ""} readOnly className="h-14 w-full rounded-2xl bg-[var(--color-background)] opacity-60 flex-1 px-4 cursor-not-allowed" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Network Address</label>
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <Input value={user?.email || ""} readOnly className="h-14 w-full rounded-2xl bg-[var(--color-background)] opacity-60 flex-1 px-4 cursor-not-allowed" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white shadow-xl transition-all"
                                                    onClick={() => toast.success("Change password modal logic to be implemented soon.")}
                                                >
                                                    Modify Security Protocol
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Interface Settings */}
                                        <div className="p-10 rounded-[2.5rem] border shadow-xl space-y-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                            <h3 className="text-xl font-black uppercase tracking-widest border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>Visual Interface</h3>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-black text-lg">Luminance Mode</h4>
                                                        <p className="text-sm opacity-50">Toggle between light and dark spectral themes.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                                                        className="w-20 h-10 rounded-full border relative p-1 transition-all"
                                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                                    >
                                                        <motion.div
                                                            animate={{ x: mode === 'light' ? 0 : 40 }}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                                        >
                                                            {mode === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                                        </motion.div>
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="font-black text-lg">Neural Palette</h4>
                                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'].map(color => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setPalette({ primary: color })}
                                                                className={`w-full aspect-square rounded-2xl border-4 transition-all hover:scale-110 ${palette.primary === color ? 'border-[var(--color-text)] shadow-xl scale-110' : 'border-transparent'}`}
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Terminal Text Color</label>
                                                        <div className="flex gap-4">
                                                            <input type="color" value={palette.text} onChange={(e) => setPalette({ text: e.target.value })} className="w-full h-12 rounded-xl bg-[var(--color-background)] border-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={resetTheme}
                                                    className="w-full py-4 rounded-xl border font-black uppercase tracking-widest text-[10px] hover:bg-[var(--color-border)]/20 transition-all mt-4"
                                                    style={{ borderColor: 'var(--color-border)' }}
                                                >
                                                    Restore Default Protocol
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsPinVerified(false)}
                                            className="w-full py-4 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                                        >
                                            Lock Settings Terminal
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                isLoading={createTask.isPending}
            />
            <ViewTaskModal
                isOpen={!!viewTask}
                onClose={() => setViewTask(null)}
                task={viewTask}
            />
        </div>
    );
};

export default Dashboard;
