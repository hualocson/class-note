"use client";

import { useTransition } from "react";

import { Loader2Icon, LogInIcon, ShellIcon } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = () => {
    startTransition(async () => {
      await signIn("google");
    });
  };
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <ShellIcon className="text-primary h-6 w-6" />
          </div>
          <h1 className="text-foreground text-2xl font-semibold">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <Button
          type="button"
          onClick={handleSignIn}
          disabled={isPending}
          className="h-11 w-full font-medium"
        >
          {isPending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <LogInIcon className="h-4 w-4" />
          )}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
