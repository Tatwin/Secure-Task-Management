import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "@repo/shared";
import { apiClient } from "../lib/api-client";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import SplashCursor from "../components/SplashCursor";
import { motion } from "framer-motion";
import { KeyRound, Mail, User, Shield, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            setError("");
            setSuccess("");
            await apiClient.post("auth/reset-password", data);
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <SplashCursor />

            <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] blur-[150px] rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-12 rounded-3xl md:rounded-[3rem] border shadow-2xl relative z-10"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-xl mb-6 md:mb-8"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <KeyRound className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </motion.div>
                    <motion.h3 variants={itemVariants} className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-4" style={{ color: 'var(--color-primary)' }}>
                        Welcome to VI Task
                    </motion.h3>
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        Reset Password
                    </motion.h2>
                    <motion.p variants={itemVariants} className="opacity-40 font-bold text-[10px] uppercase tracking-widest">
                        Recover your account
                    </motion.p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message as string}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter email"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="text"
                                    {...register("name")}
                                    error={errors.name?.message as string}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter name"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Recovery PIN</label>
                            <div className="relative group">
                                <Shield className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="password"
                                    maxLength={4}
                                    {...register("recoveryPin")}
                                    error={errors.recoveryPin?.message as string}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter 4-digit pin"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }} />
                                <Input
                                    type="password"
                                    {...register("newPassword")}
                                    error={errors.newPassword?.message as string}
                                    className="pl-14 h-16 rounded-2xl border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)] font-bold placeholder:opacity-20"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-center flex items-center justify-center gap-2"
                        >
                            <Shield className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-center flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {success}
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                        <Button
                            type="submit"
                            className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                            isLoading={isSubmitting}
                        >
                            Reset Password <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center pt-4">
                        <p className="text-xs font-bold opacity-40">
                            Back to <Link to="/login" className="font-black border-b-2 hover:opacity-100 transition-opacity ml-1" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>Login</Link>
                        </p>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
