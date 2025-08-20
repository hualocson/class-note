"use server";

import { signIn, signOut } from "@/lib/auth/config";

export async function signInAction(email: string) {
  return await signIn("resend", { email });
}

export async function signOutAction() {
  return await signOut();
}
