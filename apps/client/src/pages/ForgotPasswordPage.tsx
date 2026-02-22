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
            await apiClient.post("/auth/reset-password", data);
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
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <SplashCursor />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50 relative z-10 no-splash"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <KeyRound className="h-8 w-8 text-blue-600" />
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Reset Password
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-600">
                        Securely recover your account access
                    </motion.p>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message as string}
                                    className="pl-10 h-11 bg-gray-50/50"
                                    placeholder="enter email"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    {...register("name")}
                                    error={errors.name?.message as string}
                                    className="pl-10 h-11 bg-gray-50/50"
                                    placeholder="enter name"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Recovery PIN</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    maxLength={4}
                                    {...register("recoveryPin")}
                                    error={errors.recoveryPin?.message as string}
                                    className="pl-10 h-11 bg-gray-50/50"
                                    placeholder="enter pin"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    {...register("newPassword")}
                                    error={errors.newPassword?.message as string}
                                    className="pl-10 h-11 bg-gray-50/50"
                                    placeholder="enter new password"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"
                        >
                            <span className="shrink-0">⚠️</span>
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-green-600 text-sm bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3 font-medium"
                        >
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            {success}
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold shadow-lg shadow-blue-500/20 transition-all font-bold"
                            isLoading={isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Sign In
                        </Link>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
