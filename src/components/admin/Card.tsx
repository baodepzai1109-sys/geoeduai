"use client";

import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  progress?: number;
  positive?: boolean;
  subtitle?: string;
}

export default function Card({
  title,
  value,
  icon,
  change = "+0%",
  progress = 50,
  positive = true,
  subtitle = "Compared to yesterday",
}: CardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#1D2A52] bg-[#0B1228]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,.25)]">

      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">

        <div>

          <p className="text-sm tracking-wide text-gray-400 uppercase">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            {value}
          </h2>

        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-4 text-white shadow-lg">
          {icon}
        </div>

      </div>

      {/* Change */}
      <div className="relative z-10 mt-6 flex items-center justify-between">

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            positive
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}

          {change}
        </div>

        <span className="text-xs text-gray-500">
          {subtitle}
        </span>

      </div>

      {/* Progress */}
      <div className="relative z-10 mt-6">

        <div className="mb-2 flex justify-between text-xs text-gray-500">

          <span>Performance</span>

          <span>{progress}%</span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/5">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}