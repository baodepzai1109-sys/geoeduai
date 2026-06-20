"use client";

import { ReactNode } from "react";

interface ResponsiveLayoutProps {
children: ReactNode;
}

export default function ResponsiveLayout({
children,
}: ResponsiveLayoutProps) {
return (
<main
className="
min-h-screen
overflow-x-hidden

```
  bg-gradient-to-br
  from-slate-950
  via-[#071a3b]
  to-slate-950

  text-white
  "
>
  {/* Glow lớn */}
  <div
    className="
    fixed
    top-0
    left-1/2
    -translate-x-1/2

    w-[700px]
    md:w-[1000px]

    h-[400px]
    md:h-[600px]

    bg-blue-600/20
    blur-[180px]

    pointer-events-none
    "
  />

  {/* Glow phụ */}
  <div
    className="
    fixed
    bottom-0
    right-0

    w-[300px]
    md:w-[600px]

    h-[300px]
    md:h-[600px]

    bg-cyan-500/10
    blur-[160px]

    pointer-events-none
    "
  />

  <div
    className="
    relative
    z-10

    max-w-none
    w-full

    px-4
    sm:px-6
    md:px-8
    lg:px-10

    py-6
    md:py-10
    "
  >
    {children}
  </div>
</main>

);
}
