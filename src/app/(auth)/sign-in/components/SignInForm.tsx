"use client";

import { signInAction, signOutAction } from "@/actions/auth";

import { Button } from "@/components/ui/button";

const SignInForm = () => {
  const handleSignIn = async () => {
    await signInAction("hualocson@gmail.com");
  };

  const handleSignOut = async () => {
    await signOutAction();
  };
  return (
    <div>
      <Button onClick={handleSignIn}>Sign in with Email</Button>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};

export default SignInForm;
