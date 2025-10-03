"use client";

import { useUser } from "@/src/hooks/useUser";
import { signOutAction } from "../login/actions";
import { useRouter } from "next/navigation";

export default function UserWidget() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) return null;

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 p-4">
      <span className="text-sm">Hola, {user.email}</span>
      <form
        action={async () => {
          await signOutAction();
          router.push("/login");
        }}
      >
        <button type="submit" className="text-sm underline hover:text-red-600">
          Logout
        </button>
      </form>
    </div>
  );
}
