"use client";

import { Person } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import DefaultAvatar from "./DefaultAvatar";

interface FamilyNodeCardProps {
  person: Person;
  role?: string; // e.g., "Chồng", "Vợ"
  note?: string | null;
  isMainNode?: boolean; // Determines specific border/shadow styling
  onClickCard?: () => void;
  onClickName?: (e: React.MouseEvent) => void;
  isExpandable?: boolean;
  isExpanded?: boolean;
}

export default function FamilyNodeCard({
  person,
  isMainNode = false,
  onClickCard,
  onClickName,
  isExpandable = false,
  isExpanded = false,
}: FamilyNodeCardProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isDeceased = person.is_deceased;

  const content = (
    <div
      onClick={onClickCard}
      className={`group py-2 w-20 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer relative
        ${isMainNode && isDeceased ? "grayscale opacity-80" : ""}
      `}
    >
      {/* Expand/Collapse Indicator */}
      {isExpandable && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-stone-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm z-10 text-stone-500 hover:text-stone-800 font-bold text-sm transition-colors">
          {isExpanded ? "-" : "+"}
        </div>
      )}
      {/* 1. Avatar */}
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs text-white overflow-hidden mb-1.5 sm:mb-2 shrink-0 shadow-sm
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
            className="w-full h-full object-cover"
            width={32}
            height={32}
          />
        ) : (
          <DefaultAvatar gender={person.gender} />
        )}
      </div>

      {/* 2. Gender Icon + Name */}
      <div className="flex items-center justify-center gap-1 w-full px-1 mb-0.5 sm:mb-1">
        <span
          className={`text-xs font-semibold text-center leading-tight line-clamp-2 max-w-[150px] transition-colors ${onClickName ? "text-stone-900 group-hover:text-amber-700" : "text-stone-900"}`}
          title={person.full_name}
          onClick={(e) => {
            if (onClickName) {
              e.stopPropagation();
              e.preventDefault();
              onClickName(e);
            }
          }}
        >
          {person.full_name}
        </span>
      </div>

      {/* 3. Role */}
      {/* {role && (
        <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide truncate w-full text-center leading-tight mb-0.5">
          {role} {note && `(${note})`}
        </span>
      )} */}
    </div>
  );

  if (onClickCard || onClickName) {
    return content;
  }

  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set("memberModalId", person.id);

  return (
    <Link href={`${pathname}?${newParams.toString()}`} scroll={false}>
      {content}
    </Link>
  );
}
