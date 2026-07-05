"use client";

import { Wrench, RefreshCw, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface MaintenanceData {
  enabled: boolean;
  title: string;
  description: string;
  finish_time?: string;
}

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState(30);

  const [maintenance, setMaintenance] =
    useState<MaintenanceData>({
      enabled: true,
      title: "GeoEduAI đang bảo trì",
      description:
        "Chúng tôi đang nâng cấp hệ thống.",
      finish_time: "--:--",
    });

  async function loadMaintenance() {
    try {
      const res = await fetch("/api/maintenance", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.enabled) {
        window.location.href = "/";
        return;
      }

      setMaintenance(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadMaintenance();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadMaintenance();
          return 30;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] text-white">

      {/* Background */}

      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[180px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[180px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Card */}

      <div className="relative z-10 w-full max-w-xl rounded-[36px] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-2xl">

        <div className="inline-flex rounded-full bg-orange-500/20 p-6">

          <Wrench
            size={48}
            className="animate-pulse text-orange-400"
          />

        </div>

        <h1 className="mt-8 text-5xl font-black">
          {maintenance.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-300">
          {maintenance.description}
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0B1228] p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Clock size={18} />

              <span>Dự kiến hoàn thành</span>

            </div>

            <span>
              {maintenance.finish_time || "--:--"}
            </span>

          </div>

          <div className="mt-5 h-3 rounded-full bg-white/10">

            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{
                width: "72%",
              }}
            />

          </div>

          <p className="mt-3 text-sm text-gray-400">
            GeoEduAI đang được nâng cấp...
          </p>

        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold transition hover:scale-[1.02]"
        >

          <RefreshCw size={22} />

          Kiểm tra lại ngay

        </button>

        <p className="mt-6 text-sm text-gray-400">

          Tự động kiểm tra lại sau{" "}

          <span className="font-bold text-cyan-400">
            {countdown}s
          </span>

        </p>

        <p className="mt-8 text-xs text-gray-500">
          © 2026 GeoEduAI
        </p>

      </div>

    </main>
  );
}