"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

interface ToolbarProps {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Toolbar({
  page,
  total,
  onPrev,
  onNext,
}: ToolbarProps) {

  // DOWNLOAD PDF
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/atlat.pdf";
    link.download = "Atlat-Dia-Ly.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-blue-900/40 bg-[#0E1A2B] px-5">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={onPrev}
          className="rounded-xl bg-[#12263A] p-2 text-white hover:bg-blue-600 transition"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onNext}
          className="rounded-xl bg-[#12263A] p-2 text-white hover:bg-blue-600 transition"
        >
          <ChevronRight size={20} />
        </button>

        <div className="ml-2 rounded-xl bg-[#12263A] px-4 py-2 text-sm text-white">
          Trang {page} / {total}
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <button
          onClick={handleDownload}
          className="rounded-xl bg-[#12263A] p-2 text-white hover:bg-green-600 transition"
          title="Tải PDF"
        >
          <Download size={18} />
        </button>

      </div>

    </div>
  );
}