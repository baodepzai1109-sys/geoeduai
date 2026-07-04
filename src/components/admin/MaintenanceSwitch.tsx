"use client";

import { useEffect, useState } from "react";

export default function MaintenanceSwitch() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((r) => r.json())
      .then((d) => setEnabled(d.enabled));
  }, []);

  async function toggle() {
    await fetch("/api/maintenance", {
      method: "POST",
      body: JSON.stringify({
        enabled: !enabled,
      }),
    });

    setEnabled(!enabled);
  }

  return (
    <div className="rounded-2xl border border-[#1E2C54] bg-[#0B1228] p-6">

      <h2 className="text-xl font-bold mb-5">
        Website Maintenance
      </h2>

      <button
        onClick={toggle}
        className={`w-full rounded-xl py-4 font-bold transition ${
          enabled
            ? "bg-red-600"
            : "bg-green-600"
        }`}
      >
        {enabled
          ? "🔴 Maintenance ON"
          : "🟢 Website Online"}
      </button>

    </div>
  );
}