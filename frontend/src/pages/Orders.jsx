import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { fetchMyOrders } from "../api/orders";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";

const STATUS_COLORS = {
  PLACED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PAYMENT_STATUS_COLORS = {
  PENDING: "bg-slate-100 text-slate-600",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

const PAYMENT_METHOD_LABELS = {
  RAZORPAY: "Online Payment",
  CASH_ON_DELIVERY: "Cash on Delivery",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchMyOrders({ page })
      .then(({ data }) => {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={56} className="mx-auto text-slate-300 mb-4" strokeWidth={1.2} />
          <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="text-brand-600 font-bold hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-100 rounded-sm p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold text-ink">Order #{order.id}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 text-sm">
                    <span className="text-slate-700">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-slate-600">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3 mt-2 border-t border-slate-100 font-bold text-ink">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
