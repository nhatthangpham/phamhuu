"use client";

import { Person } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RootSelector({
  persons,
  currentRootId,
}: {
  persons: Person[];
  currentRootId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default to finding the current root person
  const currentRootPerson = persons.find((p) => p.id === currentRootId);

  const filteredPersons = persons.filter((p) =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (personId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("rootId", personId);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <label className="block text-xs font-medium text-stone-500 mb-1">
        Gốc Gia Phả
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-stone-300 transition-colors"
      >
        <span className="truncate text-stone-700 font-medium">
          {currentRootPerson ? currentRootPerson.full_name : "Chọn người..."}
        </span>
        <svg
          className="w-4 h-4 text-stone-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-stone-100">
            <input
              type="text"
              className="w-full text-stone-900 placeholder-stone-400 bg-stone-50 border border-stone-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredPersons.length > 0 ? (
              filteredPersons.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleSelect(person.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    person.id === currentRootId
                      ? "bg-amber-50 text-amber-900 font-medium"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {person.full_name}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-stone-500">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
