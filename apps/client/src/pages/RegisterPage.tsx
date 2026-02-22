import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSchema } from "@repo/shared";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api-client";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import SplashCursor from "../components/SplashCursor";
import { motion } from "framer-motion";
import { Fingerprint, ArrowRight } from "lucide-react";

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await apiClient.post("/api/auth/register", data);
            login(response.data.token, response.data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <SplashCursor />

            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg space-y-8 p-12 rounded-[3.5rem] border shadow-2xl relative z-10"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-xl mb-8" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <Fingerprint className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: 'var(--color-primary)' }}>Welcome to VI Task</h3>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Register</h2>
                    <p className="opacity-40 font-bold text-[10px] uppercase tracking-widest">Join the elite mission tracking network</p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Name</label>
                            <Input
                                {...register("name")}
                                error={errors.name?.message as string}
                                className="h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                placeholder="Enter name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email</label>
                            <Input
                                {...register("email")}
                                error={errors.email?.message as string}
                                className="h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Password</label>
                            <Input
                                type="password"
                                {...register("password")}
                                error={errors.password?.message as string}
                                className="h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                placeholder="Enter password"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Security PIN (4-Digits)</label>
                            <Input
                                maxLength={4}
                                {...register("recoveryPin")}
                                error={errors.recoveryPin?.message as string}
                                className="h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                placeholder="Enter 4 digit pin"
                            />
                        </div>
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
                        Create Account <ArrowRight className="w-5 h-5" />
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-xs font-bold opacity-40">
                            Already have an account? <Link to="/login" className="font-black border-b-2 hover:opacity-100 transition-opacity ml-1" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>Login</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
