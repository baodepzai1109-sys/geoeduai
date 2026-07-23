"use client";
import CreatePostModal from "@/components/community/CreatePostModal";
import { useEffect, useState, useRef } from "react";
import CommentSection from "@/components/community/CommentSection";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
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
  MoreHorizontal,
  Share2,
  Pencil,
  Heart,
  ThumbsUp,
  Flame,
  Link2,
  Flag,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

type Post = {
    id: string;
    title: string;
    content: string;
    author: string;
    images: string[];
    created_at: string;
};

export default function CommunityPage() {
  const [title, setTitle] = useState("");
  const router = useRouter(); 
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const reactionTimeout = useRef<NodeJS.Timeout | null>(null);
  const [hoverReaction, setHoverReaction] = useState<string | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const [openProfile, setOpenProfile] = useState(false);
  const [category, setCategory] = useState("Thảo luận chung");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [openModal, setOpenModal] = useState(false);
const [content, setContent] = useState("");
const [previewImage, setPreviewImage] = useState<string | null>(null);
const [images, setImages] = useState<File[]>([]);
const [deletePostId, setDeletePostId] = useState<string | null>(null);
const [deleting, setDeleting] = useState(false);
const [openMenu, setOpenMenu] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
async function handleLogout() {
    await logout();

    router.push("/login");
}
async function quickLike(post: any) {

    const info = reactionInfo(post);

    // nếu đang Like thì bỏ Like
    if (info.reaction === "like") {
        await reactPost(post.id, "like");
        return;
    }

    // nếu đang tim hoặc fire thì chuyển thành like
    await reactPost(post.id, "like");

}
  async function loadPosts() {
  const { data, error } = await supabase
 .from("posts")
  .select(`
    *,
    profiles(
      full_name,
      avatar_url
    ),
    post_reactions(
      id,
      user_id,
      reaction
    )
  `)
  .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setPosts(data ?? []);
}
function countReaction(post: any, type: string) {
    return (
        post.post_reactions?.filter(
            (r: any) => r.reaction === type
        ).length ?? 0
    );
}

function myReaction(post: any) {
    return post.post_reactions?.find(
        (r: any) => r.user_id === user?.id
    );
}
function reactionInfo(post: any) {

    const mine = myReaction(post);

    switch (mine?.reaction) {

        case "heart":
            return {
                reaction: "heart",
                icon: <Heart size={20} fill="currentColor"/>,
                text: "Yêu thích",
                color: "text-red-500",
            };

        case "fire":
            return {
                reaction: "fire",
                icon: <Flame size={20} fill="currentColor"/>,
                text: "Hot",
                color: "text-orange-500",
            };

        case "like":
            return {
                reaction: "like",
                icon: <ThumbsUp size={20} fill="currentColor"/>,
                text: "Hữu ích",
                color: "text-blue-500",
            };

        default:
            return {
                reaction: null,
                icon: <ThumbsUp size={20}/>,
                text: "Thích",
                color: "",
            };

    }

}
async function createPost() {
  if (!user) {
  setOpenAuthModal(true);
  return;
}
  if (!title.trim() || !content.trim()) {
    alert("Vui lòng nhập tiêu đề và nội dung.");
    return;
  }

  setLoading(true);
const imageUrls: string[] = [];

for (const image of images) {

  const ext = image.name.split(".").pop();

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    const { error: uploadError } =
        await supabase.storage
            .from("post-image")
            .upload(fileName, image);

    if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
    }

    const { data } =
        supabase.storage
            .from("post-image")
            .getPublicUrl(fileName);

    imageUrls.push(data.publicUrl);
}
const { error } = await supabase
  .from("posts")
.insert([
  {
    user_id: user?.id,
    title,
    content,
    category,
    images: imageUrls,
  },
]);
  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  setTitle("");
  setContent("");
setImages([]);
  await loadPosts();
}
async function deletePost() {
    if (!deletePostId) return;

    setDeleting(true);

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deletePostId);
 console.log("Delete error:", error);
    setDeleting(false);

    if (error) {
        alert(error.message);
        return;
    }

    setDeletePostId(null);

    await loadPosts();
}
async function reactPost(
    postId: string,
    reaction: "heart" | "like" | "fire"
) {

    if (!user) {
        setOpenAuthModal(true);
        return;
    }

    const post = posts.find(
        (p) => p.id === postId
    );

    const mine = post?.post_reactions?.find(
        (r: any) => r.user_id === user.id
    );

    if (!mine) {

        await supabase
            .from("post_reactions")
            .insert({
                post_id: postId,
                user_id: user.id,
                reaction,
            });

    } else {

        if (mine.reaction === reaction) {

            await supabase
                .from("post_reactions")
                .delete()
                .eq("id", mine.id);

        } else {

            await supabase
                .from("post_reactions")
                .update({
                    reaction,
                })
                .eq("id", mine.id);

        }

    }

    loadPosts();

}
  useEffect(() => {
    const saved = localStorage.getItem("geoedu-theme");
    if (saved === "dark") {
      setDarkMode(true);
    }
     loadPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "geoedu-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const [posts, setPosts] = useState<any[]>([]);
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
        <div
className="
mx-auto
flex
h-16
h-16 
lg:h-20
items-center
justify-between
px-4
lg:px-8
gap-3
"
>

          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              width={36}
              height={36}
              alt="GeoEduAI"
              className="rounded-full"
            />

            <div>
              <h1 className="text-xl lg:text-xl lg:text-3xl font-black text-[#1565C0]">
                GeoEduAI
              </h1>

              <p
  className={`text-[10px] sm:text-xs lg:text-base leading-tight ${
    darkMode ? "text-slate-300" : "text-gray-500"
  }`}
>
  <span className="lg:hidden">Cộng đồng học tập Địa lí</span>
  <span className="hidden lg:inline">
    Cộng đồng học tập Địa lí
  </span>
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

<button
    onClick={() => {
    if (!user) {
      setOpenModal(false);
        setOpenAuthModal(true);
        return;
    }

    setOpenModal(true);
}}
   className="
hidden
md:flex
items-center
gap-2
text-white
rounded-xl
bg-[#1565C0]
px-6
py-3
"
>
    <Plus size={18} />
    Tạo bài viết
</button>

            <button
              className={`flex h-10 w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full ${
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
{user ? (
            <div className="relative flex items-center gap-3">

              <Image
    src={user?.avatar_url || "/avatar.png"}
                width={36}
                height={36}
                alt="Avatar"
                className="rounded-full"
              />

              <div className="hidden lg:block">
                <div className="font-semibold">
                  {user?.full_name || "Người dùng"}
                </div>
<div
  className={
    darkMode
      ? "text-xs text-slate-300"
      : "text-xs text-gray-500"
  }
>
  {user?.role === "admin" ? "Administrator" : "User"}
</div>
              </div>

              <ChevronDown
  size={18}
  className="cursor-pointer"
  onClick={() => setOpenProfile(!openProfile)}
/>
        {openProfile && (
  <div
    className={`absolute right-0 top-14 z-50 w-72 rounded-3xl border shadow-2xl overflow-hidden ${
      darkMode
        ? "bg-[#0B2248] border-blue-900"
        : "bg-white border-gray-200"
    }`}
  >
    <div className="p-6 text-center">
      <Image
        src={user?.avatar_url || "/avatar.png"}
        width={70}
        height={70}
        alt="Avatar"
        className="mx-auto rounded-full"
      />

      <h3 className="mt-3 font-bold text-lg">
        {user?.full_name || "Người dùng"}
      </h3>

      <p
        className={`text-sm ${
          darkMode ? "text-slate-400" : "text-gray-500"
        }`}
      >
        {user?.email}
      </p>
    </div>

    <div
      className={`border-t ${
        darkMode ? "border-blue-900" : "border-gray-200"
      }`}
    >
<button
    onClick={() => {
        setOpenProfile(false);
        if (!user) {
    setOpenAuthModal(true);
    return;
}

router.push("/community/profile");
    }}
    className={`w-full px-5 py-3 text-left transition ${
        darkMode
            ? "hover:bg-[#133462]"
            : "hover:bg-gray-100"
    }`}
>
    Hồ sơ cá nhân
</button>

      <button
        className={`w-full px-5 py-3 text-left transition ${
          darkMode
            ? "hover:bg-[#133462]"
            : "hover:bg-gray-100"
        }`}
      >
        Cài đặt
      </button>

<button
    onClick={handleLogout}
    className="
    w-full
    px-5
    py-3
    text-left
    text-red-500
    hover:bg-red-50
    "
>
    Đăng xuất
</button>
    </div>
  </div>
)}
            </div>
) : (
<button
    onClick={() => setOpenAuthModal(true)}
    className="
    flex
    items-center
    justify-center
    gap-2

    rounded-xl

    bg-[#1565C0]
    text-white
    shadow-lg

    transition
    hover:bg-[#0D47A1]
    "
>

    {/* Mobile */}
    <span className="flex sm:hidden p-3">
        <CircleUserRound size={22}/>
    </span>

    {/* Desktop */}
    <span className="hidden sm:flex px-5 py-3 font-bold">
        Tham gia GeoEduAI
    </span>

</button>

)}
          </div>

        </div>

      </header>

      {/* ================= BODY ================= */}

      <div
className="
mx-auto
grid
max-w-[1700px]

grid-cols-1
lg:grid-cols-[280px_1fr]
xl:grid-cols-[280px_1fr_360px]

gap-6
px-3
lg:px-8
py-4
lg:py-8
"
>
        {/* ================= LEFT SIDEBAR ================= */}

        <aside className="hidden lg:block">

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
            className={`rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm transition-all ${
              darkMode
                ? "bg-[#0B2248] border-blue-900"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">

              <Image
                src={user?.avatar_url || "/avatar.png"}
                width={52}
                height={52}
                alt="Avatar"
                className="h-14 w-14 rounded-full object-cover flex-none"
              />

<button
 onClick={() => {
        if (!user) {
            setOpenAuthModal(true);
            return;
        }

        setOpenModal(true);
    }}
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
              className={`mt-6

grid
grid-cols-2
gap-3

lg:flex
lg:items-center
lg:justify-between{
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

<button
    onClick={createPost}
    disabled={loading}
    className="rounded-xl bg-[#1565C0] px-8 py-3 text-white"
>
    {loading ? "Đang đăng..." : "Đăng bài"}
</button>

            </div>

          </div>

          {/* ================= FILTER ================= */}

          <div
            className={`overflow-x-auto flex gap-6 whitespace-nowrap rounded-2xl border px-6 py-4 ${
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

  {posts.map((post) => {

    const info = reactionInfo(post);

    return (

      <div
        key={post.id}
        className={`overflow-hidden rounded-2xl lg:rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
          darkMode
            ? "bg-[#0B2248] border-blue-900"
            : "bg-white border-gray-200"
        }`}
      >

                {/* HEADER */}

                <div className="flex items-start justify-between  p-4 md:p-6">

                  <div className="flex gap-4">

<Image
    src={post.profiles?.avatar_url || "/avatar.png"}
    width={56}
    height={56}
    alt=""
    className="
        h-14
        w-14
        rounded-full
        object-cover
        flex-none
        self-start
    "
/>

                    <div>

                      <div
  className="relative flex items-center gap-3 cursor-pointer"
  onClick={() => setOpenProfile(!openProfile)}
>

                      <h3 className="text-lg font-bold">
                            {post.profiles?.full_name}
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
                        {new Date(post.created_at).toLocaleString("vi-VN")}
                      </p>

                    </div>

                  </div>

                  <div className="relative">

  <button
    onClick={() =>
      setOpenMenu(openMenu === post.id ? null : post.id)
    }
    className={`rounded-xl p-2 transition ${
      darkMode
        ? "hover:bg-[#133462]"
        : "hover:bg-gray-100"
    }`}
  >
    ⋯
  </button>

  {openMenu === post.id && (

    <div
      className={`absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border shadow-2xl ${
        darkMode
          ? "border-blue-900 bg-[#10294F]"
          : "border-gray-200 bg-white"
      }`}
    >
{post.user_id === user?.id && (
     <button
  className={`flex w-full items-center gap-3 px-5 py-3 transition ${
    darkMode
      ? "hover:bg-[#163A67]"
      : "hover:bg-blue-50"
  }`}
>
  <Pencil size={18} />
  <span>Chỉnh sửa bài viết</span>
</button>
)}
<button
  className={`flex w-full items-center gap-3 px-5 py-3 transition ${
    darkMode
      ? "hover:bg-[#163A67]"
      : "hover:bg-blue-50"
  }`}
>
  <Link2 size={18} />
  <span>Sao chép liên kết</span>
</button>

<button
  className={`flex w-full items-center gap-3 px-5 py-3 transition ${
    darkMode
      ? "hover:bg-orange-900/40 text-orange-300"
      : "hover:bg-orange-50 text-orange-600"
  }`}
>
  <Flag size={18} />
  <span>Báo cáo</span>
</button>

<hr className={darkMode ? "border-blue-900" : "border-gray-200"} />
{(post.user_id === user?.id || user?.role === "admin") && (
<button
  onClick={() => {
    setDeletePostId(post.id);
    setOpenMenu(null);
}}
  className={`flex w-full items-center gap-3 px-5 py-3 transition ${
    darkMode
      ? "text-red-400 hover:bg-red-900/30"
      : "text-red-600 hover:bg-red-50"
  }`}
>
  <Trash2 size={18} />
  <span>Xóa bài viết</span>
</button>
)}
    </div>

  )}

</div>

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

<div
    className={`mt-4 post-content ${
        darkMode ? "text-slate-100" : "text-gray-800"
    }`}
    dangerouslySetInnerHTML={{
        __html: post.content,
    }}
/>

                </div>

{/* ===== HIỂN THỊ ẢNH ===== */}

{post.images?.length === 1 && (
  <div className="mt-6">
    <Image
      src={post.images[0]}
      width={1600}
      height={900}
      alt=""
      onClick={() => setPreviewImage(post.images[0])}
      className="
        w-full
        max-h-[250px]
        sm:max-h-[400px]
        lg:max-h-[650px]
        rounded-2xl
        object-cover
        cursor-pointer
        transition
        hover:scale-[1.01]
      "
    />
  </div>
)}

{post.images?.length === 2 && (
  <div className="mt-6 grid grid-cols-2 gap-2">
    {post.images.map((img: string, index: number) => (
      <Image
        key={index}
        src={img}
        width={900}
        height={900}
        alt=""
        onClick={() => setPreviewImage(img)}
        className="
          h-[380px]
          w-full
          rounded-xl
          object-cover
          cursor-pointer
          transition
          hover:opacity-90
        "
      />
    ))}
  </div>
)}
                                {/* ================= FOOTER ================= */}

                <div
                  className={`flex
flex-col
gap-2
px-4
py-4
text-sm
md:flex-row
md:items-center
md:justify-between
md:px-6
md:py-5  ${
                    darkMode
                      ? "text-slate-300"
                      : "text-gray-500"
                  }`}
                >
<div className="flex items-center gap-7 text-sm font-medium">

  <div className="flex items-center gap-2 text-pink-500">
    <Heart size={18} fill="currentColor" />
    <span>{countReaction(post,"heart")}</span>
  </div>

  <div className="flex items-center gap-2 text-blue-400">
    <ThumbsUp size={18} fill="currentColor" />
    <span>{countReaction(post,"like")}</span>
  </div>

  <div className="flex items-center gap-2 text-orange-400">
    <Flame size={18} fill="currentColor" />
    <span>{countReaction(post,"fire")}</span>
  </div>

</div>

                  <div>
                    {post.comments?.[0]?.count??0} bình luận
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

<div className="grid grid-cols-4 border-t border-blue-900">

<div
    className="relative flex justify-center"
    onMouseEnter={() => {

    if (reactionTimeout.current) {
        clearTimeout(reactionTimeout.current);
    }

    setHoverReaction(post.id);

}}
    onMouseLeave={() => {

    reactionTimeout.current = setTimeout(() => {
        setHoverReaction(null);
    }, 250);

}}
>

    {/* Popup Reaction */}

    {hoverReaction === post.id && (

<div
    onMouseEnter={() => {

        if (reactionTimeout.current) {
            clearTimeout(reactionTimeout.current);
        }

    }}

    onMouseLeave={() => {

        reactionTimeout.current = setTimeout(() => {
            setHoverReaction(null);
        },250);

    }}

    className="
    absolute
    bottom-full
    mb-2

    flex
    items-center
    gap-2

    rounded-full

    bg-white

    px-3
    py-2

    shadow-2xl
    dark:bg-[#133462]
"
>

<button
    onClick={() => reactPost(post.id, "like")}
    className="transition hover:scale-125"
>
    <ThumbsUp
        size={24}
        className="text-blue-500"
        fill="currentColor"
    />
</button>

            <button
                onClick={() => reactPost(post.id, "heart")}
                className="transition hover:scale-125"
            >
                <Heart
                    size={24}
                    className="text-red-500"
                    fill="currentColor"
                />
            </button>

            <button
            onClick={() => reactPost(post.id, "fire")}
                className="transition hover:scale-125"
            >
                <Flame
                    size={24}
                    className="text-orange-500"
                    fill="currentColor"
                />
            </button>

        </div>

    )}

<button
    onClick={() => quickLike(post)}

onMouseDown={() => {

    setLongPressTriggered(false);

    longPressTimer.current = setTimeout(() => {

        setLongPressTriggered(true);

        setHoverReaction(post.id);

    },300);

}}

    onMouseUp={() => {

        if(longPressTimer.current){
            clearTimeout(longPressTimer.current);
        }

    }}

    onMouseLeave={() => {

        if(longPressTimer.current){
            clearTimeout(longPressTimer.current);
        }

    }}

onTouchStart={() => {

    setLongPressTriggered(false);

    longPressTimer.current = setTimeout(() => {

        setLongPressTriggered(true);

        setHoverReaction(post.id);

    },400);

}}

    onTouchEnd={() => {

        if(longPressTimer.current){
            clearTimeout(longPressTimer.current);
        }

    }}

    className={`
        flex
        items-center
        gap-2
        py-4
        transition
        ${info.color}
    `}
>

    {info.reaction === "heart" ? (

        <Heart
            size={20}
            fill="currentColor"
        />

    ) : info.reaction === "fire" ? (

        <Flame
            size={20}
            fill="currentColor"
        />

    ) : (

        <ThumbsUp
            size={20}
            fill="currentColor"
        />

    )}

    <span className="font-semibold">
        {info.text}
    </span>

</button>

</div>

    <button className="flex items-center justify-center gap-2 py-4 transition hover:bg-[#123867]">
        <MessageCircle size={20}/>
        <span className="font-semibold">
            Bình luận
        </span>
    </button>

    <button className="flex items-center justify-center gap-2 py-4 transition hover:bg-[#123867]">
        <Share2 size={20}/>
        <span className="font-semibold">
            Chia sẻ
        </span>
    </button>

    <button className="flex items-center justify-center gap-2 py-4 transition hover:bg-[#123867]">
        <Bookmark size={20}/>
        <span className="font-semibold">
            Lưu
        </span>
    </button>

</div>

                {/* ================= COMMENT ================= */}

<CommentSection
    postId={post.id}
    darkMode={darkMode}
    user={user}
/>

              </div>
              );
})}

          </div>

        </section>

        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="hidden xl:block">

          <div className="sticky top-28 space-y-6">
                        {/* ================= AI ASSISTANT ================= */}

            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-[#1565C0]
                to-[#0D47A1]
                 p-4 md:p-6
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
              className={`rounded-3xl border  p-4 md:p-6 shadow-sm ${
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
              className={`rounded-3xl border  p-4 md:p-6 shadow-sm ${
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
                  name="Thiên Bảo"
                  role="Nhà vua"
                  darkMode={darkMode}
                />

                <Member
                  avatar="/avatar2.jpg"
                  name="Bá Thọ"
                  role="Nô Lệ"
                  darkMode={darkMode}
                />

                <Member
                  avatar="/avatar3.jpg"
                  name="Thiên Minh"
                  role="Cúp vàng"
                  darkMode={darkMode}
                />

              </div>

            </div>

            {/* ================= STATISTICS ================= */}

            <div
              className={`rounded-3xl border  p-4 md:p-6 shadow-sm ${
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
<CreatePostModal
    images={images}
    setImages={setImages}
    open={openModal}
    darkMode={darkMode}
    title={title}
    user={user}
    content={content}
    category={category}
    loading={loading}
    onClose={() => setOpenModal(false)}
    setTitle={setTitle}
    setContent={setContent}
    setCategory={setCategory}
    onSubmit={async () => {
        await createPost();
        setOpenModal(false);
    }}
/>
{deletePostId && (

<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

    <div
        className={`w-[430px] rounded-3xl shadow-2xl overflow-hidden ${
            darkMode
                ? "bg-[#0B2248]"
                : "bg-white"
        }`}
    >

        <div className="p-8">

            <div className="flex justify-center">

            </div>

            <h2 className="mt-6 text-center text-2xl font-bold">
                Xóa bài viết?
            </h2>

            <p
                className={`mt-4 text-center leading-7 ${
                    darkMode
                        ? "text-slate-300"
                        : "text-gray-500"
                }`}
            >
                Sau khi xóa bạn sẽ không thể khôi phục bài viết này.
            </p>

        </div>

        <div className="grid grid-cols-2 gap-4 border-t  p-4 md:p-6">

            <button
                onClick={() => setDeletePostId(null)}
                className="rounded-xl border py-3 font-semibold"
            >
                Hủy
            </button>

            <button
                onClick={deletePost}
                disabled={deleting}
                className="rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
            >
                {deleting ? "Đang xóa..." : "Xóa bài viết"}
            </button>

        </div>

    </div>

</div>

)}  
{/* ================= MOBILE NAV ================= */}

<div
  className={`
    fixed
    bottom-0
    left-0
    right-0
    z-50
    flex
    lg:hidden
    items-center
    justify-around
    border-t
    h-16
    ${
      darkMode
        ? "border-blue-900 bg-[#0B2248]"
        : "border-gray-200 bg-white"
    } 
    shadow-2xl
  `}
>

  {/* Home */}
  <button
    onClick={() => router.push("/community")}
    className="flex flex-col items-center gap-1 text-[#1565C0] transition active:scale-90"
  >
    <Home size={22} />
    <span className="text-[11px]">Trang chủ</span>
  </button>

  {/* Explore */}
  <button
    onClick={() => alert("Đang phát triển")}
    className="flex flex-col items-center gap-1 transition active:scale-90"
  >
    <Compass size={22} />
    <span className="text-[11px]">Khám phá</span>
  </button>

  {/* Create */}
  <button
    onClick={() => {
    if (!user) {
        setOpenAuthModal(true);
        return;
    }

    setOpenModal(true);
}}
    className="
      -mt-8
      flex
      h-16
      w-16
      items-center
      justify-center
      rounded-full
      bg-gradient-to-r
      from-[#1565C0]
      to-[#42A5F5]
      text-white
      shadow-xl
      active:scale-95
      transition
    "
  >
    <Plus size={30} />
  </button>

  {/* Saved */}
  <button
    onClick={() => alert("Đang phát triển")}
    className="flex flex-col items-center gap-1 transition active:scale-90"
  >
    <Bookmark size={22} />
    <span className="text-[11px]">Đã lưu</span>
  </button>

  {/* Profile */}
  <button
    onClick={() => alert("Đang phát triển")}
    className="flex flex-col items-center gap-1 transition active:scale-90"
  >
    <Users size={22} />
    <span className="text-[11px]">Cá nhân</span>
  </button>

</div>
{openAuthModal && (
    <div
        className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-md
        p-3 sm:p-4
        "
        onClick={() => setOpenAuthModal(false)}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            className="
           w-full
max-w-[92vw]
sm:max-w-md

overflow-hidden

rounded-3xl
sm:rounded-[32px]

bg-white
shadow-2xl
            "
        >
{/* Header */}

<div
    className="
    bg-gradient-to-r
    from-[#071A3B]
    via-[#0B2248]
    to-[#1565C0]

    px-5
    py-6

    sm:px-8
    sm:py-10

    text-center
    "
>
    <img
        src="/images/logo.png"
        alt="GeoEduAI"
        className="
        mx-auto

        h-14
        w-14

        sm:h-20
        sm:w-20

        rounded-full
        "
    />

    <h2
        className="
        mt-4

        text-2xl
        sm:text-3xl

        font-black
        text-white
        "
    >
        Tham gia GeoEduAI
    </h2>

    <p
        className="
        mt-2

        text-sm
        sm:text-base

        text-blue-100
        leading-relaxed
        "
    >
        Đăng nhập để tham gia cộng đồng học tập Địa lí.
    </p>
</div>

            {/* Body */}

            <div className="space-y-4 p-8">

                <button
                    onClick={() => router.push("/login")}
                    className="
                    w-full
                    rounded-2xl
                    bg-[#1565C0]
                    py-4
                    font-bold
                    text-white
                    transition
                    hover:bg-[#0D47A1]
                    "
                >
                    Đăng nhập
                </button>

                <button
                    onClick={() => router.push("/register")}
                    className="
                    w-full
                    rounded-2xl
                    border-2
                    border-[#1565C0]
                    py-4
                    font-bold
                    text-[#1565C0]
                    transition
                    hover:bg-blue-50
                    "
                >
                    Đăng ký
                </button>

                <button
                    onClick={() => setOpenAuthModal(false)}
                    className="
                    w-full
                    py-3
                    text-gray-500
                    transition
                    hover:text-black
                    "
                >
                    Đóng
                </button>

            </div>

        </div>
    </div>
)}
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
      <span className="text-base lg:text-lg">
        {icon}
      </span>

      <span className="hidden sm:block">
    {text}
</span>
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
          className="h-14 w-14 rounded-full object-cover flex-none"
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
