import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DashboardPreview from "@/components/DashboardPreview";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";


export default function HomePage() {
  const features = [
    {
      icon: "/ai-assistant-logo.png",
      title: "AI Trợ lý Địa Lí",
      desc: "Hỏi đáp kiến thức địa lí Việt Nam",
    },
    {
      icon: "/quizznexam.png",
      title: "Quiz & Exam",
      desc: "Luyện tập với ngân hàng hơn 1.000+ câu hỏi Địa lí và tạo đề kiểm tra thông minh bằng AI theo Chương trình Giáo dục phổ thông.",
    },
    {
      icon: "/baotri.png",
      title: "Đang Bảo Trì",
      desc: "Tính năng đang được cập nhật vui lòng chờ đợi!",
    },
    {
      icon: "/atlas-library-logo.png",
      title: "Thư viện Atlat",
      desc: "Atlat điện tử tích hợp tìm kiếm, phóng to và tra cứu thông minh.",
    },
  ];

  return (

<main className="relative min-h-screen overflow-hidden text-white tech-grid">
      
      <nav
  className="
  fixed
  top-0
  left-0
  w-full
  z-50

  backdrop-blur-xl
  bg-slate-950/70

  border-b
  border-blue-500/20
  "
>
  <div
    className="
    max-w-[1700px]
    mx-auto

    px-4 md:px-10
    py-4

    flex
    items-center
    justify-between
    "
  >
    <div
      className="
      text-2xl
      font-black
      text-blue-400
      "
    >
      GeoEdu AI
    </div>

    <div
  className="
  flex
  gap-4
  md:gap-10

  text-sm
  md:text-lg

  flex-wrap
  "
>

      <a
        href="#home"
        className="hover:text-cyan-400 transition"
      >
        Trang chủ
      </a>

      <Link
  href="/about"
  className="hover:text-cyan-400 transition"
>
  Giới thiệu
</Link>

      <a
        href="#contact"
        className="hover:text-cyan-400 transition"
      >
        Liên hệ
      </a>

    </div>
  </div>
</nav>
      <div
  className="
    absolute
    inset-0

    bg-gradient-to-r
    from-transparent
    via-blue-400/10
    to-transparent

    -translate-x-full
    group-hover:translate-x-full

    transition-all
    duration-1000
  "
/>
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-blue-600/10 blur-[220px]" />

<div
  id="home"
  className="
  relative
  z-10
  max-w-[1700px]
  mx-auto
  px-4 md:px-10
  pt-32
  pb-20
  "
>
        <div
  className="
  grid
  grid-cols-1
  lg:grid-cols-[1fr_720px]
  gap-12
  items-center
  "
>

          {/* LEFT */}
          <div>

            <div className="
              inline-flex
              px-5 py-2
              rounded-full
              border border-blue-500/40
              bg-blue-500/10
              text-blue-300
              text-sm
            ">
              AI EDUCATION PLATFORM
            </div>

            <h1
  className="
    mt-8
    text-4xl md:text-6xl lg:text-7xl
    font-black
    leading-none
    bg-gradient-to-r
    from-white
    via-blue-200
    to-blue-500
    bg-clip-text
    text-transparent
  "
>
  GeoEdu AI
</h1>

<p className=" mt-5 text-lg text-blue-300 font-semibold tracking-wide " >
  Nền tảng trí tuệ nhân tạo hỗ trợ giảng dạy và học tập Địa lí Việt Nam theo chương trình GDPT 2018 sau sắp xếp đơn vị hành chính cấp tỉnh
</p>

<p className=" mt-5 text-xl text-slate-300 leading-relaxed max-w-[650px] " >
  Khám phá bản đồ hành chính mới, học tập tương tác,
  tạo giáo án và đề kiểm tra bằng AI dành cho giáo viên
  và học sinh trên toàn quốc.
</p>

            <div
  className="
  flex
  flex-col
  md:flex-row
  w-full md:w-auto
  gap-5
  mt-12
  "
>

              <Link
                href="/dashboard/map"
className="
  px-8
  py-4

  rounded-2xl

  bg-gradient-to-r
  from-blue-600
  to-cyan-500

  font-bold
  text-lg

  shadow-[0_0_35px_rgba(37,99,235,.5)]

  hover:scale-105
  hover:shadow-[0_0_60px_rgba(59,130,246,.8)]

  transition-all
  duration-300
"
              >
                Khám phá bản đồ
              </Link>
            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div
  className="
    rounded-[32px]
    border border-blue-500/20

    bg-gradient-to-br
    from-slate-900/95
    via-blue-950/90
    to-slate-900/95

    backdrop-blur-xl

    p-4 md:p-6

    shadow-[0_0_80px_rgba(37,99,235,.15)]

    hover:shadow-[0_0_120px_rgba(37,99,235,.35)]
    hover:border-blue-400/40

    transition-all
    duration-500
  "
>

              <div className="text-center mb-8">

<div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-blue-500/10 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,.4)]">
  <Image
    src="/images/logo.png"
    alt="logo"
    fill
    className="object-cover"
  />
