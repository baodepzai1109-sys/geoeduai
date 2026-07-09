"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Home,
  Search,
  Bell,
  MessageCircle,
  Plus,
  Bookmark,
  Users,
  Award,
  Compass,
  TrendingUp,
  ChevronDown,
  MapPinned,
  ImageIcon,
  Map,
  BarChart3,
  Smile,
  Sun,
  Moon,
} from "lucide-react";

type Post = {
  id: number;
  author: string;
  avatar: string;
  category: string;
  time: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
};

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("geoedu-theme");
    if (saved === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "geoedu-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const posts: Post[] = [
    {
      id: 1,
      author: "Minh Anh",
      avatar: "/avatar1.jpg",
      category: "Địa lí tự nhiên",
      time: "2 giờ trước",
      title: "Vì sao Tây Nguyên có khí hậu phân hóa theo độ cao?",
      content:
        "Mình đang học bài về khí hậu nhưng chưa hiểu rõ nguyên nhân khí hậu Tây Nguyên thay đổi theo độ cao.",
      image: "/taynguyen.jpg",
      likes: 45,
      comments: 23,
    },
    {
      id: 2,
      author: "Gia Bảo",
      avatar: "/avatar2.jpg",
      category: "Atlas Địa lí",
      time: "4 giờ trước",
      title: "Có mẹo đọc Atlat nhanh khi đi thi THPT không?",
      content:
        "Mình mất khá nhiều thời gian tìm trang Atlat. Có ai có kinh nghiệm chia sẻ không?",
      image: "/atlas17.jpg",
      likes: 28,
      comments: 12,
    },
    {
      id: 3,
      author: "Hoàng Nam",
      avatar: "/avatar3.jpg",
      category: "Luyện thi THPT",
      time: "Hôm qua",
      title: "Xin kinh nghiệm đạt 9+ môn Địa lí",
      content:
        "Các anh chị khóa trước có thể chia sẻ cách học hiệu quả trong 3 tháng cuối không?",
      image: "",
      likes: 81,
      comments: 31,
    },
  ];

  return (
    <main
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-[#071A3B] text-white"
          : "bg-[#EEF3FB] text-gray-900"
      }`}
    >
      {/* ================= HEADER ================= */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all ${
          darkMode
            ? "bg-[#0B2248]/90 border-blue-900"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-8">

          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              width={55}
              height={55}
              alt="GeoEduAI"
              className="rounded-full"
            />

            <div>
              <h1 className="text-3xl font-black text-[#1565C0]">
                GeoEduAI
              </h1>

              <p
                className={
                  darkMode
                    ? "text-slate-300"
                    : "text-gray-500"
                }
              >
                Cộng đồng học tập Địa lí
              </p>
            </div>
          </div>

          <div className="hidden w-[620px] lg:block">
            <div className="relative">

              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className={`w-full rounded-full border py-4 pl-14 pr-5 outline-none transition ${
                  darkMode
                    ? "bg-[#133462] border-blue-900 text-white placeholder:text-slate-400"
                    : "bg-white border-gray-200"
                }`}
              />

            </div>
          </div>

          <div className="flex items-center gap-3">

            <button className="flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 font-semibold text-white transition hover:bg-[#0D47A1]">
              <Plus size={18} />
              Tạo bài viết
            </button>

            <button
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                darkMode
                  ? "bg-[#133462]"
                  : "bg-[#F3F6FC]"
              }`}
            >
              <Bell size={20} />
            </button>

            <button
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                darkMode
                  ? "bg-[#133462]"
                  : "bg-[#F3F6FC]"
              }`}
            >
              <MessageCircle size={20} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                darkMode
                  ? "bg-[#133462] text-yellow-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <div className="flex items-center gap-3">

              <Image
                src="/avatar.png"
                width={42}
                height={42}
                alt="Avatar"
                className="rounded-full"
              />

              <div className="hidden lg:block">
                <div className="font-semibold">
                  Thiên Bảo
                </div>

                <div
                  className={
                    darkMode
                      ? "text-xs text-slate-300"
                      : "text-xs text-gray-500"
                  }
                >
                  Administrator
                </div>
              </div>

              <ChevronDown size={18} />

            </div>

          </div>

        </div>

      </header>

      {/* ================= BODY ================= */}

      <div
        className="
          mx-auto
          grid
          max-w-[1700px]
          grid-cols-[280px_1fr_360px]
          gap-8
          px-8
          py-8
        "
      >
        {/* ================= LEFT SIDEBAR ================= */}

        <aside>

          <div className="sticky top-28 space-y-3">

            <MenuItem
              icon={<Home size={20} />}
              title="Trang chủ"
              active
              darkMode={darkMode}
            />

            <MenuItem
              icon={<Bookmark size={20} />}
              title="Bài viết của bạn"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<Users size={20} />}
              title="Thành viên"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<Award size={20} />}
              title="Huy hiệu"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<Compass size={20} />}
              title="Khám phá"
              darkMode={darkMode}
            />

            <div className="pt-8">

              <h3
                className={`mb-4 text-sm font-bold uppercase tracking-widest ${
                  darkMode
                    ? "text-slate-400"
                    : "text-gray-400"
                }`}
              >
                CHỦ ĐỀ
              </h3>

            </div>

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Tất cả"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Địa lí tự nhiên"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Địa lí kinh tế"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Atlas Địa lí"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Luyện thi THPT"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Kinh nghiệm học tập"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<MapPinned size={20} />}
              title="Thảo luận chung"
              darkMode={darkMode}
            />

            <div className="pt-8">

              <h3
                className={`mb-4 text-sm font-bold uppercase tracking-widest ${
                  darkMode
                    ? "text-slate-400"
                    : "text-gray-400"
                }`}
              >
                KHÁM PHÁ
              </h3>

            </div>

            <MenuItem
              icon={<TrendingUp size={20} />}
              title="Bài viết nổi bật"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<TrendingUp size={20} />}
              title="Bài viết mới nhất"
              darkMode={darkMode}
            />

            <MenuItem
              icon={<TrendingUp size={20} />}
              title="Thành viên nổi bật"
              darkMode={darkMode}
            />

          </div>

        </aside>

        {/* ================= CENTER ================= */}
                <section className="space-y-6">

          {/* ================= CREATE POST ================= */}

          <div
            className={`rounded-3xl border p-6 shadow-sm transition-all ${
              darkMode
                ? "bg-[#0B2248] border-blue-900"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">

              <Image
                src="/avatar.png"
                width={52}
                height={52}
                alt="Avatar"
                className="rounded-full"
              />

              <button
                className={`flex-1 rounded-full px-6 py-4 text-left transition ${
                  darkMode
                    ? "bg-[#133462] text-slate-300 hover:bg-[#1B4D8F]"
                    : "bg-[#F5F7FC] text-gray-500 hover:bg-[#EDF2FA]"
                }`}
              >
                Bạn đang thắc mắc điều gì về Địa lí?
              </button>

            </div>

            <div
              className={`mt-6 flex items-center justify-between border-t pt-5 ${
                darkMode
                  ? "border-blue-900"
                  : "border-gray-200"
              }`}
            >

              <button
                className={`flex items-center gap-2 rounded-xl px-5 py-3 transition ${
                  darkMode
                    ? "hover:bg-[#133462]"
                    : "hover:bg-blue-50"
                }`}
              >
                <ImageIcon size={18} />
                Ảnh
              </button>

              <button
                className={`flex items-center gap-2 rounded-xl px-5 py-3 transition ${
                  darkMode
                    ? "hover:bg-[#133462]"
                    : "hover:bg-blue-50"
                }`}
              >
                <Map size={18} />
                Atlas
              </button>

              <button
                className={`flex items-center gap-2 rounded-xl px-5 py-3 transition ${
                  darkMode
                    ? "hover:bg-[#133462]"
                    : "hover:bg-blue-50"
                }`}
              >
                <BarChart3 size={18} />
                Thăm dò
              </button>

              <button
                className={`flex items-center gap-2 rounded-xl px-5 py-3 transition ${
                  darkMode
                    ? "hover:bg-[#133462]"
                    : "hover:bg-blue-50"
                }`}
              >
                <Smile size={18} />
                Cảm xúc
              </button>

              <button className="rounded-xl bg-[#1565C0] px-8 py-3 font-semibold text-white transition hover:bg-[#0D47A1]">
                Đăng bài
              </button>

            </div>

          </div>

          {/* ================= FILTER ================= */}

          <div
            className={`flex items-center gap-8 rounded-2xl border px-6 py-4 ${
              darkMode
                ? "bg-[#0B2248] border-blue-900"
                : "bg-white border-gray-200"
            }`}
          >

            <button className="border-b-2 border-[#1565C0] pb-3 font-semibold text-[#1565C0]">
              Tất cả
            </button>

            <button className="transition hover:text-[#1565C0]">
              Đang theo dõi
            </button>

            <button className="transition hover:text-[#1565C0]">
              Mới nhất
            </button>

            <button className="transition hover:text-[#1565C0]">
              Nổi bật
            </button>

          </div>

          {/* ================= POSTS ================= */}

          <div className="space-y-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className={`overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  darkMode
                    ? "bg-[#0B2248] border-blue-900"
                    : "bg-white border-gray-200"
                }`}
              >

                {/* HEADER */}

                <div className="flex items-start justify-between p-6">

                  <div className="flex gap-4">

                    <Image
                      src={post.avatar}
                      width={56}
                      height={56}
                      alt={post.author}
                      className="rounded-full"
                    />

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="text-lg font-bold">
                          {post.author}
                        </h3>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {post.category}
                        </span>

                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          darkMode
                            ? "text-slate-400"
                            : "text-gray-500"
                        }`}
                      >
                        {post.time}
                      </p>

                    </div>

                  </div>

                  <button
                    className={`rounded-xl p-2 transition ${
                      darkMode
                        ? "hover:bg-[#133462]"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    ⋯
                  </button>

                </div>

                {/* CONTENT */}

                <div className="px-6">

                  <h2
                    className={`text-3xl font-bold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {post.title}
                  </h2>

                  <p
                    className={`mt-4 leading-8 ${
                      darkMode
                        ? "text-slate-300"
                        : "text-gray-600"
                    }`}
                  >
                    {post.content}
                  </p>

                </div>

                {post.image && (

                  <div className="mt-6 overflow-hidden">

                    <Image
                      src={post.image}
                      width={1200}
                      height={700}
                      alt={post.title}
                      className="w-full object-cover transition duration-500 hover:scale-105"
                    />

                  </div>

                )}
                                {/* ================= FOOTER ================= */}

                <div
                  className={`flex items-center justify-between px-6 py-5 text-sm ${
                    darkMode
                      ? "text-slate-300"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span>❤️ {post.likes}</span>
                    <span>👍 18</span>
                    <span>🔥 6</span>
                  </div>

                  <div>
                    {post.comments} bình luận
                  </div>
                </div>

                <hr
                  className={
                    darkMode
                      ? "border-blue-900"
                      : "border-gray-200"
                  }
                />

                {/* ================= ACTION ================= */}

                <div className="grid grid-cols-4">

                  <ActionButton
                    icon="👍"
                    text="Thích"
                    darkMode={darkMode}
                  />

                  <ActionButton
                    icon="💬"
                    text="Bình luận"
                    darkMode={darkMode}
                  />

                  <ActionButton
                    icon="↗"
                    text="Chia sẻ"
                    darkMode={darkMode}
                  />

                  <ActionButton
                    icon="🔖"
                    text="Lưu"
                    darkMode={darkMode}
                  />

                </div>

                <hr
                  className={
                    darkMode
                      ? "border-blue-900"
                      : "border-gray-200"
                  }
                />

                {/* ================= COMMENT ================= */}

                <div className="p-6">

                  <div className="flex gap-4">

                    <Image
                      src="/avatar2.jpg"
                      width={42}
                      height={42}
                      alt="Quang Huy"
                      className="rounded-full"
                    />

                    <div
                      className={`flex-1 rounded-2xl p-4 ${
                        darkMode
                          ? "bg-[#133462]"
                          : "bg-[#F5F7FC]"
                      }`}
                    >

                      <div className="font-semibold">
                        Quang Huy
                      </div>

                      <p
                        className={`mt-2 leading-7 ${
                          darkMode
                            ? "text-slate-300"
                            : "text-gray-700"
                        }`}
                      >
                        Theo mình nguyên nhân chính là nhiệt độ giảm theo độ cao.
                        Trung bình cứ lên khoảng 100m thì nhiệt độ giảm khoảng
                        0,6°C nên khí hậu Tây Nguyên phân hóa rất rõ.
                      </p>

                      <div
                        className={`mt-3 flex gap-5 text-sm ${
                          darkMode
                            ? "text-slate-400"
                            : "text-gray-500"
                        }`}
                      >

                        <button className="hover:text-blue-500">
                          Thích
                        </button>

                        <button className="hover:text-blue-500">
                          Trả lời
                        </button>

                        <span>
                          1 giờ trước
                        </span>

                      </div>

                    </div>

                  </div>

                  <button className="mt-5 text-sm font-semibold text-[#1565C0] hover:underline">
                    Xem thêm bình luận...
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ================= RIGHT SIDEBAR ================= */}

        <aside>

          <div className="sticky top-28 space-y-6">
                        {/* ================= AI ASSISTANT ================= */}

            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-[#1565C0]
                to-[#0D47A1]
                p-6
                text-white
                shadow-xl
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/20
                    text-3xl
                  "
                >
                  🤖
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    GeoEduAI Assistant
                  </h3>

                  <p className="text-sm text-blue-100">
                    Hỏi AI mọi kiến thức Địa lí
                  </p>

                </div>

              </div>

              <button
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-white
                  py-3
                  font-bold
                  text-[#1565C0]
                  transition
                  hover:scale-105
                "
              >
                Đặt câu hỏi ngay
              </button>

            </div>

            {/* ================= TREND ================= */}

            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                darkMode
                  ? "bg-[#0B2248] border-blue-900"
                  : "bg-white border-gray-200"
              }`}
            >

              <h3 className="mb-5 text-xl font-bold">
                🔥 Xu hướng hôm nay
              </h3>

              <div className="space-y-5">

                <TrendItem
                  tag="#ThiTHPT2027"
                  posts="1.245 bài viết"
                  darkMode={darkMode}
                />

                <TrendItem
                  tag="#AtlasĐịaLí"
                  posts="865 bài viết"
                  darkMode={darkMode}
                />

                <TrendItem
                  tag="#ĐịaLí12"
                  posts="542 bài viết"
                  darkMode={darkMode}
                />

                <TrendItem
                  tag="#BiếnĐổiKhíHậu"
                  posts="489 bài viết"
                  darkMode={darkMode}
                />

              </div>

            </div>

            {/* ================= TOP MEMBER ================= */}

            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                darkMode
                  ? "bg-[#0B2248] border-blue-900"
                  : "bg-white border-gray-200"
              }`}
            >

              <h3 className="mb-5 text-xl font-bold">
                🏆 Thành viên nổi bật
              </h3>

              <div className="space-y-5">

                <Member
                  avatar="/avatar1.jpg"
                  name="Nguyễn Minh"
                  role="Giáo viên Địa lí"
                  darkMode={darkMode}
                />

                <Member
                  avatar="/avatar2.jpg"
                  name="Khánh Linh"
                  role="Học sinh THPT"
                  darkMode={darkMode}
                />

                <Member
                  avatar="/avatar3.jpg"
                  name="Quốc Huy"
                  role="Chuyên gia GIS"
                  darkMode={darkMode}
                />

              </div>

            </div>

            {/* ================= STATISTICS ================= */}

            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                darkMode
                  ? "bg-[#0B2248] border-blue-900"
                  : "bg-white border-gray-200"
              }`}
            >

              <h3 className="mb-5 text-xl font-bold">
                📊 Thống kê cộng đồng
              </h3>

              <div className="space-y-4">

                <StatItem
                  title="Bài viết"
                  value="12.845"
                  darkMode={darkMode}
                />

                <StatItem
                  title="Thành viên"
                  value="5.291"
                  darkMode={darkMode}
                />

                <StatItem
                  title="Bình luận"
                  value="82.163"
                  darkMode={darkMode}
                />

                <StatItem
                  title="Lượt thích"
                  value="315K"
                  darkMode={darkMode}
                />

              </div>

            </div>

          </div>

        </aside>

      </div>

    </main>

  );

}
/* ================= COMPONENTS ================= */

