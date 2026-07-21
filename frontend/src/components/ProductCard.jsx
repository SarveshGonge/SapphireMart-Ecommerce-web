import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { ratingFor, ratingCountFor, discountFor, mrpFor, badgeFor } from "../utils/productDisplay";

const BADGE_STYLES = {
  BESTSELLER: "bg-ink text-white",
  TRENDING: "bg-brand-500 text-white",
  NEW: "bg-emerald-600 text-white",
};

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();

  const rating = ratingFor(product.id);
  const ratingCount = ratingCountFor(product.id);
  const discount = discountFor(product.id);
  const mrp = mrpFor(product.price, product.id);
  const badge = badgeFor(product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    add(product.id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group relative bg-white rounded-[10px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.04] transition-all duration-300 ease-out animate-fadeUp"
    >
      {badge && (
        <span className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-sm ${BADGE_STYLES[badge]}`}>
          {badge}
        </span>
      )}

      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          size={16}
          className={wishlisted ? "text-brand-500 animate-heartPop" : "text-slate-400"}
          fill={wishlisted ? "currentColor" : "none"}
        />
      </button>

      <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ink text-white text-xs font-bold tracking-wide uppercase py-2.5 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
        </button>
      </div>

      <div className="p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 truncate">{product.category}</p>
        <h3 className="mt-0.5 text-sm text-ink font-medium line-clamp-1">{product.name}</h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
            {rating} <Star size={10} fill="currentColor" />
          </span>
          <span className="text-[11px] text-slate-400">({ratingCount.toLocaleString()})</span>
        </div>

        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="font-bold text-ink">₹{product.price.toFixed(0)}</span>
          {mrp && (
            <>
              <span className="text-xs text-slate-400 line-through">₹{mrp.toFixed(0)}</span>
              <span className="text-xs font-semibold text-brand-600">{discount}% OFF</span>
            </>
          )}
        </div>

        {product.stock > 0 && product.stock <= 15 && (
          <p className="mt-1 text-[11px] font-medium text-orange-600">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
}
