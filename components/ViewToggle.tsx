"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ViewMode = "list" | "tree" | "mindmap";

export default function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = (searchParams.get("view") as ViewMode) || "list";

  const setView = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-stone-200/50 p-1 rounded-lg border border-stone-200 shadow-inner w-fit mx-auto mt-4 mb-2">
      <button
        onClick={() => setView("list")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out cursor-pointer ${
          currentView === "list"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
            : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Danh sách
        </div>
      </button>

      <button
        onClick={() => setView("tree")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out cursor-pointer ${
          currentView === "tree"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
            : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>
          Sơ đồ cây
        </div>
      </button>

      <button
        onClick={() => setView("mindmap")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
          currentView === "mindmap"
            ? "bg-white text-amber-700 shadow-sm border border-stone-200/50"
            : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M9 14h6"></path>
            <path d="M9 10h6"></path>
            <path d="M9 18h6"></path>
          </svg>
          Mindmap
        </div>
      </button>
    </div>
  );
}
