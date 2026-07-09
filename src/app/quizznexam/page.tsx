"use client";

import { useState } from "react";
import QuizPage from "../quizz/page";
import TestPage from "../dethi/page";
import {
  Brain,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function QuizAIPage() {
  const [tab, setTab] = useState<"quiz" | "test">("test");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-[#08152f] to-slate-950 text-white">

      {/* Background Glow */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[140px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-10">

        {/* Header */}

        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/50 p-8 backdrop-blur-xl">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600">

              <Sparkles size={32} />

            </div>

            <div>

              <h1 className="text-4xl font-black">

                Quiz & AI Tạo Đề

              </h1>

              <p className="mt-2 text-slate-400">

                Hệ thống tạo đề kiểm tra và luyện tập Địa lí bằng AI.

              </p>

            </div>

          </div>

        </div>

        {/* Tabs */}

        <div className="mt-8 flex gap-4">
            <button
  onClick={() => setTab("test")}
  className={`flex flex-1 items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold transition-all duration-300 ${
    tab === "test"
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_35px_rgba(34,211,238,.45)]"
      : "border border-cyan-500/20 bg-slate-900/50 hover:border-cyan-400/40"
  }`}
>
  <Brain size={24} />

  AI Tạo Đề
</button>

<button
  onClick={() => setTab("quiz")}
  className={`flex flex-1 items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold transition-all duration-300 ${
    tab === "quiz"
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_35px_rgba(34,211,238,.45)]"
      : "border border-cyan-500/20 bg-slate-900/50 hover:border-cyan-400/40"
  }`}
>
  <GraduationCap size={24} />

  Quiz Địa Lí
</button>

</div>

<div className="mt-8 overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl shadow-[0_0_45px_rgba(34,211,238,.08)]">
  {/* Thanh tiêu đề */}

  <div className="flex items-center justify-between border-b border-cyan-500/10 bg-slate-900/60 px-8 py-5">

    <div>

      <h2 className="text-2xl font-bold">
        {tab === "test"
          ? "AI Tạo Đề Kiểm Tra"
          : "Quiz Địa Lí"}
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        {tab === "test"
          ? "Tạo đề kiểm tra tự động bằng AI theo SGK."
          : "Luyện tập kiến thức Địa lí với hệ thống Quiz."}
      </p>

    </div>

    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">

      {tab === "test"
        ? "AI Generator"
        : "Quiz Mode"}

    </div>

  </div>

  {/* Nội dung */}

  <div className="min-h-[800px] bg-transparent">
    {tab === "test" ? (
      <TestPage />
    ) : (
      <QuizPage />
    )}
  </div>

</div>
      </div>

  </main>
);
}