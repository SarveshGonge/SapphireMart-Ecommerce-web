import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import Pagination from "../components/Pagination";
import { CATEGORIES } from "../constants/categories";

const SLIDES = [
  {
    title: "END OF SEASON",
    subtitle: "SALE",
    tag: "Up to 60% OFF across every category",
    from: "from-brand-600",
    to: "to-brand-800",
  },
  {
    title: "NEW ARRIVALS",
    subtitle: "JUST DROPPED",
    tag: "Fresh styles added to 500+ products",
    from: "from-ink",
    to: "to-slate-700",
  },
  {
    title: "TRENDING NOW",
    subtitle: "SHOP THE EDIT",
    tag: "Handpicked bestsellers, curated daily",
    from: "from-emerald-700",
    to: "to-emerald-900",
  },
];

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price,asc", label: "Price: Low to High" },
  { value: "price,desc", label: "Price: High to Low" },
  { value: "name,asc", label: "Name: A to Z" },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [slide, setSlide] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [categoryRail, setCategoryRail] = useState([]);
  const [categoryRailLoading, setCategoryRailLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const isDefaultView = !category && !search;

  const slideTimer = useRef(null);

  useEffect(() => {
    slideTimer.current = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(slideTimer.current);
  }, []);

  // Two curated homepage rails — fetched once, independent of the main
  // grid's filters/pagination below. Only relevant on the default view.
  useEffect(() => {
    if (!isDefaultView) return;

    setNewArrivalsLoading(true);
    fetchProducts({ page: 0, size: 16, sort: "id,desc" })
      .then(({ data }) => setNewArrivals(data.content))
      .catch(() => {})
      .finally(() => setNewArrivalsLoading(false));

    setTrendingLoading(true);
    fetchProducts({ page: 0, size: 16, sort: "price,desc" })
      .then(({ data }) => setTrending(data.content))
      .catch(() => {})
      .finally(() => setTrendingLoading(false));
  }, [isDefaultView]);

  // When browsing a specific category (not search), show one rail of
  // trending products from that same category — replicates the homepage
  // rail experience on category pages (Electronics, Fashion, Books, etc.)
  useEffect(() => {
    if (isDefaultView || !category) return;

    setCategoryRailLoading(true);
    fetchProducts({ page: 0, size: 16, category, sort: "price,desc" })
      .then(({ data }) => setCategoryRail(data.content))
      .catch(() => {})
      .finally(() => setCategoryRailLoading(false));
  }, [isDefaultView, category]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ page, size: 60, category, search, sort });
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      // Product listing is public; a failure here likely means the API is unreachable.
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [category, search, sort]);

  const setCategory = (c) => {
    const next = new URLSearchParams(searchParams);
    if (c) next.set("category", c); else next.delete("category");
    setSearchParams(next);
  };

  const setSort = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("sort", value); else next.delete("sort");
    setSearchParams(next);
    setSortOpen(false);
  };

  const activeSlide = SLIDES[slide];

  return (
    <div>
      {/* Hero carousel */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${activeSlide.from} ${activeSlide.to} transition-colors duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <p key={slide + "-tag"} className="text-white/80 font-semibold tracking-[0.3em] text-xs sm:text-sm animate-fadeUp">
            {activeSlide.subtitle}
          </p>
          <h1 key={slide + "-title"} className="font-display text-6xl sm:text-8xl text-white leading-none mt-2 animate-fadeUp">
            {activeSlide.title}
          </h1>
          <p key={slide + "-desc"} className="mt-4 text-white/90 text-sm sm:text-base max-w-md animate-fadeUp">
            {activeSlide.tag}
          </p>
          <button
            onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 bg-white text-ink font-bold text-sm tracking-wide uppercase px-7 py-3 rounded-sm hover:bg-mist transition-colors"
          >
            Shop Now
          </button>
        </div>

        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Category quick-links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-sm shadow-md flex overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(category === c.name ? "" : c.name)}
              className={`flex flex-col items-center gap-1 px-5 py-4 whitespace-nowrap border-b-2 transition-colors ${
                category === c.name ? "border-brand-500 text-brand-600" : "border-transparent text-ink hover:text-brand-500"
              }`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="product-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-3xl tracking-wide text-ink">
              {search ? `Results for "${search}"` : category || "All Products"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Browse our catalog of 500+ products across 11 categories</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink border border-slate-200 rounded-sm hover:border-slate-300"
            >
              Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Recommended"}
              <ChevronDown size={15} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-sm shadow-lg z-30 w-52">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-mist ${
                      sort === opt.value ? "text-brand-600 font-semibold" : "text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={60} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-slate-500">No products found. Try a different filter.</p>
          </div>
        ) : isDefaultView ? (
          <>
            <ProductGrid products={products.slice(0, 15)} startIndex={0} />

            <ProductCarousel
              title="New Arrivals"
              subtitle="Freshly added to the catalog"
              products={newArrivals}
              loading={newArrivalsLoading}
              bleed
            />

            <ProductGrid products={products.slice(15, 45)} startIndex={15} />

            <ProductCarousel
              title="Trending Now"
              subtitle="Popular picks shoppers are loving"
              products={trending}
              loading={trendingLoading}
              bleed
            />

            <ProductGrid products={products.slice(45)} startIndex={45} />

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : category ? (
          <>
            <ProductGrid products={products.slice(0, 15)} startIndex={0} />

            <ProductCarousel
              title={`Trending in ${category}`}
              subtitle="Popular picks in this category"
              products={categoryRail}
              loading={categoryRailLoading}
              bleed
            />

            <ProductGrid products={products.slice(15)} startIndex={15} />

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <>
            <ProductGrid products={products} startIndex={0} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products, startIndex }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={startIndex + i} />
      ))}
    </div>
  );
}
