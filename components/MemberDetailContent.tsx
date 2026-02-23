"use client";

import DefaultAvatar from "@/components/DefaultAvatar";
import { FemaleIcon, MaleIcon } from "@/components/GenderIcons";
import RelationshipManager from "@/components/RelationshipManager";
import { Person } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MemberDetailContentProps {
  person: Person;
  privateData: Record<string, unknown> | null;
  isAdmin: boolean;
  onLinkClick?: () => void;
}

export default function MemberDetailContent({
  person,
  privateData,
  isAdmin,
  onLinkClick,
}: MemberDetailContentProps) {
  const fullPerson = { ...person, ...privateData };
  const isDeceased =
    !!person.death_year || !!person.death_month || !!person.death_day;
  const pathname = usePathname();
  const isModalView = pathname !== `/dashboard/members/${person.id}`;

  return (
    <>
      {/* Header / Cover */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-stone-200 to-stone-100 relative shrink-0">
        <div
          className={`absolute -bottom-12 sm:-bottom-16 left-6 sm:left-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-[6px] border-stone-50 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white overflow-hidden shadow-md shrink-0 bg-stone-100
           ${
             person.gender === "male"
               ? "bg-sky-700"
               : person.gender === "female"
                 ? "bg-rose-700"
                 : "bg-stone-500"
           }`}
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
                ` - ${formatDisplayDate(
                  person.death_year,
                  person.death_month,
                  person.death_day,
                )}`}
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
                {(fullPerson.note as string) || "Chưa có ghi chú."}
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-800 mb-3 sm:mb-4 border-b pb-2">
                Gia đình
              </h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-stone-100 shadow-sm relative z-0">
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
                      {(fullPerson.phone_number as string) || "---"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-amber-800 uppercase">
                      Nghề nghiệp
                    </dt>
                    <dd className="text-stone-900 mt-0.5">
                      {(fullPerson.occupation as string) || "---"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-amber-800 uppercase">
                      Nơi ở
                    </dt>
                    <dd className="text-stone-900 mt-0.5">
                      {(fullPerson.current_residence as string) || "---"}
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

            {/* Link action (Only show in Modal view) */}
            {isModalView && (
              <div className="pt-4 border-t border-stone-200">
                <Link
                  href={`/dashboard/members/${person.id}`}
                  onClick={onLinkClick}
                  className="block w-full py-2 text-center text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200/50"
                >
                  Mở trang chi tiết đầy đủ ↗
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
