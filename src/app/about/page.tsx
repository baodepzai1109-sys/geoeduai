"use client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import Image from "next/image";
export default function AboutPage() {
return ( <main className="min-h-screen bg-gradient-to-br from-slate-950 via-[#071a3b] to-slate-950 text-white overflow-hidden">

  {/* Glow Effect */}
  <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-blue-600/10 blur-[220px]" />

  <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">

    {/* HERO */}
    <section className="text-center">

      <div className="inline-flex px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
        ĐỀ TÀI KHOA HỌC KỸ THUẬT
      </div>

      <h1 className="mt-8 text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
        GeoEdu AI
      </h1>

      <p className="mt-6 text-xl text-slate-300 max-w-4xl mx-auto">
        Hệ thống trí tuệ nhân tạo hỗ trợ học tập và giảng dạy Địa lí Việt Nam
        dựa trên công nghệ AI, NLP và mô hình ngôn ngữ lớn (LLM).
      </p>

    </section>

    {/* GIỚI THIỆU */}
    <section className="mt-24">

      <div className="rounded-3xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-xl p-10">

        <h2 className="text-4xl font-bold text-blue-300 mb-8">
          1. Giới thiệu dự án
        </h2>

        <div className="space-y-6 text-slate-300 leading-8 text-lg">

          <p>
            <strong>Mục tiêu:</strong> Xây dựng hệ thống GeoEdu AI nhằm hỗ trợ
            học sinh và giáo viên trong việc học tập, giảng dạy và tra cứu
            kiến thức Địa lí Việt Nam bằng công nghệ Trí tuệ nhân tạo (AI).
          </p>

          <p>
            Hệ thống áp dụng công nghệ Xử lý ngôn ngữ tự nhiên (NLP)
            kết hợp mô hình ngôn ngữ lớn (LLM) nhằm tạo ra câu trả lời
            tự nhiên, dễ hiểu và phù hợp với chương trình giáo dục phổ thông.
          </p>

          <p>
            <strong>Nguồn dữ liệu:</strong> Dữ liệu được xây dựng từ nội dung
            sách giáo khoa Địa lí, tài liệu giáo dục chính thống, bản đồ hành chính,
            kiến thức địa lí tự nhiên, kinh tế - xã hội Việt Nam và các bộ dữ liệu
            được chuẩn hóa thành định dạng JSON.
          </p>

          <p>
            Dữ liệu được xử lý, chuẩn hóa và phân chia thành các đơn vị kiến thức
            giúp AI dễ dàng truy xuất và sử dụng trong quá trình tạo câu trả lời,
            sinh giáo án và tạo đề kiểm tra.
          </p>

        </div>

      </div>

    </section>

    {/* KIẾN TRÚC */}
    <section className="mt-20">

      <div className="rounded-3xl border border-blue-500/20 bg-slate-900/50 p-10">

        <h2 className="text-4xl font-bold text-blue-300 mb-8">
          2. Thiết kế hệ thống
        </h2>

        <div className="space-y-6 text-lg text-slate-300 leading-8">

          <p>
            Hệ thống được xây dựng theo kiến trúc nhiều tầng bao gồm:
          </p>

          <ul className="list-disc ml-8 space-y-2">
            <li>Frontend: Next.js + React</li>
            <li>Backend API: Route Handler</li>
            <li>Cơ sở dữ liệu kiến thức Địa lí</li>
            <li>AI Engine sử dụng mô hình Llama</li>
            <li>Groq Cloud API</li>
          </ul>

          <p>
            Toàn bộ hệ thống được thiết kế theo mô hình AI Retrieval-Augmented Generation (RAG)
            giúp nâng cao độ chính xác của câu trả lời và giảm thiểu hiện tượng AI tạo ra
            thông tin sai lệch.
          </p>

        </div>

      </div>

    </section>

    {/* QUY TRÌNH */}
    <section className="mt-24">
  <h2
    className="
    text-4xl
    font-black
    text-blue-300
    mb-8
    "
  >
    3. Cơ chế hoạt động của AI
  </h2>

  <p
    className="
    text-slate-300
    leading-8
    text-lg
    "
  >
    Hệ thống GeoEdu AI hoạt động theo mô hình xử lý dữ liệu nhiều tầng,
    từ việc tiếp nhận yêu cầu của người dùng đến quá trình phân tích,
    truy xuất dữ liệu và sinh nội dung bằng mô hình trí tuệ nhân tạo.
  </p>

  <div
    className="
    mt-10
    rounded-3xl
    overflow-hidden
    border
    border-blue-500/20
    shadow-[0_0_60px_rgba(59,130,246,.2)]
    "
  >
    <Image
      src="/images/ai-flow.png"
      alt="Cơ chế hoạt động của GeoEdu AI"
      width={1920}
      height={1080}
      className="w-full h-auto"
    />
  </div>
</section>

    {/* TÍNH NĂNG */}
    <section className="mt-20">

      <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">
        4. Tính năng nổi bật
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
          "AI Trợ lý Địa lí",
          "AI Tạo Đề Kiểm Tra",
          "AI Tạo Giáo Án",
          "Bản đồ hành chính tương tác",
        ].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-blue-500/20 bg-slate-900/50 p-8 hover:border-cyan-400 transition"
          >
            <h3 className="text-xl font-bold text-blue-300">
              {item}
            </h3>
          </div>
        ))}

      </div>

    </section>

    {/* CÔNG NGHỆ */}
    <section className="mt-24">
  <h2
    className="
    text-4xl
    font-black
    text-blue-300
    mb-8
    "
  >
    5. Công nghệ sử dụng
  </h2>

  <p
    className="
    text-slate-300
    text-lg
    leading-8
    "
  >
    GeoEdu AI được xây dựng bằng các công nghệ hiện đại trong lĩnh vực
    phát triển web và trí tuệ nhân tạo. Hệ thống sử dụng Next.js cho
    giao diện người dùng, Tailwind CSS để thiết kế giao diện, Groq Cloud
    API kết hợp mô hình Llama 3.3 để xử lý ngôn ngữ tự nhiên và sinh nội dung.
  </p>

  <div
    className="
    mt-10
    rounded-3xl
    overflow-hidden
    border
    border-blue-500/20
    bg-slate-900/40
    shadow-[0_0_60px_rgba(59,130,246,.2)]
    "
  >
    <img
      src="/images/cong-nghe-su-dung.png"
      alt="Công nghệ sử dụng trong GeoEdu AI"
      className="w-full h-auto"
    />
  </div>

  <p
    className="
    text-center
    text-slate-400
    italic
    mt-4
    "
  >
    Các công nghệ cốt lõi được sử dụng trong hệ thống GeoEdu AI.
  </p>
</section>

  </div>

</main> 

);
}
