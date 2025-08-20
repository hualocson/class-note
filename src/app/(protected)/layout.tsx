import { redirect } from "next/navigation";

import { auth } from "@/configs/auth.config";

import BottomNavigation from "@/components/navigation/BottomNavigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <div className="pb-20">{children}</div>
      {/* Bottom Navigation - always visible */}
      <BottomNavigation />
    </>
  );
}
