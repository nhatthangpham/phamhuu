"use client";

import PersonCard from "@/components/PersonCard";
import { Person } from "@/types";
import Link from "next/link";
import { useState } from "react";

export default function DashboardMemberList({
  initialPersons,
}: {
  initialPersons: Person[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("birth_asc");

  const [filterOption, setFilterOption] = useState("all");

  const filteredPersons = initialPersons.filter((person) => {
    const matchesSearch = person.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    switch (filterOption) {
      case "male":
        matchesFilter = person.gender === "male";
        break;
      case "female":
        matchesFilter = person.gender === "female";
        break;
      case "in_law_female":
        matchesFilter = person.gender === "female" && person.is_in_law;
        break;
      case "in_law_male":
        matchesFilter = person.gender === "male" && person.is_in_law;
        break;
      case "deceased":
        matchesFilter = person.is_deceased;
        break;
      case "all":
      default:
        matchesFilter = true;
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const sortedPersons = [...filteredPersons].sort((a, b) => {
    switch (sortOption) {
      case "birth_asc":
        return (a.birth_year || 9999) - (b.birth_year || 9999);
      case "birth_desc":
        return (b.birth_year || 0) - (a.birth_year || 0);
      case "name_asc":
        return a.full_name.localeCompare(b.full_name, "vi");
      case "name_desc":
        return b.full_name.localeCompare(a.full_name, "vi");
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              className="bg-stone-50 text-stone-900 w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <select
              className="bg-stone-50 text-stone-900 w-full sm:w-36 px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer transition-colors"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="in_law_female">Dâu</option>
              <option value="in_law_male">Rể</option>
              <option value="deceased">Đã mất</option>
            </select>
            <select
              className="bg-stone-50 text-stone-900 w-full sm:w-48 px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer transition-colors"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="birth_asc">Năm sinh (Tăng dần)</option>
              <option value="birth_desc">Năm sinh (Giảm dần)</option>
              <option value="name_asc">Tên (A-Z)</option>
              <option value="name_desc">Tên (Z-A)</option>
            </select>
          </div>
        </div>
        <Link
          href="/dashboard/members/new"
          className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors w-full sm:w-auto justify-center shrink-0 shrink-0"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm thành viên
        </Link>
      </div>

      {sortedPersons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPersons.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-stone-500">
          {initialPersons.length > 0
            ? "Không tìm thấy thành viên phù hợp."
            : "Chưa có thành viên nào. Hãy thêm thành viên đầu tiên."}
        </div>
      )}
    </>
  );
}
