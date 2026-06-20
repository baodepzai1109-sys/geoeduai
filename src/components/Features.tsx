export default function Features() {
  return (
    <section className="grid gap-6 px-10 pb-20 md:grid-cols-3">
      <div className="rounded-2xl bg-slate-900 p-6">
        <h3 className="mb-3 text-xl font-bold">
          AI Giáo Án
        </h3>

        <p className="text-slate-400">
          Tự động cập nhật giáo án theo địa giới hành chính mới.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-6">
        <h3 className="mb-3 text-xl font-bold">
          Bản đồ tương tác
        </h3>

        <p className="text-slate-400">
          Tra cứu nhanh tỉnh thành trên bản đồ Việt Nam.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-6">
        <h3 className="mb-3 text-xl font-bold">
          AI Tạo Đề
        </h3>

        <p className="text-slate-400">
          Sinh đề kiểm tra và đáp án tự động.
        </p>
      </div>
    </section>
  );
}