function MenuItem({
  icon,
  title,
  active = false,
  darkMode,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  darkMode: boolean;
}) {
  return (
    <button
      className={`
        flex
        w-full
        items-center
        gap-4
        rounded-2xl
        px-5
        py-4
        transition-all
        duration-300

        ${
          active
            ? "bg-[#1565C0] text-white shadow-lg"
            : darkMode
            ? "bg-[#0B2248] text-slate-200 hover:bg-[#133462]"
            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-[#1565C0]"
        }
      `}
    >
      {icon}

      <span className="font-semibold">
        {title}
      </span>
    </button>
  );
}

function ActionButton({
  icon,
  text,
  darkMode,
}: {
  icon: string;
  text: string;
  darkMode: boolean;
}) {
  return (
    <button
      className={`
        flex
        items-center
        justify-center
        gap-2
        py-4
        font-semibold
        transition-all
        duration-300

        ${
          darkMode
            ? "text-slate-300 hover:bg-[#133462] hover:text-white"
            : "text-gray-600 hover:bg-[#F5F8FF] hover:text-[#1565C0]"
        }
      `}
    >
      <span className="text-lg">
        {icon}
      </span>

      {text}
    </button>
  );
}

function TrendItem({
  tag,
  posts,
  darkMode,
}: {
  tag: string;
  posts: string;
  darkMode: boolean;
}) {
  return (
    <div>

      <p
        className={`cursor-pointer font-semibold transition ${
          darkMode
            ? "hover:text-blue-400"
            : "hover:text-blue-600"
        }`}
      >
        {tag}
      </p>

      <p
        className={
          darkMode
            ? "text-sm text-slate-400"
            : "text-sm text-gray-500"
        }
      >
        {posts}
      </p>

    </div>
  );
}

function Member({
  avatar,
  name,
  role,
  darkMode,
}: {
  avatar: string;
  name: string;
  role: string;
  darkMode: boolean;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Image
          src={avatar}
          width={48}
          height={48}
          alt={name}
          className="rounded-full"
        />

        <div>

          <div className="font-semibold">
            {name}
          </div>

          <div
            className={
              darkMode
                ? "text-sm text-slate-400"
                : "text-sm text-gray-500"
            }
          >
            {role}
          </div>

        </div>

      </div>

      <button
        className="
          rounded-xl
          bg-blue-100
          px-4
          py-2
          text-sm
          font-semibold
          text-[#1565C0]
          transition
          hover:bg-[#1565C0]
          hover:text-white
        "
      >
        Follow
      </button>

    </div>
  );
}

function StatItem({
  title,
  value,
  darkMode,
}: {
  title: string;
  value: string;
  darkMode: boolean;
}) {
  return (
    <div className="flex items-center justify-between">

      <span
        className={
          darkMode
            ? "text-slate-400"
            : "text-gray-500"
        }
      >
        {title}
      </span>

      <span className="font-bold text-[#1565C0]">
        {value}
      </span>

    </div>
  );
}
