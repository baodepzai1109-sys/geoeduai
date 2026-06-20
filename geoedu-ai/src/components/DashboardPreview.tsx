export default function DashboardPreview() {
  return (
    <section className="px-10 pb-20">
      <h2 className="mb-8 text-center text-4xl font-bold">
        Giao diện hệ thống
      </h2>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-slate-800 p-6">
            Giáo án AI
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            Bản đồ
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            Đề kiểm tra
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            Thống kê
          </div>
        </div>
      </div>
    </section>
  );
}