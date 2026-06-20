export default function LessonPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        📚 AI Giáo Án
      </h1>

      <textarea
        className="w-full h-40 rounded-xl bg-slate-900 p-4"
        placeholder="Nhập chủ đề bài học..."
      />

      <button className="mt-4 rounded-xl bg-cyan-500 px-6 py-3 font-bold">
        Tạo giáo án
      </button>
    </main>
  );
}