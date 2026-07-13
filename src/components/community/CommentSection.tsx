"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Trash2 } from "lucide-react";
interface Props {
  postId: string;
  darkMode: boolean;
  user: any;
}

export default function CommentSection({
  postId,
  darkMode,
  user,
}: Props) {
  const isAdmin = user?.role === "admin";
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const [showAll, setShowAll] = useState(false);

  async function loadComments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("post_id", postId)
      .order("created_at", {
        ascending: false,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    setComments(data ?? []);
  }

  async function sendComment() {
    if (!content.trim()) return;

    if (!user) return;

    setSending(true);

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
      },
    ]);

    setSending(false);

    if (error) {
      console.error(error);
      return;
    }

    setContent("");

    await loadComments();

    setShowAll(false);
  }
async function deleteComment(commentId: string) {
  if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.log(error);
    return;
  }

  loadComments();
}
  useEffect(() => {
    loadComments();
  }, [postId]);

  const visibleComments = useMemo(() => {
    if (showAll) return comments;
    return comments.slice(0, 1);
  }, [comments, showAll]);

  return (
    <div className="p-6">

      <h3
        className={`mb-5 text-lg font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Bình luận ({comments.length})
      </h3>

      {loading && (
        <p className={darkMode ? "text-slate-400" : "text-gray-500"}>
          Đang tải bình luận...
        </p>
      )}

      {!loading &&
        visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="mb-5 flex gap-3"
          >
<Image
  src={comment.profiles?.avatar_url || "/avatar.png"}
  width={42}
  height={42}
  alt=""
  className="
    h-10
    w-10
    rounded-full
    object-cover
    flex-none
    self-start
  "
/>

            <div
              className={`flex-1 rounded-2xl p-4 ${
                darkMode
                  ? "bg-[#133462]"
                  : "bg-[#F5F7FC]"
              }`}
            >
              <div className="font-semibold">
                {comment.profiles?.full_name}
              </div>

              <p
                className={`mt-2 ${
                  darkMode
                    ? "text-slate-300"
                    : "text-gray-700"
                }`}
              >
                {comment.content}
              </p>
<div
  className={`mt-3 flex items-center justify-between text-sm ${
    darkMode
      ? "text-slate-400"
      : "text-gray-500"
  }`}
>
  <span>
    {new Date(comment.created_at).toLocaleString("vi-VN")}
  </span>

{(comment.user_id === user?.id || isAdmin) && (
    <button
      onClick={() => deleteComment(comment.id)}
      className="
        flex
        items-center
        gap-1
        text-red-500
        hover:text-red-600
      "
    >
      <Trash2 size={16} />
      Xóa
    </button>
  )}
</div>
            </div>
          </div>
        ))}

      {!showAll && comments.length > 1 && (
        <button
          onClick={() => setShowAll(true)}
          className="mb-6 font-semibold text-[#1565C0] hover:underline"
        >
          Xem thêm {comments.length - 1} bình luận
        </button>
      )}

      {showAll && comments.length > 1 && (
        <button
          onClick={() => setShowAll(false)}
          className="mb-6 font-semibold text-[#1565C0] hover:underline"
        >
          Thu gọn bình luận
        </button>
      )}

      <div className="flex gap-3">

        <Image
          src={user?.avatar_url || "/avatar.png"}
          width={42}
          height={42}
          alt=""
          className="rounded-full"
        />

        <div className="flex flex-1 gap-3">

          <input
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendComment();
              }
            }}
            placeholder="Viết bình luận..."
            className={`flex-1 rounded-full px-5 py-3 outline-none ${
              darkMode
                ? "bg-[#133462] text-white placeholder:text-slate-400"
                : "bg-gray-100"
            }`}
          />

          <button
            onClick={sendComment}
            disabled={sending}
            className="rounded-full bg-blue-600 px-6 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "..." : "Gửi"}
          </button>

        </div>

      </div>

    </div>
  );
}