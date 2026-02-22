"use client";

import DefaultAvatar from "@/components/DefaultAvatar";
import { FemaleIcon, MaleIcon } from "@/components/GenderIcons";
import RelationshipManager from "@/components/RelationshipManager";
import { Person } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MemberDetailModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const memberId = searchParams.get("memberModalId");
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [person, setPerson] = useState<Person | null>(null);
  const [privateData, setPrivateData] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Close modal by removing query parameter while keeping others
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("memberModalId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchData = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        // 1. Check auth / role
        let currentIsAdmin = isAdmin;
        if (!authChecked) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();
            currentIsAdmin = profile?.role === "admin";
            setIsAdmin(currentIsAdmin);
          }
          setAuthChecked(true);
        }

        // 2. Fetch Person Public Data
        const { data: personData, error: personError } = await supabase
          .from("persons")
          .select("*")
          .eq("id", id)
          .single();

        if (personError || !personData) {
          throw new Error("Không thể tải thông tin thành viên.");
        }
        setPerson(personData);

        // 3. Fetch Private Data if Admin
        if (currentIsAdmin) {
          const { data: privData } = await supabase
            .from("person_details_private")
            .select("*")
            .eq("person_id", id)
            .single();
          setPrivateData(privData || {});
        }
      } catch (err) {
        console.error("Error fetching member details:", err);
        // @ts-expect-error - err is caught as unknown, but we check for message
        setError(err?.message || "Đã xảy ra lỗi hệ thống.");
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, authChecked, supabase],
  );

  // Sync state with URL parameter
  useEffect(() => {
    if (memberId) {
      setIsOpen(true);
      fetchData(memberId);
    } else {
      setIsOpen(false);
      // Clean up previous data when closing to prevent flash on next open
      setTimeout(() => {
        setPerson(null);
        setPrivateData(null);
        setError(null);
      }, 300);
    }
  }, [memberId, fetchData]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const fullPerson = person ? { ...person, ...privateData } : null;
  const isDeceased =
    person &&
    (!!person.death_year || !!person.death_month || !!person.death_day);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click-away backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-stone-50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Sticky Header Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {isAdmin && person && (
            <Link
              href={`/dashboard/members/${person.id}/edit`}
              className="px-3 py-1.5 bg-amber-50/90 backdrop-blur-md text-amber-700 rounded-lg hover:bg-amber-100 font-semibold text-xs shadow-sm border border-amber-200/50 transition-colors"
              onClick={closeModal}
            >
              Chỉnh sửa
            </Link>
          )}
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-md text-stone-500 rounded-full hover:bg-stone-100 hover:text-stone-900 shadow-sm border border-stone-200/50 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 min-h-[400px] flex items-center justify-center flex-col gap-3">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-500 font-medium">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex-1 min-h-[400px] flex items-center justify-center flex-col gap-4 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : person && fullPerson ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Header / Cover */}
            <div className="h-24 sm:h-32 bg-gradient-to-r from-stone-200 to-stone-100 relative shrink-0">
              <div
                className={`absolute -bottom-12 sm:-bottom-16 left-6 sm:left-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-[6px] border-stone-50 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white overflow-hidden shadow-md shrink-0 bg-stone-100
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

            <div className="pt-16 sm:pt-20 px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2 sm:gap-3 flex-wrap">
                    {fullPerson.full_name}
                    {fullPerson.gender === "male" && (
                      <MaleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500" />
                    )}
                    {fullPerson.gender === "female" && (
                      <FemaleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
                    )}
                    {isDeceased && (
                      <span className="text-xs sm:text-sm font-sans font-normal text-stone-500 border border-stone-300 rounded px-2 py-0.5 whitespace-nowrap">
                        Đã mất
                      </span>
                    )}
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 mt-1">
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

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-800 mb-3 sm:mb-4 border-b pb-2">
                      Ghi chú
                    </h2>
                    <p className="text-stone-600 whitespace-pre-wrap text-sm sm:text-base">
                      {fullPerson.note || "Chưa có ghi chú."}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-800 mb-3 sm:mb-4 border-b pb-2">
                      Gia đình
                    </h2>
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-stone-100 shadow-sm relative z-0">
                      {/* RelationshipManager inside a modal might cause some z-index issues with its own modals, 
                          but typically `fixed inset-0` on child modals covers parent. We'll verify this later. */}
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
                    <div className="bg-amber-50 p-4 sm:p-5 rounded-lg border border-amber-100">
                      <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <span>🔒 Thông tin liên hệ</span>
                      </h3>
                      <dl className="space-y-3 text-sm sm:text-base">
                        <div>
                          <dt className="text-xs font-medium text-amber-800 uppercase">
                            Số điện thoại
                          </dt>
                          <dd className="text-stone-900 mt-0.5">
                            {fullPerson.phone_number || "---"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-amber-800 uppercase">
                            Nghề nghiệp
                          </dt>
                          <dd className="text-stone-900 mt-0.5">
                            {fullPerson.occupation || "---"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-amber-800 uppercase">
                            Nơi ở
                          </dt>
                          <dd className="text-stone-900 mt-0.5">
                            {fullPerson.current_residence || "---"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div className="bg-stone-100/50 p-4 rounded-lg border border-stone-200 border-dashed">
                      <p className="text-sm text-stone-500 italic text-center">
                        Thông tin liên hệ chỉ hiển thị với Admin.
                      </p>
                    </div>
                  )}

                  {/* Link action */}
                  <div className="pt-4 border-t border-stone-200">
                    <Link
                      href={`/dashboard/members/${person.id}`}
                      onClick={closeModal}
                      className="block w-full py-2 text-center text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200/50"
                    >
                      Mở trang chi tiết đầy đủ ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
