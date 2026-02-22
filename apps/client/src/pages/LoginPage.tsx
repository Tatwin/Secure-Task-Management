import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema, type LoginRequest } from "@repo/shared";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api-client";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import SplashCursor from "../components/SplashCursor";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginRequest>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await apiClient.post("auth/login", data);
            login(response.data.token, response.data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <SplashCursor />

            <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] blur-[150px] rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-12 rounded-3xl md:rounded-[3rem] border shadow-2xl relative z-10"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-xl mb-6 md:mb-8" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <Shield className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-4" style={{ color: 'var(--color-primary)' }}>Welcome to VI Task</h3>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Login</h2>
                    <p className="opacity-40 font-bold text-[10px] uppercase tracking-widest">Sign in to access your secure dashboard</p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Link to="/forgot-password" virtual-link="true" className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                        isLoading={isSubmitting}
                    >
                        Login <ArrowRight className="w-5 h-5" />
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-xs font-bold opacity-40">
                            Don't have an account? <Link to="/register" className="font-black border-b-2 hover:opacity-100 transition-opacity ml-1" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>Register</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
