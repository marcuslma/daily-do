"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarDay } from "@/lib/timezone";

type TodoAgendaCarouselProps = {
  children: ReactNode;
  dates: CalendarDay[];
};

export function TodoAgendaCarousel({
  children,
  dates,
}: TodoAgendaCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const finalIndex = Math.max(0, dates.length - 1);

  function getScrollIndex(scroller: HTMLDivElement) {
    if (scroller.clientWidth <= 0) {
      return 0;
    }

    return Math.min(
      finalIndex,
      Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth)),
    );
  }

  function handleScroll() {
    const scroller = scrollerRef.current;

    if (scroller) {
      setActiveIndex(getScrollIndex(scroller));
    }
  }

  function scrollToIndex(index: number) {
    const nextIndex = Math.min(finalIndex, Math.max(0, index));
    const scroller = scrollerRef.current;

    setActiveIndex(nextIndex);

    if (!scroller || scroller.clientWidth <= 0) {
      return;
    }

    const left = nextIndex * scroller.clientWidth;

    if (typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ behavior: "smooth", left });
      return;
    }

    scroller.scrollLeft = left;
  }

  return (
    <div className="space-y-3">
      <div
        aria-label="Agenda de tarefas"
        className="flex snap-x snap-mandatory overflow-x-auto"
        onScroll={handleScroll}
        ref={scrollerRef}
        role="region"
      >
        {children}
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          aria-label="Dia anterior"
          className="inline-flex size-8 items-center justify-center rounded-none border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-not-allowed disabled:opacity-50 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
          title="Dia anterior"
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <button
          aria-label="Próximo dia"
          className="inline-flex size-8 items-center justify-center rounded-none border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-not-allowed disabled:opacity-50 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
          disabled={activeIndex === finalIndex}
          onClick={() => scrollToIndex(activeIndex + 1)}
          title="Próximo dia"
          type="button"
        >
          <ChevronRight aria-hidden="true" size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
