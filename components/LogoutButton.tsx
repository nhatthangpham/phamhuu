"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh(); // Refresh to clear any cached Server Component data
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
