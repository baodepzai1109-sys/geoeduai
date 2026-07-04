"use client";
import { ReactNode, useState } from "react";

import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  BarChart3,
  Settings,
  Wrench,
  ScrollText,
  MessageSquare,
  Menu,
  Bell,
  Search,
  ChevronLeft,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
    
  const [collapse, setCollapse] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "AI",
      href: "/admin/ai",
      icon: BrainCircuit,
    },
    {
      name: "Forum",
      href: "/admin/forum",
      icon: MessageSquare,
    },
    {
      name: "Maintenance",
      href: "/admin/maintenance",
      icon: Wrench,
    },
    {
      name: "Logs",
      href: "/admin/logs",
      icon: ScrollText,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* Sidebar */}

      <aside
        className={`transition-all duration-300 border-r border-[#1E2C54]
        ${
          collapse ? "w-24" : "w-72"
        } bg-[#08101F]`}
      >
        <div className="flex h-20 items-center justify-between px-6">

          {!collapse && (
            <div>
              <h1 className="text-2xl font-bold">
                GeoEduAI
              </h1>

              <p className="text-xs text-blue-400">
                ADMIN PANEL
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapse(!collapse)}
            className="rounded-xl p-2 hover:bg-blue-500/10"
          >
            {collapse ? (
              <Menu />
            ) : (
              <ChevronLeft />
            )}
          </button>
        </div>

        <div className="px-4">

          {menus.map((item) => {

            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-2 flex items-center rounded-xl px-4 py-3 transition

                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <Icon size={20} />

                {!collapse && (
                  <span className="ml-3">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

      </aside>

      {/* Main */}

      <main className="flex-1">

        {/* Navbar */}

        <header className="flex h-20 items-center justify-between border-b border-[#1E2C54] bg-[#08101F] px-8">

          <div className="flex items-center gap-3 rounded-xl border border-[#1E2C54] bg-[#0B1228] px-4 py-3 w-96">

            <Search
              size={18}
              className="text-gray-500"
            />

            <input
              placeholder="Search..."
              className="w-full bg-transparent outline-none"
            />

          </div>

          <div className="flex items-center gap-6">

            <button className="relative rounded-xl bg-[#0B1228] p-3 hover:bg-blue-600 transition">

              <Bell />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

            </button>

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 rounded-full bg-blue-500 flex items-center justify-center font-bold">

                B

              </div>

              <div>

                <div className="font-semibold">

                  Thiên Bảo

                </div>

                <div className="text-xs text-green-400">

                  ● Online

                </div>

              </div>

            </div>

          </div>

        </header>

        <div className="p-8">

          {children}

        </div>

      </main>

    </div>
  );
}