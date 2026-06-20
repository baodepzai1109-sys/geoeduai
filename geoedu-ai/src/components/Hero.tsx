export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-24">
      <span className="rounded-full border border-cyan-500 px-4 py-2 text-cyan-400">
        AI hỗ trợ giáo viên Địa lý
      </span>

      <h1 className="mt-6 text-6xl font-bold">
        GeoEdu AI
      </h1>

      <p className="mt-4 max-w-2xl text-slate-400">
        Nền tảng AI hỗ trợ giáo viên cập nhật kiến thức địa lý
        sau thay đổi địa giới hành chính.
      </p>
    </section>
  );
}