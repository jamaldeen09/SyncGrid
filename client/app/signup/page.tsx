"use client"
import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import useSignup from "@/hooks/auth/useSignup";
import { FieldError } from "@/components/ui/field";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    // Using your useSignup hook
    const {
        executeService,
        isLoading,
        extra
    } = useSignup();

    const validationErrors = extra.validationErrors;

    const signupForm = useForm({
        resolver: zodResolver(extra.schema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    return (
        <div className="min-h-screen w-full bg-[#F8F8F8] text-zinc-900 font-sans flex flex-col p-4 sm:p-6 selection:bg-emerald-100 overflow-x-hidden">

            {/* ===== Header ===== */}
            <header className="w-full flex justify-between items-center border-b border-zinc-200 pb-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-emerald-500 rounded-sm" />
                    <h1 className="text-xs font-bold tracking-[0.2em] uppercase">SyncGrid</h1>
                </Link>

                <div className="flex items-center gap-3">
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        Go back
                    </Link>

                    <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        Log In
                    </Link>
                </div>
            </header>

            {/* ===== Main content area ===== */}
            <main className="flex-1 grid lg:grid-cols-2 border-x border-zinc-200 bg-white overflow-hidden">

                {/* ===== Left Side: Minimal branding ===== */}
                <div className="hidden lg:flex flex-col justify-center p-20 bg-[#F8F8F8] border-r border-zinc-200 relative">
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">
                            Create<br />Account.
                        </h2>
                        <p className="text-sm text-zinc-400 max-w-60 leading-relaxed">
                            Join syncgrid, claim your identity, and begin your competitive journey.
                        </p>
                    </div>

                    {/* ===== Subtle aesthetic background number ===== */}
                    <span className="absolute bottom-10 left-20 text-[10rem] font-black text-zinc-200 opacity-20 select-none">02</span>
                </div>

                {/* ===== Right Side: Signup form ===== */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-20">
                    <div className="w-full max-w-[320px] space-y-10">

                        <div className="space-y-1 text-center lg:text-left">
                            <h3 className="text-3xl font-black tracking-tight italic">New Session</h3>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Register your credentials</p>
                        </div>

                        <form onSubmit={signupForm.handleSubmit(executeService)} className="space-y-6">

                            {/* ===== Validation errors ===== */}
                            {validationErrors.length > 0 && (
                                <div className="p-4 border border-red-100 bg-red-50/50 rounded-sm">
                                    {validationErrors.map((err: any, i: number) => (
                                        <p key={i} className="text-[10px] font-bold text-red-600 uppercase tracking-tight">
                                            {err.message}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* ===== Username field ===== */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Username</label>
                                    <Controller
                                        name="username"
                                        control={signupForm.control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g john-doe"
                                                    className={`rounded-none border-zinc-200 focus-visible:border-transparent ${fieldState.error ? "focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"} h-12 bg-zinc-50/30 text-xs transition-all`}
                                                />
                                                {fieldState.invalid && (<FieldError className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-2" errors={[fieldState.error]} />)}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* ===== Email field ===== */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <Controller
                                        name="email"
                                        control={signupForm.control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="user@domain.com"
                                                    className={`rounded-none border-zinc-200 focus-visible:border-transparent ${fieldState.error ? "focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"} h-12 bg-zinc-50/30 text-xs transition-all`}
                                                />
                                                {fieldState.invalid && (<FieldError className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-2" errors={[fieldState.error]} />)}
                                            </div>

                                        )}
                                    />
                                </div>

                                {/* ===== Password field ===== */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                                    <Controller
                                        name="password"
                                        control={signupForm.control}
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col gap-2 relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className={`rounded-none border-zinc-200 focus-visible:border-transparent ${fieldState.error ? "focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"} h-12 bg-zinc-50/30 text-xs pr-12 transition-all`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-4.5 h-fit flex items-center justify-center text-zinc-300 hover:text-zinc-900 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>


                                                {fieldState.invalid && (
                                                    <FieldError
                                                        className="text-[10px] text-red-500 font-bold uppercase tracking-tighter"
                                                        errors={[fieldState.error]}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-zinc-900 hover:bg-emerald-600 text-white rounded-none text-xs font-bold tracking-[0.3em] uppercase transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                            >
                                {isLoading ? <Spinner className="w-4 h-4 text-white" /> : (
                                    <span className="flex items-center gap-2">
                                        Sign Up <ArrowRight size={14} />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="pt-8 text-center">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                                Already have an account? <Link href="/login" className="text-zinc-900 font-black hover:text-emerald-600 underline underline-offset-4 decoration-zinc-200">Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-4 border-t border-zinc-200 mt-0" />
        </div>
    );
};

export default SignupPage;