import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSchema } from "@repo/shared";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api-client";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { z } from "zod";

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
            const response = await apiClient.post("/auth/register", data);
            login(response.data.token, response.data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                error={errors.password?.message as string}
                                className="mt-1"
                                placeholder="******"
                            />
                        </div>
                        <div>
                            <label htmlFor="recoveryPin" className="block text-sm font-medium text-gray-700">
                                Recovery PIN (4 digits)
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
                            <p className="text-xs text-gray-500 mt-1">Used for password recovery</p>
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Register
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
