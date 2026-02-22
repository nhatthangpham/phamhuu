"use client";

import { Person, Relationship } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import DefaultAvatar from "./DefaultAvatar";

interface MindmapTreeProps {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
}

export default function MindmapTree({
  personsMap,
  relationships,
  roots,
}: MindmapTreeProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper function to resolve tree connections for a person
  const getTreeData = (personId: string) => {
    const spousesList = relationships
      .filter(
        (r) =>
          r.type === "marriage" &&
          (r.person_a === personId || r.person_b === personId),
      )
      .map((r) => {
        const spouseId = r.person_a === personId ? r.person_b : r.person_a;
        return {
          person: personsMap.get(spouseId)!,
          note: r.note,
        };
      })
      .filter((s) => s.person);

    const childRels = relationships.filter(
      (r) =>
        (r.type === "biological_child" || r.type === "adopted_child") &&
        r.person_a === personId,
    );

    const childrenList = childRels
      .map((r) => personsMap.get(r.person_b))
      .filter(Boolean) as Person[];

    return {
      person: personsMap.get(personId)!,
      spouses: spousesList,
      children: childrenList,
    };
  };

  const MindmapNode = ({
    personId,
    level = 0,
    isLast = false,
  }: {
    personId: string;
    level?: number;
    isLast?: boolean;
  }) => {
    const data = getTreeData(personId);
    const [isExpanded, setIsExpanded] = useState(level < 2); // Expand first 2 levels by default

    if (!data.person) return null;

    const hasChildren = data.children.length > 0;

    return (
      <div className="relative pl-6 py-1">
        {/* Draw the connecting L-shape line from the parent to this node */}
        {level > 0 && (
          <>
            <div
              className="absolute border-l-2 border-stone-300"
              style={{
                left: "0",
                top: isLast ? "-10px" : "-10px",
                bottom: isLast ? "auto" : "-10px",
                height: isLast ? "34px" : "100%", // 24px half height + 10px overlap
              }}
            ></div>
            <div
              className="absolute border-b-2 border-stone-300"
              style={{
                left: "0",
                top: "24px",
                width: "24px",
              }}
            ></div>
          </>
        )}

        <div className="flex items-center gap-2 group">
          {/* Expand/Collapse Toggle or spacer */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0 z-10 bg-white">
            {hasChildren ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-stone-50 border border-stone-200 rounded-md text-stone-500 hover:text-stone-800 focus:outline-none transition-colors shadow-sm"
                aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
              >
                {isExpanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </button>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
            )}
          </div>

          {(() => {
            const mainParams = new URLSearchParams(searchParams.toString());
            mainParams.set("memberModalId", data.person.id);
            return (
              <div className="group flex flex-wrap items-center gap-2 bg-white rounded-xl border border-stone-200 p-1.5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-200">
                <Link
                  href={`${pathname}?${mainParams.toString()}`}
                  className="flex items-center gap-2 pr-2"
                  scroll={false}
                >
                  <div
                    className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm
                ${
                  data.person.gender === "male"
                    ? "bg-sky-700"
                    : data.person.gender === "female"
                      ? "bg-rose-700"
                      : "bg-stone-500"
                }`}
                  >
                    {data.person.avatar_url ? (
                      <Image
                        unoptimized
                        src={data.person.avatar_url}
                        alt={data.person.full_name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar gender={data.person.gender} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight">
                      {data.person.full_name}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {formatDisplayDate(
                        data.person.birth_year,
                        data.person.birth_month,
                        data.person.birth_day,
                      )}{" "}
                      {data.person.death_year ||
                      data.person.death_month ||
                      data.person.death_day
                        ? ` - ${formatDisplayDate(
                            data.person.death_year,
                            data.person.death_month,
                            data.person.death_day,
                          )}`
                        : ""}
                    </span>
                  </div>
                </Link>

                {/* Spouses attached to node */}
                {data.spouses.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-1 border-l border-stone-200 pl-2">
                    {data.spouses.map((spouseData) => {
                      const spouseParams = new URLSearchParams(
                        searchParams.toString(),
                      );
                      spouseParams.set("memberModalId", spouseData.person.id);
                      return (
                        <Link
                          key={spouseData.person.id}
                          href={`${pathname}?${spouseParams.toString()}`}
                          scroll={false}
                          className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg p-1.5 border border-stone-100 hover:border-stone-200 transition-colors"
                          title={
                            spouseData.note ||
                            (spouseData.person.gender === "male"
                              ? "Chồng"
                              : "Vợ")
                          }
                        >
                          <div
                            className={`w-7 h-7 rounded-md overflow-hidden shrink-0 flex items-center justify-center text-white text-[9px] font-bold shadow-sm opacity-90
                      ${
                        spouseData.person.gender === "male"
                          ? "bg-sky-700"
                          : spouseData.person.gender === "female"
                            ? "bg-rose-700"
                            : "bg-stone-500"
                      }`}
                          >
                            {spouseData.person.avatar_url ? (
                              <Image
                                unoptimized
                                src={spouseData.person.avatar_url}
                                alt={spouseData.person.full_name}
                                width={24}
                                height={24}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <DefaultAvatar
                                gender={spouseData.person.gender}
                              />
                            )}
                          </div>
                          <span className="text-xs font-medium text-stone-600">
                            {spouseData.person.full_name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Children Container */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {data.children.map((child, index) => (
              <MindmapNode
                key={child.id}
                personId={child.id}
                level={level + 1}
                isLast={index === data.children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (roots.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">Không có dữ liệu</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-50 p-4 sm:p-6 overflow-x-auto min-h-[calc(100vh-140px)]">
      {/* Root Container */}
      <div className="font-sans">
        {roots.map((root, index) => (
          <MindmapNode
            key={root.id}
            personId={root.id}
            level={0}
            isLast={index === roots.length - 1} // At root level
          />
        ))}
      </div>
    </div>
  );
}
