import React from "react";

import { redirect } from "next/navigation";

import { auth } from "@/configs/auth.config";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center px-3 py-24 md:px-4">
      {children}
    </div>
  );
}
