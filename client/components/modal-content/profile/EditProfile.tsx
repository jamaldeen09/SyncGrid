"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraIcon, XIcon } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { EditProfileData } from "@shared/index";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { editProfileSchema } from "@/hooks/profile/useEditProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { UiContextType } from "@/contexts/UiContext";
import { callToast } from "@/providers/SonnerProvider";

// Component props
interface EditProfileProps {
    // ===== Api service ===== \\
    isLoading: boolean;
    executeService: (values: EditProfileData) => Promise<void>;
    validationErrors: { field: string; message: string }[];

    // ===== Form default values ===== \\
    formDefaultValues: {
        username: string;
        bio: string;
        profileUrl: string;
    };

    // ===== Ui state helpers ===== \\
    uiReducers: {
        closeUi: UiContextType["closeUi"];
    }
}


const EditProfile = ({
    isLoading,
    executeService,
    validationErrors,
    uiReducers: { closeUi },
    formDefaultValues
}: EditProfileProps): React.ReactElement => {
    // Profile state
    const [profileFile, setProfileFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>(formDefaultValues.profileUrl)

    // Edit profile form 
    const editProfileForm = useForm<z.infer<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            username: formDefaultValues.username,
            bio: formDefaultValues.bio,
        },
    });

    // Watched bio
    const watchedBio = editProfileForm.watch("bio");

    // Watched username
    const watchedUsername = editProfileForm.watch("username");

    // ===== Usefull booolean ===== \\
    const isUsernameUnchanged = watchedUsername === formDefaultValues.username;
    const isBioUnchanged = watchedBio === formDefaultValues.bio;
    const isImageUnchanged = !profileFile;

    const disableSaveChangesBtn = isLoading || (isUsernameUnchanged && isBioUnchanged && isImageUnchanged);

    // Handle file change logic
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (1MB = 1048576 bytes)
        if (file.size > 1024 * 1024) {
            callToast("error", "File is too large. Maximum size is 1MB.");
            return;
        }

        // Update States
        setProfileFile(file);

        // Clean up old preview URL to prevent memory leaks
        if (previewUrl && !previewUrl.startsWith('http')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
    };

    // Reset image
    const handleResetImage = () => {
        setProfileFile(undefined);
        setPreviewUrl(formDefaultValues.profileUrl);
    };

    // On submit
    const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
        let valuesGoingToBackend: z.infer<typeof editProfileSchema> = {};
        
        // ===== Username ===== \\
        if (values.username && (formDefaultValues.username.toLowerCase() !== values.username.toLowerCase())) valuesGoingToBackend["username"] = values.username;

        // ===== Bio ===== \\
        if (values.bio && (formDefaultValues.bio.toLowerCase() !== values.bio.toLowerCase())) valuesGoingToBackend["bio"] = values.bio;

        // ===== Profile file ===== \\
        if (profileFile) valuesGoingToBackend["profileFile"] = profileFile

        await executeService(valuesGoingToBackend);
    };
    return (
        <form onSubmit={editProfileForm.handleSubmit(onSubmit)} className="w-full" id="edit-profile-form">
            <Card className="w-full ring-0! ring-transparent!">
                <CardHeader>
                    <CardTitle className="text-xl font-bold tracking-tight">Edit Profile</CardTitle>
                    <CardDescription className="text-[12px]">
                        Update your personal identity. These changes will reflect across all games.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="relative group">
                            {/* Avatar Container */}
                            <Avatar className="h-28 w-28 shadow-xl">
                                <AvatarImage src={previewUrl} alt="Profile Preview" className="object-cover" />
                                <AvatarFallback className="text-xl bg-primary">
                                    {formDefaultValues.username?.charAt(0).toUpperCase() || "SG"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Upload Overlay */}
                            <label
                                htmlFor="picture-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-[2px]"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <CameraIcon className="text-white h-6 w-6" />
                                    <span className="text-[9px] text-white font-bold uppercase">Upload</span>
                                </div>
                                <input
                                    disabled={isLoading}
                                    type="file"
                                    id="picture-upload"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {profileFile && (
                            <Button
                                onClick={handleResetImage}
                                type="button"
                                size="xs"
                                variant="ghost"
                                className="text-[10px] hover:text-primary text-primary hover:bg-primary/30!"
                            >
                                <XIcon className="h-3 w-3" />
                                Reset profile picture
                            </Button>
                        )}

                        {/* Constraints Display */}
                        <div className="text-center space-y-1.5">
                            <p className="text-[10px] text-primary font-bold tracking-widest uppercase">
                                Avatar Specifications
                            </p>
                            <div className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                <span className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                    MAX SIZE: 1MB
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                    FORMATS: PNG, JPG, WEBP
                                </span>
                            </div>
                        </div>
                    </div>

                    <FieldGroup className="flex flex-col gap-4">
                        {/* Username Field */}
                        <Controller
                            name="username"
                            control={editProfileForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="spce-y-2">
                                    <Label htmlFor="username" className="text-[11px] font-bold">Username</Label>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Create a unique username"
                                        autoComplete="off"
                                        type="text"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="bio"
                            control={editProfileForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="spce-y-2">
                                    <Label htmlFor="bio" className="text-[11px] font-bold">Bio</Label>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        disabled={isLoading}
                                        placeholder="Grandmaster in the making..."
                                        className={`min-h-25 bg-background/50 resize-none ${fieldState.invalid && "border-destructive! focus-visible:ring-transparent focus-visible:border-transparent"}`}
                                        maxLength={160}
                                        autoComplete="off"
                                    />

                                    <div className={`flex items-center ${fieldState.invalid ? "justify-between" : "justify-end"}`}>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        <span className="text-[10px] text-muted-foreground">{watchedBio ? watchedBio.length : "0"}/50</span>
                                    </div>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </CardContent>

                <CardFooter className="flex gap-3 border-transparent">
                    <Button
                        onClick={() => closeUi("editProfile")}
                        type="button"
                        variant="outline"
                        className="flex-1 text-[12px] h-9"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-profile-form"
                        className="flex-1 text-[12px] h-9"
                        disabled={disableSaveChangesBtn}
                    >
                        {isLoading ? <Spinner /> : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default EditProfile;