import React, { useState } from "react";
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockIcon, XIcon } from "@phosphor-icons/react";
import { useAppDispatch } from "@/redux/store";
import { setAuthTrigger, setBooleanTrigger } from "@/redux/slices/triggers-slice";
import { Spinner } from "@/components/ui/spinner";
import useLogin from "@/hooks/useLogin";



const Login = (): React.ReactElement => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { isLoading, extra, executeService } = useLogin();
  const validationErrors = extra?.validationErrors || [];
  const loginSchema = extra?.schema!

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  return (
    <form id="login-form" className="w-full" onSubmit={loginForm.handleSubmit(executeService)}>
      <header className="flex sm:justify-center items-center sm:text-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">Login to continue your Tic-Tac-Toe journey</p>
        </div>

        <Button onClick={() => dispatch(setBooleanTrigger({ key: "auth", value: false }))} size="icon-lg" variant="outline" className="sm:hidden">
          <XIcon />
        </Button>
      </header>

      {/* ===== Validation errors =====  */}
      {validationErrors.length > 0 && (
        <div className="overflow-hidden my-4">
          <div className="flex flex-col bg-destructive/10 border border-destructive h-64 overflow-y-auto p-2 gap-2">
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

      <FieldGroup className="mt-4 flex flex-col gap-2">
        {/* ===== Email ===== */}
        <Controller
          name="email"
          control={loginForm.control}
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
          control={loginForm.control}
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

        {/* Forgot password? */}
        <div className="flex items-center justify-end mt-2">
          <p
            onClick={() => {
              if (isLoading) return;
              return dispatch(setAuthTrigger("signup"))
            }}
            className={`text-xs text-muted-foreground transition-all duration-100 ${isLoading ? "opacity-70" : "hover:underline hover:text-primary cursor-pointer"}`}>
            Forgot password?
          </p>
        </div>
      </FieldGroup>

      <footer className="mt-4">
        <Button disabled={isLoading} type="submit" form="login-form" className="w-full">
          {isLoading ? <Spinner /> : "Login"}
        </Button>

        <div className="text-center mt-6 flex items-center justify-center">
          <p
            onClick={() => {
              if (isLoading) return;
              return dispatch(setAuthTrigger("signup"))
            }}
            className={`w-fit text-xs text-muted-foreground transition-all duration-100 ${isLoading ? "opacity-70" : "hover:underline hover:text-primary cursor-pointer"}`}>
            Don't have an account?
          </p>
        </div>
      </footer>
    </form>
  );
};

export default Login;