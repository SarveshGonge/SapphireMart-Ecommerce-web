import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(ids.map((id) => fetchProduct(id).then((r) => r.data).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={22} className="text-brand-500" fill="currentColor" />
        <h1 className="font-display text-3xl tracking-wide text-ink">My Wishlist</h1>
      </div>

      {loading ? (
        <ProductGridSkeleton count={ids.length || 4} />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">💔</p>
          <p className="text-slate-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-brand-600 font-semibold hover:underline">
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
