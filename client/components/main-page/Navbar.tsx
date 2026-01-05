"use client"
import React from "react";
import Logo from "../reusable/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { setAuthTrigger, setBooleanTrigger } from "@/redux/slices/triggers-slice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BellIcon, GameControllerIcon, SignOutIcon, UserIcon, UsersThreeIcon } from "@phosphor-icons/react";
import CustomAvatar from "../reusable/CustomAvatar";
import Link from "next/link";

const Navbar = (): React.ReactElement => {
    const { auth: { isAuthenticated, username }, profile: { profile_url } } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Branding */}
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

                    {/* User Profile / Auth action buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm">24 players online</span>
                            </div>

                            {/* ==== Games ===== */}
                            <Link href="/games" className="cursor-default">
                                <div className="relative cursor-default">
                                    <Button variant="outline" className="rounded-full size-10" size="icon-lg">
                                        <GameControllerIcon />
                                    </Button>
                                    {/* ===== Indicator for games being played ===== */}
                                    <p className="cursor-default absolute bottom-0 right-0 bg-primary text-white rounded-full size-4 flex justify-center items-center font-semibold text-[8px]">
                                        1
                                    </p>
                                </div>
                            </Link>

                            {/* Dropdown menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <div className="size-9.5">
                                        <CustomAvatar
                                            size="fill"
                                            src={profile_url}
                                            alt="profile_url"
                                            className="hover:opacity-70 transition-all duration-100"
                                            fallback={
                                                <div className="bg-primary text-white rounded-full flex justify-center items-center
                                            size-9">
                                                    {username.charAt(0).toUpperCase() || "SG"}
                                                </div>
                                            }
                                        />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-40 mr-4 mt-2">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <UserIcon />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <UsersThreeIcon />
                                        Friends
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <BellIcon />
                                        Notifications
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="hover:bg-destructive/30!">
                                        <SignOutIcon />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => {
                                    dispatch(setAuthTrigger("login"));
                                    dispatch(setBooleanTrigger({ key: "auth", value: true }))
                                }}
                                variant="outline"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => {
                                    dispatch(setAuthTrigger("signup"));
                                    dispatch(setBooleanTrigger({ key: "auth", value: true }))
                                }}
                            >
                                Signup
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;