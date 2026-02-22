import DefaultAvatar from "@/components/DefaultAvatar";
import RelationshipManager from "@/components/RelationshipManager";
import { formatDisplayDate } from "@/utils/dateHelpers";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // Fetch Person Public Data
  const { data: person, error } = await supabase
    .from("persons")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !person) {
    notFound();
  }

  // Fetch Private Data if Admin
  let privateData = null;
  if (isAdmin) {
    const { data } = await supabase
      .from("person_details_private")
      .select("*")
      .eq("person_id", id)
      .single();
    privateData = data;
  }

  // Construct full person object for display
  const fullPerson = { ...person, ...privateData };
  const isDeceased =
    !!person.death_year || !!person.death_month || !!person.death_day;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-amber-700 hover:text-amber-900 font-medium"
          >
            ← Quay lại danh sách
          </Link>
          {isAdmin && (
            <Link
              href={`/dashboard/members/${id}/edit`}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 font-medium text-sm"
            >
              Chỉnh sửa
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          {/* Header / Cover */}
          <div className="h-32 bg-stone-200 relative">
            <div
              className={`absolute -bottom-16 left-8 h-32 w-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-md
               ${person.gender === "male" ? "bg-sky-700" : person.gender === "female" ? "bg-rose-700" : "bg-stone-500"}`}
            >
              {person.avatar_url ? (
                <Image
                  unoptimized
                  src={person.avatar_url}
                  alt={person.full_name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar gender={person.gender} />
              )}
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
                  {fullPerson.full_name}
                  {isDeceased && (
                    <span className="text-sm font-sans font-normal text-stone-500 border border-stone-300 rounded px-2 py-0.5">
                      Đã mất
                    </span>
                  )}
                </h1>
                <p className="text-stone-500 mt-1">
                  {formatDisplayDate(
                    person.birth_year,
                    person.birth_month,
                    person.birth_day,
                  )}
                  {isDeceased &&
                    ` - ${formatDisplayDate(person.death_year, person.death_month, person.death_day)}`}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">
                    Ghi chú
                  </h2>
                  <p className="text-stone-600 whitespace-pre-wrap">
                    {fullPerson.note || "Chưa có ghi chú."}
                  </p>
                </section>

                <section>
                  {/* Placeholder for Relationship Tree */}
                  <h2 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">
                    Gia đình
                  </h2>
                  <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
                    <RelationshipManager
                      personId={person.id}
                      isAdmin={isAdmin}
                      personGender={person.gender}
                    />
                  </div>
                </section>
              </div>

              {/* Sidebar / Private Info */}
              <div className="space-y-6">
                {isAdmin ? (
                  <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                    <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <span>🔒 Thông tin liên hệ</span>
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs font-medium text-amber-800 uppercase">
                          Số điện thoại
                        </dt>
                        <dd className="text-stone-900">
                          {fullPerson.phone_number || "---"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-amber-800 uppercase">
                          Nghề nghiệp
                        </dt>
                        <dd className="text-stone-900">
                          {fullPerson.occupation || "---"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-amber-800 uppercase">
                          Nơi ở
                        </dt>
                        <dd className="text-stone-900">
                          {fullPerson.current_residence || "---"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <p className="text-sm text-stone-500 italic">
                      Thông tin liên hệ chỉ hiển thị với Admin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
