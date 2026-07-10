"use client";

import { useState } from "react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPost() {
    if (!title || !content) {
      alert("Nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/forum/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        author: "Thiên Bảo",
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Đăng bài thành công!");

    setTitle("");
    setContent("");
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Đăng bài
      </h1>

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded mb-4"
        rows={8}
        placeholder="Nội dung..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={createPost}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Đang đăng..." : "Đăng bài"}
      </button>
    </main>
  );
}