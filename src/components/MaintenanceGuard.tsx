"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MaintenanceGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const res = await fetch("/api/maintenance");
        const data = await res.json();

        if (
          data.enabled &&
          pathname !== "/maintenance" &&
          !pathname.startsWith("/admin")
        ) {
          router.replace("/maintenance");
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkMaintenance();

    const interval = setInterval(checkMaintenance, 5000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  return null;
}