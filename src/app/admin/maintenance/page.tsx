"use client";

import { useEffect, useState } from "react";
import {
  Wrench,
  Save,
  Clock,
  ShieldAlert,
  Globe,
} from "lucide-react";

export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);

  const [title, setTitle] = useState(
    "GeoEduAI đang bảo trì"
  );

  const [description, setDescription] = useState(
    "Chúng tôi đang nâng cấp hệ thống để mang đến trải nghiệm tốt hơn. Vui lòng quay lại sau."
  );

  const [finishTime, setFinishTime] =
    useState("04/07/2026 22:30");
const [saving, setSaving] = useState(false);

useEffect(() => {
  loadMaintenance();
}, []);

async function loadMaintenance() {
  const res = await fetch("/api/maintenance");
  const data = await res.json();

  setEnabled(data.enabled);
  setTitle(data.title);
  setDescription(data.description);
  setFinishTime(data.finish_time);
}

async function saveMaintenance() {
  try {
    setSaving(true);

    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enabled,
        title,
        description,
        finish_time: finishTime,
      }),
    });

    if (!res.ok) {
      throw new Error();
    }

    alert("Đã lưu thành công");
    window.location.reload();
  } catch (e) {
    alert("Lưu thất bại");
    console.error(e);
  } finally {
    setSaving(false);
  }
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#08101F] to-[#050816] text-white">

      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-black tracking-tight">
              Website Maintenance
            </h1>

            <p className="mt-2 text-gray-400">
              Quản lý chế độ bảo trì của GeoEduAI
            </p>

          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4">

            <div className="text-xs uppercase tracking-wider text-cyan-400">
              Production
            </div>

            <div className="mt-1 font-semibold">
              geoaiedu.vn
            </div>

          </div>

        </div>

        {/* STATUS */}

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-[#101B34] to-[#0B1228] shadow-2xl">

          <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-6">

              <div
                className={`flex h-24 w-24 items-center justify-center rounded-3xl ${
                  enabled
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                }`}
              >

                <ShieldAlert
                  size={42}
                  className={
                    enabled
                      ? "text-red-400"
                      : "text-green-400"
                  }
                />

              </div>

              <div>

                <h2 className="text-3xl font-bold">

                  {enabled
                    ? "Maintenance Enabled"
                    : "Website Online"}

                </h2>

                <p className="mt-3 text-gray-400">

                  {enabled
                    ? "Toàn bộ người dùng sẽ được chuyển tới trang bảo trì."
                    : "Website hiện đang hoạt động bình thường."}

                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setEnabled(!enabled)
              }
              className={`rounded-2xl px-10 py-5 text-lg font-bold transition-all duration-300 hover:scale-105 ${
                enabled
                  ? "bg-red-600 shadow-xl shadow-red-500/30"
                  : "bg-green-600 shadow-xl shadow-green-500/30"
              }`}
            >

              {enabled
                ? "Disable Maintenance"
                : "Enable Maintenance"}

            </button>

          </div>

          <div
            className={`h-1 ${
              enabled
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          />

        </div>

        {/* CONTENT */}

        <div className="grid gap-8 xl:grid-cols-2">

          {/* SETTINGS */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-[#101B34] to-[#0B1228] p-8 shadow-2xl">

            <div className="mb-8 flex items-center gap-3">

              <Globe className="text-cyan-400" />

              <h2 className="text-2xl font-bold">
                Maintenance Settings
              </h2>

            </div>

            <div className="space-y-6">

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#2A3F6D] bg-[#08101F] px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-[#2A3F6D] bg-[#08101F] p-5 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Finish Time
                </label>

                <input
                  value={finishTime}
                  onChange={(e) =>
                    setFinishTime(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-[#2A3F6D] bg-[#08101F] px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />

              </div>

              <button
  onClick={saveMaintenance}
  disabled={saving}
  className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold transition hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-60"
>
  <Save size={22} />

  {saving ? "Đang lưu..." : "Save Changes"}
</button>

            </div>

          </div>

          {/* PREVIEW */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-[#101B34] to-[#0B1228] p-8 shadow-2xl">

            <div className="mb-8 flex items-center gap-3">

              <Wrench className="text-orange-400" />

              <h2 className="text-2xl font-bold">
                Live Preview
              </h2>

            </div>

            <div className="rounded-[28px] border border-[#22345B] bg-[#08101F] p-10 text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-orange-500/15">

                <Wrench
                  size={52}
                  className="animate-pulse text-orange-400"
                />

              </div>

              <h1 className="mt-8 text-4xl font-black">

                {title}

              </h1>

              <p className="mx-auto mt-6 max-w-md leading-8 text-gray-400">

                {description}

              </p>

              <div className="mt-10 flex justify-center">

                <div className="rounded-full bg-cyan-500/10 px-6 py-3">

                  <div className="flex items-center gap-2 text-cyan-400">

                    <Clock size={18} />

                    <span>{finishTime}</span>

                  </div>

                </div>

              </div>

              <div className="mt-12">

                <div className="mx-auto h-3 w-72 overflow-hidden rounded-full bg-[#1A2745]">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    style={{
                      width: "70%",
                    }}
                  />

                </div>

                <p className="mt-4 text-sm text-gray-500">

                  Đang cập nhật hệ thống...

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}