"use client";

import { memo } from "react";
import { Page } from "react-pdf";

interface Props {
  page: number;
  scale: number;
}

function PdfPage({ page, scale }: Props) {
  return (
    <div
      id={`page-${page}`}
      data-page={page}
      className="mb-8 rounded-2xl bg-white shadow-2xl"
    >
      <Page
        pageNumber={page}
        scale={scale}
        devicePixelRatio={1}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        loading={
          <div className="flex h-[900px] w-[650px] animate-pulse items-center justify-center rounded-xl bg-slate-200">
            Đang tải...
          </div>
        }
      />
    </div>
  );
}

export default memo(PdfPage);