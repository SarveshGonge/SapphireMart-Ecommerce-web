import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";

export default function Cart() {
  const { items, loading, refreshCart, updateQuantity, remove, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-slate-300 mb-4" strokeWidth={1.2} />
        <p className="font-display text-2xl tracking-wide text-ink">Your bag is empty</p>
        <p className="text-slate-500 text-sm mt-1 mb-6">Add items to get started.</p>
        <Link
          to="/"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold uppercase tracking-wide text-sm px-8 py-3 rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-1">My Bag</h1>
      <p className="text-sm text-slate-500 mb-6">{items.length} item{items.length > 1 ? "s" : ""}</p>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-white p-4 rounded-sm border border-slate-100"
          >
            <Link to={`/products/${item.product.id}`} className="shrink-0">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-20 w-20 rounded-sm object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              {/* Top row: name + per-item price */}
              <div>
                <Link to={`/products/${item.product.id}`} className="font-medium text-ink truncate hover:text-brand-600 block">
                  {item.product.name}
                </Link>
                <p className="text-sm text-slate-500">₹{item.product.price.toFixed(2)} each</p>
              </div>

              {/* Bottom row: quantity selector + total price + remove */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <div className="flex items-center border border-slate-200 rounded-sm shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-slate-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-slate-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-ink whitespace-nowrap">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button onClick={() => remove(item.id)} className="p-2 text-slate-400 hover:text-brand-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full sm:w-80 bg-white border border-slate-100 rounded-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Price Details</p>
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-emerald-700 mb-2">
            <span>Delivery</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-ink border-t border-slate-100 pt-3 mt-3">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold uppercase tracking-wide text-sm rounded-sm"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
