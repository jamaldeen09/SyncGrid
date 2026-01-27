"use client"
import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import useLogin from "@/hooks/auth/useLogin";
import { FieldError } from "@/components/ui/field";

const LoginPage = () => {
    // Local states
    const [showPassword, setShowPassword] = useState(false);

    // Api service
    const {
        executeService,
        isLoading,
        extra
    } = useLogin();

    // Validation errors
    const validationErrors = extra.validationErrors;

    // Login form
    const loginForm = useForm({
        resolver: zodResolver(extra.schema),
        defaultValues: {
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

                    <Link href="/signup" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        Sign Up
                    </Link>
                </div>
            </header>

            {/* ===== Main content area ===== */}
            <main className="flex-1 grid lg:grid-cols-2 border-x border-zinc-200 bg-white overflow-hidden">

                {/* ===== Left Side: Minimal branding ===== */}
                <div className="hidden lg:flex flex-col justify-center p-20 bg-[#F8F8F8] border-r border-zinc-200 relative">
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">
                            Start<br />Playing.
                        </h2>
                        <p className="text-sm text-zinc-400 max-w-60 leading-relaxed">
                            Join the community and track your competitive progress.
                        </p>
                    </div>

                    {/* ===== Subtle aesthetic background number ===== */}
                    <span className="absolute bottom-10 left-20 text-[10rem] font-black text-zinc-200 opacity-20 select-none">01</span>
                </div>

                {/* ===== Right Side: Login form ===== */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-20">
                    <div className="w-full max-w-[320px] space-y-12">

                        <div className="space-y-1 text-center lg:text-left">
                            <h3 className="text-3xl font-black tracking-tight italic">Welcome Back</h3>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Please enter your details</p>
                        </div>

                        <form onSubmit={loginForm.handleSubmit(executeService)} className="space-y-8">

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

                            <div className="space-y-5">
                                {/* ===== Email field ===== */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <Controller
                                        name="email"
                                        control={loginForm.control}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="e.g. user@domain.com"
                                                    className={`rounded-none border-zinc-200 focus-visible:border-transparent ${fieldState.error ? "focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"} h-12 bg-zinc-50/30 text-xs transition-all`}
                                                />

                                                {fieldState.invalid && (<FieldError className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-2" errors={[fieldState.error]} />)}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* ===== Password field ===== */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>

                                        {/* ====== Forgot password for later ===== */}
                                        {/* <Link href="/forgot" className="text-[9px] text-zinc-300 hover:text-emerald-600 transition-colors uppercase font-bold">Forgot?</Link> */}
                                    </div>

                                    <Controller
                                        name="password"
                                        control={loginForm.control}
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col gap-2 relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter password"
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
                                        Log In <ArrowRight size={14} />
                                    </span>
                                )}
                            </Button>
                        </form>


                        <div className="pt-8 text-center">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                                Need an account? <Link href="/signup" className="text-zinc-900 font-black hover:text-emerald-600 underline underline-offset-4 decoration-zinc-200">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-4 border-t border-zinc-200 mt-0" />
        </div>
    );
};

export default LoginPage;