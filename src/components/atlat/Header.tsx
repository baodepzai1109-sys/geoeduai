"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, UserCircle2 } from "lucide-react";
import { useAtlat } from "@/context/AtlatContext";

export default function Header() {
  const {
    notifications,
    setNotifications,
  } = useAtlat();

  const [openNotification, setOpenNotification] =
    useState(false);
const [, forceUpdate] = useState(0);
  const unread = notifications.some(
    (n) => !n.read
  );
const getTimeAgo = (time: number) => {
  const diff = Date.now() - time;

  const minutes = Math.floor(diff / 60000);

  if (minutes <= 0) return "Vừa xong";

  if (minutes < 60)
    return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);

  if (days < 30)
    return `${days} ngày trước`;

  const months = Math.floor(days / 30);

  if (months < 12)
    return `${months} tháng trước`;

  return `${Math.floor(months / 12)} năm trước`;
};
useEffect(() => {
  const timer = setInterval(() => {
    forceUpdate((v) => v + 1);
  }, 60000);

  return () => clearInterval(timer);
}, []);
  const handleOpenNotification = () => {
    setOpenNotification((v) => !v);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  return (
    <header
      className="
      relative
      z-[9999]
      h-[72px]
      border-b
      border-blue-900/40
      bg-[#0B1727]
      backdrop-blur-xl
      "
    >
      <div className="flex h-full items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-4">

          <div
            className="
            relative
            h-12
            w-12
            overflow-hidden
            rounded-2xl
            border
            border-cyan-500/30
            bg-[#081220]
            shadow-lg
            shadow-cyan-500/20
            "
          >
            <Image
              src="/images/logo.png"
              alt="GeoEdu AI"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-wide text-white">
              GeoAI Atlat
            </h1>

            <p className="text-sm text-slate-400">
              Thư viện Atlat số
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="ml-auto flex items-center gap-4">

          {/* Notification */}

          <div className="relative">

            <button
              onClick={handleOpenNotification}
              className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-blue-900/40
              bg-[#12263A]
              transition-all
              duration-300
              hover:border-cyan-400
              hover:bg-[#17385B]
              hover:shadow-lg
              hover:shadow-cyan-500/20
              "
            >
              <Bell
                size={20}
                className="text-white"
              />

              {unread && (
                <span
                  className="
                  absolute
                  right-2
                  top-2
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-red-500
                  ring-2
                  ring-[#12263A]
                  "
                />
              )}
            </button>

            {openNotification && (
              <>
  <div
    className="fixed inset-0 z-40"
    onClick={() => setOpenNotification(false)}
  />

  <div
    className="
      absolute
      right-0
      top-14
      z-50
      w-[380px]
      overflow-hidden
      rounded-3xl
      border
      border-cyan-500/20
      bg-[#0F2238]
      shadow-2xl
      shadow-black/50
      backdrop-blur-xl
    "
  >
    {/* Header */}
    <div className="border-b border-slate-700/60 bg-gradient-to-r from-[#163454] to-[#10253A] px-5 py-4">
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-bold text-white">
            Thông báo
          </h3>

          <p className="text-xs text-slate-400">
            Cập nhật mới từ GeoEdu AI
          </p>
        </div>

        <div className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
          {notifications.length}
        </div>

      </div>
    </div>

    {/* Body */}

    <div className="max-h-[420px] overflow-y-auto">

      {notifications.length === 0 ? (

        <div className="py-12 text-center">

          <Bell
            size={42}
            className="mx-auto mb-3 text-slate-600"
          />

          <p className="text-slate-400">
            Không có thông báo
          </p>

        </div>

      ) : (

        notifications.map((item) => (

          <div
            key={item.id}
            className="
              group
              flex
              gap-4
              border-b
              border-slate-700/60
              px-5
              py-4
              transition-all
              duration-300
              hover:bg-[#17385B]
            "
          >

            {/* Logo */}

            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white">

              <Image
                src="/images/logo.png"
                alt="logo"
                fill
                className="object-cover"
              />

            </div>

            {/* Content */}

            <div className="flex-1">

              <div className="flex items-center gap-2">

                <h4 className="font-semibold text-white">
                  {item.title}
                </h4>

                {!item.read && (

                  <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    NEW
                  </span>

                )}

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.content}
              </p>

              <div className="mt-3 flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  GeoEdu AI
                </span>

              <span className="text-xs text-slate-500">
                {getTimeAgo(item.createdAt)}
              </span>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

    {/* Footer */}

    <div className="border-t border-slate-700 bg-[#10253A] p-3">

      <button
        className="
          w-full
          rounded-xl
          bg-cyan-600
          py-2.5
          font-semibold
          text-white
          transition
          hover:bg-cyan-500
        "
      >
        Xem tất cả thông báo
      </button>

    </div>

  </div>
</>
)}
</div>
{/* User */}
<div
  className="
    flex
    items-center
    gap-3
    rounded-2xl
    border
    border-blue-900/40
    bg-[#12263A]
    px-3
    py-2
  "
>
  <UserCircle2
    size={34}
    className="text-cyan-400"
  />

  <div className="hidden md:block">
    <p className="text-sm font-semibold text-white">
      GeoAI User
    </p>

    <p className="text-xs text-slate-400">
      Student
    </p>
  </div>
</div>
</div>
</div>
</header>
);
}