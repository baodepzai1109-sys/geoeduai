"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  ChevronDown,
  ChevronRight,
  UserCircle2,
  UserPlus,
  Bot,
  FileText,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<string[]>([
  "Users",
]);

function toggleMenu(title: string) {
  setOpenMenus((prev) =>
    prev.includes(title)
      ? prev.filter((m) => m !== title)
      : [...prev, title]
  );
}
  const [collapse, setCollapse] = useState(false);

  const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },

  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },

  {
    title: "Users",
    icon: Users,

    children: [
      {
        title: "All Users",
        icon: UserCircle2,
        href: "/admin/users",
      },
      {
        title: "Create User",
        icon: UserPlus,
        href: "/admin/users/create",
      },
    ],
  },

  {
    title: "AI",

    icon: BrainCircuit,

    children: [
      {
        title: "AI Dashboard",
        icon: Bot,
        href: "/admin/ai",
      },
    ],
  },

  {
    title: "Forum",

    icon: MessageSquare,

    children: [
      {
        title: "Posts",
        icon: FileText,
        href: "/admin/forum",
      },
    ],
  },

  {
    title: "Maintenance",
    icon: Wrench,
    href: "/admin/maintenance",
  },

  {
    title: "Logs",
    icon: ScrollText,
    href: "/admin/logs",
  },

  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  ];

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* Sidebar */}

      <aside
  className={`
    ${
      collapse ? "w-24" : "w-72"
    }
    relative
    transition-all
    duration-300
    border-r
    border-white/10
    bg-gradient-to-b
    from-[#08101F]
    via-[#0B1228]
    to-[#050816]
    shadow-2xl
    shadow-blue-900/20
  `}
>
<div className="flex items-center gap-4">

  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 font-black shadow-lg shadow-cyan-500/30">

    G

  </div>

  {!collapse && (

    <div>

      <h1 className="text-2xl font-black">

        GeoEduAI

      </h1>

      <p className="text-xs uppercase tracking-[4px] text-cyan-400">

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

  // Menu có submenu
  if ("children" in item) {
    const opened = openMenus.includes(item.title);

    return (
      <div key={item.title} className="mb-2">

        <button
          onClick={() => toggleMenu(item.title)}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5"
        >

          <div className="flex items-center">

            <Icon size={20} />

            {!collapse && (
              <span className="ml-3">
                {item.title}
              </span>
            )}

          </div>

          {!collapse && (
            opened ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )
          )}

        </button>

        {!collapse && opened && (

          <div className="ml-6 mt-2 space-y-2 border-l border-[#22345B] pl-4">

            {(item.children ?? []).map((child) => {

              const ChildIcon = child.icon;

              const active =
                pathname === child.href;

              return (

                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center rounded-xl px-4 py-3 transition

                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >

                  <ChildIcon size={18} />

                  <span className="ml-3">

                    {child.title}

                  </span>

                </Link>

              );

            })}

          </div>

        )}

      </div>
    );
  }

  // Menu bình thường

  const active =
    pathname === item.href;

  return (

    <Link
      key={item.href}
      href={item.href}
      className={`mb-2 flex items-center rounded-xl px-4 py-3 transition

      ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-gray-300 hover:bg-white/5"
      }`}
    >

      <Icon size={20} />

      {!collapse && (

        <span className="ml-3">

          {item.title}

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