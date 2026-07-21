import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import { fetchProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { ratingFor, ratingCountFor, discountFor, mrpFor } from "../utils/productDisplay";
import Spinner from "../components/Spinner";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const { add } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();

  const isFashion = product?.category === "Fashion" || product?.category === "Clothing";

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null);
    fetchProduct(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">😕</p>
        <p className="text-slate-500">Product not found.</p>
      </div>
    );
  }

  const rating = ratingFor(product.id);
  const ratingCount = ratingCountFor(product.id);
  const discount = discountFor(product.id);
  const mrp = mrpFor(product.price, product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isFashion && !selectedSize) {
      return;
    }
    add(product.id, qty);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-xs text-slate-400 mb-4">
        <Link to="/" className="hover:text-brand-600">Home</Link> / <span>{product.category}</span> / <span className="text-ink">{product.name}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="md:sticky md:top-24 self-start">
          <div className="aspect-[3/4] bg-slate-100 rounded-sm overflow-hidden relative group">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={() => toggle(product.id)}
              className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
            >
              <Heart size={18} className={wishlisted ? "text-brand-500" : "text-slate-400"} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink leading-snug">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              {rating} <Star size={11} fill="currentColor" />
            </span>
            <span className="text-xs text-slate-500">{ratingCount.toLocaleString()} Ratings</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold text-ink">₹{product.price.toFixed(0)}</span>
            {mrp && (
              <>
                <span className="text-base text-slate-400 line-through">₹{mrp.toFixed(0)}</span>
                <span className="text-base font-semibold text-brand-600">{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">inclusive of all taxes</p>

          <p className="mt-5 text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {isFashion && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wide text-ink mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 w-11 rounded-full border text-sm font-semibold transition-colors ${
                      selectedSize === s
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-300 text-ink hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-xs text-slate-400 mt-1.5">Please select a size</p>}
            </div>
          )}

          <p className={`mt-6 text-sm font-semibold ${product.stock > 0 ? "text-emerald-700" : "text-red-500"}`}>
            {product.stock > 0 ? `In Stock — ${product.stock} available` : "Out of Stock"}
          </p>

          {product.stock > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-sm">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-slate-50">
                  <Minus size={16} />
                </button>
                <span className="px-5 font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3 hover:bg-slate-50">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {product.stock > 0 && (
            <button
              onClick={handleAdd}
              disabled={isFashion && !selectedSize}
              className="mt-5 w-full sm:w-auto px-10 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wide text-sm rounded-sm"
            >
              Add to Bag
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Truck size={18} className="text-brand-500 shrink-0" /> Free delivery in 3–5 days
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <RotateCcw size={18} className="text-brand-500 shrink-0" /> 7-day easy returns
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck size={18} className="text-brand-500 shrink-0" /> 100% secure payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
