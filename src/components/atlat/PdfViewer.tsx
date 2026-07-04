"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import Toolbar from "./Toolbar";
import PdfPage from "./PdfPage";
import { useAtlat } from "@/context/AtlatContext";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const {
    currentPage,
    setCurrentPage,
     scrollToPage,
    setScrollToPage,
    totalPages,
    setTotalPages,
    scale,
    setScale,
    visitedPages,
    setVisitedPages,
    history,
    setHistory,
    recentPages,
    setRecentPages,
  } = useAtlat();

  const scrollRef = useRef<HTMLDivElement>(null);

  // đang scroll bằng thumbnail hay toolbar

  // số trang đã render
  const [loadedPages, setLoadedPages] =
    useState(4);

  /*
      ============================
      PDF Loaded
      ============================
  */

  function onLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }) {
    setTotalPages(numPages);

    setLoadedPages(
      Math.min(4, numPages)
    );
  }

  /*
      ============================
      Pages
      ============================
  */

  const pages = useMemo(
    () =>
      Array.from(
        {
          length: loadedPages,
        },
        (_, i) => i + 1
      ),
    [loadedPages]
  );

  /*
      ============================
      Thumbnail -> PDF
      ============================
  */

  useEffect(() => {
  const container = scrollRef.current;

  if (!container) return;

  if (scrollToPage == null) return;

  // nếu trang chưa render thì render thêm
if (scrollToPage > loadedPages) {

  setLoadedPages(scrollToPage);

  return;

}

  const target = document.getElementById(
    `page-${scrollToPage}`
  );

 if (!target) {

  requestAnimationFrame(() => {
    setScrollToPage(scrollToPage);
  });

  return;

}

container.scrollTo({
  top: target.offsetTop - 20,
  behavior: "smooth",
});

  const finish = () => {
    setScrollToPage(null);
  };

  // Chrome hỗ trợ
  if ("onscrollend" in container) {
    container.addEventListener(
      "scrollend",
      finish,
      {
        once: true,
      }
    );
  } else {
    // Safari / Firefox
    let timeout: NodeJS.Timeout;

    const onScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        finish();
        scrollRef.current?.removeEventListener(
          "scroll",
          onScroll
        );
      }, );
    };

    scrollRef.current?.removeEventListener(
      "scroll",
      onScroll
    );
  }

}, [
  scrollToPage,
  loadedPages,
]);
  /*
      ============================
      PDF -> Current Page
      ============================
  */

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    let raf = 0;

    const updateCurrentPage = () => {
if (scrollToPage !== null) return;
      const pageElements = Array.from(
        container.querySelectorAll("[data-page]")
      ) as HTMLElement[];

      if (pageElements.length === 0) return;

      const root =
  container.getBoundingClientRect();

let bestPage = currentPage;
let bestVisible = -1;

for (const element of pageElements) {

  const rect =
    element.getBoundingClientRect();

  const visible =
    Math.min(rect.bottom, root.bottom) -
    Math.max(rect.top, root.top);

  if (visible > bestVisible) {

    bestVisible = visible;

    bestPage = Number(
      element.dataset.page
    );

  }

}

      setCurrentPage((prev) =>
        prev === bestPage
          ? prev
          : bestPage
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);

      raf =
        requestAnimationFrame(
          updateCurrentPage
        );
    };

    container.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    updateCurrentPage();

    return () => {
      cancelAnimationFrame(raf);

      container.removeEventListener(
        "scroll",
        onScroll
      );
    };

}, [loadedPages, scrollToPage]);

  /*
      ============================
      Visited Pages
      ============================
  */

  useEffect(() => {
    setVisitedPages((prev) => {
      if (
        prev.includes(currentPage)
      )
        return prev;

      return [...prev, currentPage].sort(
        (a, b) => a - b
      );
    });
  }, [currentPage]);

  /*
      ============================
      History
      ============================
  */

  useEffect(() => {
    setHistory((prev) => {
      const list = prev.filter(
        (p) => p !== currentPage
      );

      list.unshift(currentPage);

      return list.slice(0, 10);
    });
  }, [currentPage]);

  /*
      ============================
      Recent
      ============================
  */

  useEffect(() => {
    setRecentPages((prev) => {
      const list = prev.filter(
        (item) =>
          item.page !== currentPage
      );

      list.unshift({
        page: currentPage,
        time: Date.now(),
      });

      return list.slice(0, 8);
    });
  }, [currentPage]);

  /*
      ============================
      Lazy Load
      ============================
  */

  useEffect(() => {
const container = scrollRef.current as HTMLDivElement | null;

if (!container) return;

    const onScroll = () => {
      if (
        container.scrollTop +
          container.clientHeight >=
        container.scrollHeight -
          1200
      ) {
        setLoadedPages((prev) => {
          if (
            prev >= totalPages
          )
            return prev;

          return Math.min(
            prev + 2,
            totalPages
          );
        });
      }
    };

    container.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () => {
      container.removeEventListener(
        "scroll",
        onScroll
      );
    };

  }, [totalPages]);
    return (
    <div className="flex h-full flex-col overflow-hidden bg-[#12263A]">

      <Toolbar
        page={currentPage}
        total={totalPages}

        onPrev={() => {

    if(currentPage>1){

        setScrollToPage(currentPage-1);

    }

}}

        onNext={() => {

    if(currentPage<totalPages){

        setScrollToPage(currentPage+1);

    }

}}
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#081220]"
      >
        <Document
          file="/atlat.pdf"
          onLoadSuccess={onLoadSuccess}
          loading={
            <div className="flex justify-center py-10">
              <div
                className="
                  h-[900px]
                  w-[650px]
                  animate-pulse
                  rounded-2xl
                  bg-slate-700
                "
              />
            </div>
          }
          error={
            <div className="py-10 text-center text-red-400">
              Không thể tải Atlat PDF.
            </div>
          }
        >
          <div className="flex flex-col items-center gap-8 py-8">

            {pages.map((page) => (
              <PdfPage
                key={page}
                page={page}
                scale={scale}
              />
            ))}

            {loadedPages < totalPages && (
              <div className="pb-8 text-sm text-slate-400">
                Cuộn xuống để tải thêm...
              </div>
            )}

          </div>
        </Document>
      </div>

    </div>
  );
}