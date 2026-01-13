"use client"
import { Button } from "@/components/ui/button";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockIcon, UserIcon, XIcon } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AuthFormPropsType } from "@/components/modals/AuthModal";
import { signupSchema, SignupSchemaType } from "@/hooks/auth/useSignup";


const Signup = ({
  uiReducers: { openUi, closeUi },
  isLoading,
  setAuth,
  validationErrors,
  schema,
  executeService,
}: AuthFormPropsType<SignupSchemaType, z.infer<typeof signupSchema>>): React.ReactElement => {
  // Local states
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Signup form
  const signupForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });
  return (
    <form id="signup-form" className="w-full" onSubmit={signupForm.handleSubmit(executeService)}>

      {/* ===== Form header ===== */}
      <header className="flex sm:justify-center items-center sm:text-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Create Your Account</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">Join the ultimate Tic-Tac-Toe multiplayer experience</p>
        </div>

        <Button onClick={() => closeUi("auth")} size="icon-lg" variant="outline" className="sm:hidden">
          <XIcon />
        </Button>
      </header>

      {/* ===== Validation errors =====  */}
      {validationErrors.length > 0 && (
        <div className="overflow-hidden my-4">
          <div className="flex flex-col bg-destructive/10 border border-destructive h-64 overflow-y-auto p-2 gap-2 element-scrollable-hidden-scrollbar">
            <p className="text-xs text-destructive border-b border-destructive pb-1.5">Validation errors</p>
            <div className="flex flex-col gap-2 text-destructive px-4">
              {validationErrors.map((error, i) => {
                return (
                  <li key={i}>{error.field} - {error.message}</li>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== Form body ===== */}
      <FieldGroup className="mt-4 flex flex-col gap-2">
        {/* ===== Username ===== */}
        <Controller
          name="username"
          control={signupForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <UserIcon className="absolute left-2 top-2 size-4 text-muted-foreground" />
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Create a unique username"
                  autoComplete="off"
                  className="pl-9 text-muted-foreground"
                  type="text"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ===== Email ===== */}
        <Controller
          name="email"
          control={signupForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <EnvelopeIcon className="absolute left-2 top-2 size-4 text-muted-foreground" />
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Email address"
                  autoComplete="off"
                  className="pl-9 text-muted-foreground"
                  type="email"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ===== Password ===== */}
        <Controller
          name="password"
          control={signupForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <LockIcon className="absolute left-2 top-2 size-4 text-muted-foreground" />
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                  autoComplete="off"
                  className="pr-10 pl-10 text-muted-foreground"
                  type={showPassword ? "text" : "password"}
                />

                {/* Password visibility trigger */}
                <Button type="button" onClick={() => setShowPassword(!showPassword)} variant="ghost" className="absolute right-2 top-2 size-4 text-muted-foreground">
                  {showPassword ? (
                    <EyeIcon />
                  ) : (<EyeSlashIcon />)}
                </Button>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* ===== Form footer ===== */}
      <footer className="mt-4">
        <Button disabled={isLoading} type="submit" form="signup-form" className="w-full">
          {isLoading ? <Spinner /> : "Signup"}
        </Button>

        <div className="text-center mt-6 flex items-center justify-center">
          <p
            onClick={() => {
              if (isLoading) return;
              openUi("auth")
              setAuth("login")
            }}
            className={`w-fit text-xs text-muted-foreground transition-all duration-100 ${isLoading ? "opacity-70" : "hover:underline hover:text-primary cursor-pointer"}`}>
            Already have an account?
          </p>
        </div>
      </footer>
    </form>
  );
};

export default Signup;