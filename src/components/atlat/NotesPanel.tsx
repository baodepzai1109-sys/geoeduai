"use client";

import { useAtlat } from "@/context/AtlatContext";

export default function NotesPanel() {
  const {
    currentPage,
    notes,
    setNotes,
  } = useAtlat();

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#12263A] p-4">
      <h3 className="mb-3 font-semibold text-white">
      </h3>

      <textarea
        value={notes[currentPage] || ""}
        onChange={(e) =>
          setNotes({
            ...notes,
            [currentPage]: e.target.value,
          })
        }
        placeholder={`Viết ghi chú cho trang ${currentPage}...`}
        className="h-28 w-full resize-none rounded-xl bg-[#081220] p-3 text-sm text-white outline-none"
      />

      <div className="mt-3 text-xs text-slate-400">
        Ghi chú được lưu tự động.
      </div>
    </div>
  );
}