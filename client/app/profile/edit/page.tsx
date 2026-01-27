"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Save, ArrowLeft, Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { callToast } from "@/providers/SonnerProvider";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import useEditProfile from "@/hooks/profile/useEditProfile";
import { useAppSelector } from "@/redux/store";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const EditProfilePage = (): React.ReactElement => {
    // Global profile state
    const profile = useAppSelector((state) => state.user.profile);

    // Fallback str
    const fallbackStr = `${profile.username?.charAt(0).toUpperCase()} ${profile.username?.charAt(1).toUpperCase()}`

    // ===== Api service ===== \\
    const {
        isLoading,  
        executeService,
        extra
    } = useEditProfile();

    // Local states
    const [profileFile, setProfileFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>(profile.profileUrl);

    // Edit profile form
    const editProfileForm = useForm<z.infer<typeof extra.schema>>({
        resolver: zodResolver(extra.schema),
        defaultValues: {
            username: profile.username,
            bio: profile.bio,
        },
    });

    // Watched username and bio
    const watchedBio = editProfileForm.watch("bio");
    const watchedUsername = editProfileForm.watch("username");

    // Decisive boolean to determine if the current user
    // made any updates to their profile info
    const isUnchanged =
        watchedUsername === profile.username &&
        watchedBio === profile.bio &&
        !profileFile;

    // Sets the user's file for profilePicture
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            callToast.error("File is too large. Maximum size is 1MB.");
            return;
        }
        setProfileFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // OnSubmit function
    const onSubmit = async (values: z.infer<typeof extra.schema>) => {
        // Prevent updates if no data was provided
        if (!values.username && !values.bio && !values.profileFile) return;

        // Payload
        let payload: {
            username?: string;
            profileFile?: File;
            bio?: string;
        } = {};

        // ===== Prevent updating certain fields if they are the same as the previous
        // value =====
        if ((values.username) && (values.username.toLowerCase() !== profile.username.toLowerCase())) payload["username"] = values.username;
        if ((values.bio) && (values.bio?.toLowerCase() !== profile.bio.toLowerCase())) payload["bio"] = values.bio;
        if (profileFile) payload["profileFile"] = profileFile;

        // Make http request
        await executeService(payload);
    };

    // Change the default values of the form anytime
    // profile changes to prevent empty redux state
    // from being used as the forms default values
    // when the component mounts
    useEffect(() => {
        if (profile.username || profile.bio) {
            editProfileForm.reset({
                username: profile.username,
                bio: profile.bio,
            });
            
            // Set local preview url as well
            setPreviewUrl(profile.profileUrl);
        }
    }, [profile, editProfileForm.reset]);
    return (
        <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-8 font-sans selection:bg-emerald-100">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* ===== Header ===== */}
                <header className="flex items-center justify-between border-b border-zinc-200 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-zinc-900 leading-none">
                            Edit Profile
                        </h1>
                        <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                            Update your username, bio, or profile image
                        </p>
                    </div>
                    <Link href={`/profile/${profile.username}`}>
                        <Button variant="outline" className="rounded-none border-zinc-200 text-[10px] font-bold uppercase tracking-widest">
                            <ArrowLeft size={14} className="mr-2" /> Discard
                        </Button>
                    </Link>
                </header>

                {/* ===== Form ===== */}
                <form onSubmit={editProfileForm.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* ===== Left Side: Avatar Config ===== */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white border border-zinc-200 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                                Profile_Image
                            </Label>

                            <div className="relative aspect-square w-full rounded-full p-1 mb-4 group">
                                <Avatar className="h-full w-full rounded-none shadow-none">
                                    <AvatarImage src={previewUrl} className="object-cover" />
                                    <AvatarFallback className="rounded-none font-black text-2xl bg-transparent">
                                        {fallbackStr || "SG"}
                                    </AvatarFallback>
                                </Avatar>

                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                    <Camera className="text-white mb-2" size={24} />
                                    <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Replace</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>

                            {profileFile && (
                                <Button
                                    onClick={() => {
                                        setProfileFile(undefined);
                                        setPreviewUrl(profile.profileUrl);
                                    }}
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 rounded-none h-8"
                                >
                                    <X size={12} className="mr-2" /> Revert Changes
                                </Button>
                            )}

                            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                                    <span>MAX_CAPACITY</span>
                                    <span className="text-zinc-900">1.0 MB</span>
                                </div>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                                    <span>ALLOWED_FILE_TYPES</span>
                                    <span className="text-zinc-900">PNG/JPG/WEBP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Right Side: Identity Data ===== */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-white border border-zinc-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] space-y-8">

                            <FieldGroup className="space-y-8">
                                <Controller
                                    name="username"
                                    control={editProfileForm.control}
                                    render={({ field, fieldState }) => (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <Label className="text-[10px] font-black uppercase tracking-widest">Username</Label>
                                                <span className="text-[9px] font-mono text-zinc-300">REQ_01</span>
                                            </div>
                                            <Input
                                                {...field}
                                                className="rounded-none border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 transition-colors h-12 text-sm font-bold"
                                                placeholder="Unique identifier..."
                                            />
                                            {fieldState.invalid && (<FieldError className="text-[10px] text-red-500 font-bold uppercase tracking-tighter" errors={[fieldState.error]} />)}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="bio"
                                    control={editProfileForm.control}
                                    render={({ field, fieldState }) => (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <Label className="text-[10px] font-black uppercase tracking-widest">Bio</Label>
                                                <span className="text-[9px] font-mono text-zinc-300">{watchedBio?.length || 0}/50</span>
                                            </div>
                                            <Textarea
                                                {...field}
                                                className="rounded-none border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 min-h-30 text-sm font-medium leading-relaxed"
                                                placeholder="Enter mission objectives or bio..."
                                            />

                                            {fieldState.invalid && <FieldError className="text-[10px] text-red-500 font-bold uppercase tracking-tighter" errors={[fieldState.error]} />}
                                        </div>
                                    )}
                                />
                            </FieldGroup>

                            <div className="pt-4">
                                <Button
                                    disabled={isUnchanged || isLoading}
                                    type="submit"
                                    className="w-full md:w-auto px-10 rounded-none bg-zinc-900 text-white hover:bg-emerald-600 transition-all h-12 text-[11px] font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(16,185,129,0.2)] hover:shadow-none"
                                >
                                    {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Save size={14} className="mr-2" />}
                                    save_changes
                                </Button>
                            </div>
                        </div>

                        {/* System Note */}
                        <div className="flex items-start gap-3 p-4 bg-zinc-100 border border-zinc-200">
                            <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-zinc-500 font-medium uppercase leading-normal">
                                Note: Username updates will affect your profile URL. Ensure all active game sessions are finalized before committing deep registry changes.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;