</div>

                <h2
  className="
    mt-5
    text-4xl
    font-black
    bg-gradient-to-r
    from-white
    to-blue-300
    bg-clip-text
    text-transparent
  "
>
  Hệ sinh thái học tập thông minh
</h2>

                <p className="
                  mt-4
                  text-slate-400
                  max-w-2xl
                  mx-auto
                ">
                  Tích hợp các công cụ AI hỗ trợ giáo viên
                  và học sinh trong giảng dạy, học tập
                  và khám phá Địa lí Việt Nam.
                </p>

              </div>

              {/* GRID 2x2 */}
              <div
  className="
  grid
  grid-cols-1
  sm:grid-cols-2
  gap-6
  "
>

                {features.map((item) => {
  const content = (
    <div
      className="
        group
        rounded-3xl
        border border-blue-500/20
        bg-blue-950/20
        p-6
        hover:border-cyan-400/60
        hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
        hover:-translate-y-1
        transition-all
        cursor-pointer
        h-full
      "
    >
      <div className="mb-4 flex justify-center">
  <img
    src={item.icon}
    alt={item.title}
    className="
      w-20
      h-20
      object-contain

      drop-shadow-[0_0_15px_rgba(59,130,246,.45)]

      transition-all
      duration-300

      group-hover:scale-110
    "
  />
</div>

      <h3 className="text-base md:text-xl font-bold">
        {item.title}
      </h3>

      <p className="mt-3 text-slate-400">
        {item.desc}
      </p>
    </div>
  );
  if (item.title === "AI Trợ lý Địa Lí") {
    return (
      <Link
        key={item.title}
        href="/ai"
      >
        {content}
      </Link>
    );
  }
if (item.title === "Đang Bảo Trì") {
  return (
    <Link
      key={item.title}
      href="/community"
    >
      {content}
    </Link>
  );
}
if (item.title === "Quiz & Exam") {
  return (
    <Link
      key={item.title}
      href="/quizznexam"
    >
      {content}
    </Link>
  );
}
  if (item.title === "Thư viện Atlat") {
    return (
      <Link
        key={item.title}
        href="/atlat"
      >
        {content}
      </Link>
    );
  }
  return (
    <div key={item.title}>
      {content}
    </div>
  );
})}

              </div>

              {/* STATS */}
              <div className="
                mt-6
                grid grid-cols-2
                gap-4
              ">

                <div className="
                  rounded-2xl
                  border border-blue-500/20
                  bg-blue-950/20
                  p-5
                  text-center
                ">
                  <div className="
                    text-4xl
                    font-black
                    text-blue-400
                  ">
                    34
                  </div>

                  <div className="text-slate-400">
                    Tỉnh / Thành
                  </div>
                </div>

                <div className="
                  rounded-2xl
                  border border-blue-500/20
                  bg-blue-950/20
                  p-5
                  text-center
                ">
                  <div className="
                    text-5xl
                    font-black
                    text-blue-400
                  ">
                    5
                  </div>

                  <div className="text-slate-400">
                    TÍNH NĂNG
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
<section
  id="contact"
  className="
  border-t
  border-blue-500/20

  bg-slate-950/70

  mt-20
  "
>
  <div
    className="
    max-w-[1700px]
    mx-auto

    px-4 md:px-10
    py-16
    "
  >
    <h2
      className="
      text-2xl md:text-4xl
      font-black
      text-blue-300
      "
    >
      Liên hệ
    </h2>

    {/* Thêm thẻ div cha này bọc bên ngoài 2 khối của bạn */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 max-w-2xl">

  <div className="mt-6 space-y-3 text-slate-300 text-base md:text-lg">
    <p>Tác giả: Dương Thiên Bảo</p>
    <p>Email: baodepzai1109@gmail.com</p>
    <p>Số điện thoại: 0123 456 789</p>
  </div>

  <div className="mt-6 space-y-3 text-slate-300 text-base md:text-lg">
    <p>Tác giả: Skibidi</p>
    <p>Email: baodepzai1109@gmail.com</p>
    <p>Số điện thoại: 0123 456 789</p>
  </div>

</div>
  </div>
</section>
    </main>
  );
}