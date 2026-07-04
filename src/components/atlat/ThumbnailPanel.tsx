"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAtlat } from "@/context/AtlatContext";

export default function ThumbnailPanel() {
const {
  currentPage,
  totalPages,
  setScrollToPage,
  setCurrentPage,
  visitedPages,
  bookmarks,
  notes,
} = useAtlat();

  const listRef = useRef<HTMLDivElement>(null);

  // Tự cuộn thumbnail theo trang hiện tại
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const active = container.querySelector(
      `[data-thumb="${currentPage}"]`
    ) as HTMLElement | null;

    if (!active) return;

    const top =
      active.offsetTop -
      container.clientHeight / 2 +
      active.clientHeight / 2;

    container.scrollTo({
      top,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="flex h-full flex-col bg-[#0B1625]">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-700 bg-[#10253A] px-4 py-3">
        <h3 className="text-lg font-semibold text-white">
          Xem Trước
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {totalPages} trang
        </p>
      </div>

      {/* Danh sách thumbnail */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-4 p-4"
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              data-thumb={page}
              onClick={() => setScrollToPage(page)}
              className={`group relative w-full rounded-2xl border transition-all duration-200 ${
                currentPage === page
                  ? "scale-[1.03] border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                  : visitedPages.includes(page)
                  ? "border-emerald-500/40 bg-emerald-500/10 hover:border-cyan-400"
                  : "border-slate-700 bg-[#12263A] hover:border-cyan-400 hover:bg-[#18324A]"
              }`}
            >
              {bookmarks.includes(page) && (
  <div className="absolute right-2 top-2 rounded-full bg-yellow-400 p-1">
    ⭐
  </div>
)}
            {notes[page] && (
    <div className="absolute left-2 top-2 rounded-full bg-sky-500 px-2 py-1 text-[10px] text-white">
        📝
    </div>
)}
              <div className="flex justify-center p-3">
                <Image
                  src={`/thumbnails/page-${page}.png`}
                  alt={`Trang ${page}`}
                  width={120}
                  height={170}
                  priority={page <= 4}
                  loading={page <= 4 ? "eager" : "lazy"}
                  className="rounded-lg border border-slate-700"
                />
              </div>

              <div
                 className={`flex items-center justify-between border-t px-2 py-2 text-sm font-medium ${
                  currentPage === page
                    ? "border-cyan-500 text-cyan-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                <span>Trang {page}</span>

                {visitedPages.includes(page) && (
                  <span className="text-emerald-400">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}