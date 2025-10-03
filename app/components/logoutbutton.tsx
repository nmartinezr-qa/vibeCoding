"use client";

import { getBrowserSupabase } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      } else {
        console.log("✅ Logout successful");
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center justify-center h-9 px-4 rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#111] text-sm"
    >
      Logout
    </button>
  );
}
