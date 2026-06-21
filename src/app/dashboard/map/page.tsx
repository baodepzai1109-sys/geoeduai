"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
const VietnamMap = dynamic(
  () => import("@/components/VietnamMap"),
  { ssr: false }
);

export default function MapPage() {
  return (
    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      text-white

      bg-[#030712]
      "
    >
      {/* Background */}

      <div className="absolute inset-0 tech-grid opacity-30" />

      <div
        className="
        absolute
        top-0
        left-1/2
        -translate-x-1/2

w-[500px] md:w-[1200px]
h-[300px] md:h-[600px]

        bg-blue-600/15
        blur-[220px]
        pointer-events-none
      "
      />

      <div
        className="
        absolute
        bottom-0
        right-0

        w-[800px]
        h-[800px]

        bg-cyan-500/10
        blur-[200px]
        pointer-events-none
      "
      />

      {/* HEADER */}

      <div className="relative z-10 px-4 md:px-8 pt-4 md:pt-8">

        <div
          className="
          rounded-[32px]

          border
          border-blue-500/20

          bg-slate-900/60
          backdrop-blur-2xl

          px-8
          py-6

          shadow-[0_0_60px_rgba(37,99,235,.15)]
        "
        >
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">

<div
  className="
    w-14
    h-14
    rounded-2xl

    relative
    overflow-hidden

    flex
    items-center
    justify-center

    bg-blue-500/10
    border
    border-blue-500/30
  "
>
  <Image
    src="/images/logo.png"
    alt="logo"
    fill
    className="object-cover"
  />
</div>

                <div>

                  <h1
                    className="
                    text-2xl md:text-4xl
                    font-black

                    bg-gradient-to-r
                    from-white
                    via-blue-200
                    to-cyan-400

                    bg-clip-text
                    text-transparent
                  "
                  >
                    GeoEdu AI Map
                  </h1>

                  <p className="text-slate-400">
                    Hệ thống bản đồ hành chính Việt Nam
                  </p>

                </div>

              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

              <div
                className="
                px-5
                py-3

                rounded-2xl

                bg-blue-500/10
                border
                border-blue-500/30

                text-blue-300
                font-semibold
              "
              >
                 34 Tỉnh / Thành
              </div>

              <div
                className="
                px-5
                py-3

                rounded-2xl

                bg-cyan-500/10
                border
                border-cyan-400/30

                text-cyan-300
                font-semibold
              "
              >
                BẢN ĐỒ TƯƠNG TÁC
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* MAP */}

      <div className="relative z-10 p-3 md:p-8">

        <div
          className="
          relative

          rounded-[36px]
          overflow-hidden

          border
          border-blue-500/20

          bg-slate-900/50
          backdrop-blur-xl

          shadow-[0_0_80px_rgba(37,99,235,.18)]
        "
        >

          {/* Top Glow */}
          <div
            className="
            absolute
            top-0
            left-0
            right-0

            h-[1px]

            bg-gradient-to-r
            from-transparent
            via-cyan-400
            to-transparent
          "
          />

          {/* Corner Decorations */}

          <div className="hidden md:block absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/70" />
          <div className="hidden md:block absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/70" />
          <div className="hidden md:block absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/70" />
          <div className="hidden md:block absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/70" />

          <VietnamMap />

        </div>

      </div>

    </main>
  );
}

