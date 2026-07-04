"use client";

import { AtlatProvider } from "@/context/AtlatContext";
import Header from "@/components/atlat/Header";
import Sidebar from "@/components/atlat/Sidebar";
import AssistantPanel from "@/components/atlat/AssistantPanel";
import ThumbnailPanel from "@/components/atlat/ThumbnailPanel";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/atlat/PdfViewer"),
  {
    ssr: false,
  }
);

export default function AtlatPage() {
  return (
    <AtlatProvider>
      <main className="h-screen overflow-hidden bg-[#081220] text-white">
        {/* Header */}
        <Header />

        {/* Body */}
        <section className="flex h-[calc(100vh-72px)] overflow-hidden">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 border-r border-blue-900/40">
            <Sidebar />
          </aside>

          {/* Thumbnail */}
          <aside className="hidden xl:block w-40 border-r border-blue-900/40">
            <ThumbnailPanel />
          </aside>

          {/* PDF */}
          <main className="flex-1 min-w-0 min-h-0 overflow-hidden p-1 md:p-4">
            <div className="flex h-full min-w-0 min-h-0 flex-col overflow-hidden rounded-none md:rounded-3xl border border-blue-900/40 bg-[#12263A] shadow-2xl">
              <PdfViewer />
            </div>
          </main>

          {/* AI */}
          <aside className="hidden 2xl:block w-[420px] border-l border-blue-900/40">
            <AssistantPanel />
          </aside>

        </section>
      </main>
    </AtlatProvider>
  );
}