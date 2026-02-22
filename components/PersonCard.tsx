"use client";

import { Person } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import DefaultAvatar from "./DefaultAvatar";
import { FemaleIcon, MaleIcon } from "./GenderIcons";

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isDeceased = person.is_deceased;

  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set("memberModalId", person.id);

  return (
    <Link
      href={`${pathname}?${newParams.toString()}`}
      scroll={false}
      className={`group block relative bg-white p-5 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        ${isDeceased ? "opacity-75 grayscale-[0.6]" : ""}`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden shrink-0
          ${person.gender === "male" ? "bg-sky-700" : person.gender === "female" ? "bg-rose-700" : "bg-stone-500"}`}
        >
          {person.avatar_url ? (
            <Image
              unoptimized
              src={person.avatar_url}
              alt={person.full_name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar gender={person.gender} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
              {person.full_name}
              {person.gender === "male" && (
                <MaleIcon className="w-4 h-4 text-sky-500" />
              )}
              {person.gender === "female" && (
                <FemaleIcon className="w-4 h-4 text-rose-400" />
              )}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {isDeceased && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200 uppercase tracking-widest">
                  Đã mất
                </span>
              )}
              {person.is_in_law && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-widest ${
                    person.gender === "male"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : person.gender === "female"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  {person.gender === "male"
                    ? "Rể"
                    : person.gender === "female"
                      ? "Dâu"
                      : "Khách"}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-stone-500 truncate">
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
    </Link>
  );
}
