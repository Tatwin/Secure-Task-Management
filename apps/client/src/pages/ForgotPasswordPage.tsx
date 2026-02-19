import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "@repo/shared";
import { apiClient } from "../lib/api-client";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import SplashCursor from "../components/SplashCursor";

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
            setSuccess("Password reset successfully. Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <SplashCursor />
            <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100 relative z-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your verification details to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                error={errors.email?.message as string}
                                className="mt-1"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                {...register("name")}
                                error={errors.name?.message as string}
                                className="mt-1"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="recoveryPin" className="block text-sm font-medium text-gray-700">
                                Recovery PIN
                            </label>
                            <Input
                                id="recoveryPin"
                                type="text"
                                maxLength={4}
                                {...register("recoveryPin")}
                                error={errors.recoveryPin?.message as string}
                                className="mt-1"
                                placeholder="1234"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register("newPassword")}
                                error={errors.newPassword?.message as string}
                                className="mt-1"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}

                    <div>
                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Reset Password
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Back to Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
