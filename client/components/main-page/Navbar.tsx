"use client"
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { Button } from "../ui/button";
import { GameControllerIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import { useUi } from "@/contexts/UiContext";
import { Auth, useAuth } from "@/contexts/AuthContext";
import CustomAvatar from "../reusable/CustomAvatar";
import { useAppSelector } from "@/redux/store";
import Logo from "../reusable/Logo";
import ThemeSwitcher from "../reusable/ThemeSwitcher";
import { defaultProfileUrl } from "@/lib/utils";
import useLogout from "@/hooks/auth/useLogout";
import { AnimatePresence } from "framer-motion";
import Loader from "../reusable/Loader";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

const Navbar = ({ fixed = true }: {
    fixed?: boolean
}): React.ReactElement => {
    // Hooks
    const { openUi } = useUi();
    const { setAuth } = useAuth();
    const { executeService, isLoading } = useLogout();
    const router = useRouter();

    // Global states
    const {
        auth: { isAuthenticated, email },
        profile: { profileUrl, username }
    } = useAppSelector((state) => state.user);

    /**
     * Enables the auth modal for logging in, signing up or password reset
     * @param auth
     */
    const enableAuthModal = (auth: Auth) => {
        setAuth(auth);
        openUi("auth");
    }
    return (
        <>
            {/* ===== Logging out load state ===== \\ */}
            <AnimatePresence>
                {isLoading && (
                    <div className="supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-100 flex justify-center items-center bg-black/10">
                        <div className="flex flex-col w-full max-w-sm items-center justify-center text-center">
                            <Loader />
                            <p className="animate-pulse mt-28 text-transparent bg-clip-text bg-linear-to-br from-primary to-primary/30 ml-6">Logging out...</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===== Navbar ===== */}
            <nav className={`${fixed && "sticky top-0 z-50"} backdrop-blur-lg bg-background/80 border-b border-border/40`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ===== Branding ===== */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                <Logo />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    SyncGrid
                                </p>
                                <span className="text-xs text-muted-foreground">Live Tic-Tac-Toe</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* ===== User Profile / Auth action buttons ===== */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {/* Username */}
                                    <Badge className="bg-transparent hover:bg-card hidden sm:block">{username}</Badge>

                                    {/* Dropdown menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="outline-none">
                                            <div className="size-9.5">
                                                <CustomAvatar
                                                    size="fill"
                                                    src={profileUrl || defaultProfileUrl}
                                                    alt="profile_url"
                                                    className="hover:opacity-70 transition-all duration-100"
                                                    fallback={
                                                        <div className="bg-primary text-white rounded-full flex justify-center items-center
                                            size-9.5">
                                                            {username.charAt(0).toUpperCase()}
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="w-40 mr-4 mt-2">
                                            <DropdownMenuLabel className="p-3">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs font-black uppercase">{username}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => router.push(`/profile/${username}`)}
                                            >
                                                <UserIcon />
                                                Profile
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => executeService({})}
                                                className="hover:bg-destructive/30!"
                                            >
                                                <SignOutIcon />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={() => enableAuthModal("login")}
                                        variant="outline"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => enableAuthModal("signup")}
                                    >
                                        Signup
                                    </Button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;