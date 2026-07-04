"use client";

import {
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  NotebookPen,
  History,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import NotesPanel from "./NotesPanel";
import { useAtlat } from "@/context/AtlatContext";
import { atlatMenu } from "@/data/atlatMenu";

export default function Sidebar() {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    bookmarks,
    setBookmarks,
    history,
    setHistory,
    recentPages,
    scrollToPage,
  setScrollToPage,
  } = useAtlat();
const [openRecent, setOpenRecent] = useState(true);
  const [keyword, setKeyword] = useState("");
const [showClearHistory, setShowClearHistory] = useState(false);
  const [openMenu, setOpenMenu] = useState(true);
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openNotes, setOpenNotes] = useState(false);
const [openHistory, setOpenHistory] = useState(false);
  const filtered = atlatMenu.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase())
  );

  function toggleBookmark() {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((p) => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage].sort((a, b) => a - b));
    }
  }
function clearHistory() {
  setHistory([]);
  setShowClearHistory(false);
}
function formatTime(time: number) {
  const diff = Date.now() - time;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Vừa xong";

  if (diff < hour)
    return `${Math.floor(diff / minute)} phút trước`;

  if (diff < day)
    return `${Math.floor(diff / hour)} giờ trước`;

  return new Date(time).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
  return (
    <aside className="flex h-full flex-col bg-[#0E1A2B]">
      {/* Header */}
      <div className="border-b border-slate-800 p-5">
        <h2 className="text-xl font-bold text-white">
           Thư viện Atlat
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          GeoEdu AI
        </p>
      </div>

      {/* Nội dung */}
      <div className="flex-1 space-y-5 overflow-y-auto p-4 custom-scroll">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-3 text-slate-500"
          />

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm bản đồ..."
            className="w-full rounded-xl border border-slate-700 bg-[#081220] py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-400"
          />
        </div>

        {/* Mục lục */}
        <div className="rounded-xl bg-[#12263A]">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <span className="font-semibold text-white">
              Mục lục
            </span>

            {openMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openMenu && (
            <div className="max-h-80 overflow-y-auto pb-2 custom-scroll">
              {filtered.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setScrollToPage(item.page)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left transition ${
                    currentPage === item.page
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-[#18324A]"
                  }`}
                >
                  <span className="text-sm">
                    {item.title}
                  </span>

                  <span className="text-xs opacity-70">
                    {item.page}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bookmark */}
        <div className="rounded-xl bg-[#12263A]">
          <button
            onClick={() =>
              setOpenBookmark(!openBookmark)
            }
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Star
                size={16}
                className="text-yellow-400"
              />

              <span className="font-semibold text-white">
                Bookmark
              </span>
            </div>

            {openBookmark ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openBookmark && (
            <div className="px-4 pb-4">
              <button
                onClick={toggleBookmark}
                className={`mb-3 w-full rounded-lg py-2 text-sm transition ${
                  bookmarks.includes(currentPage)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {bookmarks.includes(currentPage)
                  ? "Bỏ bookmark"
                  : "Lưu bookmark"}
              </button>

              <div className="max-h-40 space-y-2 overflow-y-auto custom-scroll">
                {bookmarks.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Chưa có bookmark
                  </p>
                )}

                {bookmarks.map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className="flex w-full justify-between rounded-lg bg-[#081220] px-3 py-2 text-sm text-slate-300 transition hover:bg-blue-700"
                  >
                    <span>Trang {page}</span>

                    <span>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
{/* Recently Viewed */}

<div className="mt-5 rounded-xl bg-[#12263A]">
  <button
    onClick={() => setOpenRecent(!openRecent)}
    className="flex w-full items-center justify-between px-4 py-3"
  >
      <div className="flex items-center gap-2">
        <History
        size={16}
        className="text-green-400"
      />
    <span className="font-semibold text-white">
      Lịch sử
    </span>
    </div>
    {openRecent ? (
      <ChevronDown size={18}/>
    ) : (
      <ChevronRight size={18}/>
    )}
  </button>

  {openRecent && (

<div className="space-y-2">

{recentPages.map((item) => (

  <button
    key={item.page}
    onClick={() => setCurrentPage(item.page)}
    className="
      flex
      w-full
      items-center
      justify-between
      rounded-xl
      border
      border-slate-700
      bg-[#081220]
      px-4
      py-3
      transition
      hover:border-cyan-500
      hover:bg-cyan-500/10
    "
  >

    <div>

      <p className="font-semibold text-white">
        Trang {item.page}
      </p>

      <p className="mt-1 text-xs text-slate-400">
         {formatTime(item.time)}
      </p>

    </div>

    <ArrowRight
      size={18}
      className="text-cyan-400"
    />

  </button>

))}

  {recentPages.length === 0 && (

    <div className="rounded-xl bg-[#081220] p-4 text-center text-sm text-slate-500">
      Chưa có trang nào được xem
    </div>

  )}

</div>

  )}

</div>
        {/* Notes */}
        <div className="rounded-xl bg-[#12263A]">
          <button
            onClick={() =>
              setOpenNotes(!openNotes)
            }
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <NotebookPen
                size={16}
                className="text-cyan-400"
              />

              <span className="font-semibold text-white">
                Ghi chú
              </span>
            </div>

            {openNotes ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openNotes && (
            <div className="px-4 pb-4">
              <NotesPanel />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">
            Trang
          </span>

          <span className="text-cyan-400">
            {currentPage}/{totalPages}
          </span>
        </div>

        <div className="h-2 rounded-full bg-[#081220]">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{
              width: `${(currentPage / totalPages) * 100}%`,
            }}
          />
        </div>
      </div>
      {showClearHistory && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-80 rounded-2xl bg-[#12263A] p-6 shadow-2xl">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
          🗑️
        </div>

        <h3 className="text-lg font-semibold text-white">
          Xóa lịch sử?
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Toàn bộ lịch sử xem Atlat sẽ bị xóa.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowClearHistory(false)}
          className="flex-1 rounded-xl border border-slate-700 py-2 text-slate-300 hover:bg-slate-700"
        >
          Hủy
        </button>

        <button
          onClick={clearHistory}
          className="flex-1 rounded-xl bg-red-500 py-2 font-medium text-white hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
)}
    </aside>
  );
}