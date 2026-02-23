"use client";

import MemberDetailContent from "@/components/MemberDetailContent";
import { Person } from "@/types";
import { createClient } from "@/utils/supabase/client";
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

  if (!isOpen) return null;

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
        ) : person ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <MemberDetailContent
              person={person}
              privateData={privateData}
              isAdmin={isAdmin}
              onLinkClick={closeModal}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
