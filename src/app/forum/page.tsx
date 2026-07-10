"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
};

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/forum/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Diễn đàn GeoEduAI
      </h1>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-xl p-5 mb-5 shadow-sm"
        >
          <h2 className="text-xl font-bold">
            {post.title}
          </h2>

          <p className="mt-3">
            {post.content}
          </p>

          <div className="mt-4 text-gray-500 text-sm">
            {post.author}
          </div>
        </div>
      ))}
    </main>
  );
}