import React, { useState } from "react";
import { X, Lock, Key } from "lucide-react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

// Access the API_URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { user } = useAuth();
    const [step, setStep] = useState<"PIN" | "NEW_PASSWORD">("PIN");
    const [pinInput, setPinInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyPin = () => {
        // user object doesn't actually store recoveryPin explicitly from the context since we omit it, 
        // but it is validated on the backend. We'll simply transition to new password form.
        if (pinInput.length === 4) {
            setStep("NEW_PASSWORD");
        } else {
            toast.error("PIN must be 4 digits");
        }
    };

    const handleSubmit = async () => {
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${API_URL}/api/auth/reset-password`, {
                email: user?.email,
                name: user?.name,
                recoveryPin: pinInput,
                newPassword: newPassword,
            });
            toast.success("Security password modified successfully!");
            onClose();
            // Reset state
            setTimeout(() => {
                setStep("PIN");
                setPinInput("");
                setNewPassword("");
            }, 300);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update security password. Incorrect PIN.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg rounded-[2.5rem] border shadow-2xl relative z-[101] overflow-hidden"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                        {step === "PIN" ? <Lock className="w-6 h-6" /> : <Key className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                                            Change Password
                                        </h2>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                                            {step === "PIN" ? "Security Verification" : "Update Credentials"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 transition-all rounded-2xl opacity-40 hover:opacity-100 bg-[var(--color-background)]"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {step === "PIN" ? (
                                    <div className="space-y-6">
                                        <div className="space-y-3 flex flex-col items-center">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Enter 4-Digit Security PIN</label>
                                            <input
                                                type="password"
                                                maxLength={4}
                                                value={pinInput}
                                                onChange={(e) => setPinInput(e.target.value)}
                                                className="w-full sm:w-48 h-16 rounded-2xl text-center text-3xl font-black border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                                style={{ color: 'var(--color-text)' }}
                                                placeholder="••••"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleVerifyPin}
                                            className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all"
                                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                        >
                                            Verify Protocol
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full h-16 px-6 rounded-2xl font-bold border-none ring-2 ring-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                                style={{ color: 'var(--color-text)' }}
                                                placeholder="Enter new password (min. 6 chars)"
                                            />
                                            {newPassword.length > 0 && newPassword.length < 6 && (
                                                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">Password must be at least 6 characters long</p>
                                            )}
                                        </div>
                                        <Button
                                            onClick={handleSubmit}
                                            isLoading={isLoading}
                                            className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all"
                                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                        >
                                            Update Credentials
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
