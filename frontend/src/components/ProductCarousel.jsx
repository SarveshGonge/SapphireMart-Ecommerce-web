import { useRef, useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const AUTO_SCROLL_INTERVAL_MS = 6000;
const SCROLL_AMOUNT_PX = 320;

export default function ProductCarousel({ title, subtitle, products, loading, bleed = false }) {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const scrollByAmount = useCallback((amount) => {
    const track = trackRef.current;
    if (!track) return;

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    const atStart = track.scrollLeft <= 5;

    if (amount > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (amount < 0 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: amount, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (paused || loading || !products?.length) return;

    timerRef.current = setInterval(() => scrollByAmount(SCROLL_AMOUNT_PX), AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, loading, products, scrollByAmount]);

  return (
    <section
      className={`rounded-lg px-4 sm:px-6 py-6 mb-8 ${bleed ? "" : "max-w-7xl mx-auto lg:px-8"}`}
      style={{ background: "linear-gradient(180deg, #EAF4FF 0%, #F1F2FF 50%, #F4E7FF 100%)" }}
    >
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display text-3xl tracking-wide text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByAmount(-SCROLL_AMOUNT_PX)}
            aria-label="Scroll left"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 bg-white/70 text-ink hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByAmount(SCROLL_AMOUNT_PX)}
            aria-label="Scroll right"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 bg-white/70 text-ink hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-40 sm:w-48 shrink-0 snap-start">
                <div className="aspect-[3/4] skeleton animate-shimmer rounded-[10px] bg-white" />
                <div className="h-3 w-3/4 skeleton animate-shimmer rounded mt-2" />
              </div>
            ))
          : products.map((p, i) => (
              <div key={p.id} className="w-40 sm:w-48 shrink-0 snap-start">
                <ProductCard product={p} index={i} />
              </div>
            ))}
      </div>
    </section>
  );
}
