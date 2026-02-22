import MemberForm from "@/components/MemberForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewMemberPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-xl font-serif font-bold text-stone-800">
            Thêm Thành Viên Mới
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemberForm isAdmin={isAdmin} />
      </main>
    </div>
  );
}
