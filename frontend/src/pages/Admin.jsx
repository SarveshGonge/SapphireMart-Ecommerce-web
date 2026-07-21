import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, TrendingUp, IndianRupee, ShoppingBag } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { fetchAllOrders, updateOrderStatus } from "../api/orders";
import { fetchSalesSummary } from "../api/analytics";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";

const EMPTY_FORM = { name: "", description: "", price: "", costPrice: "", category: "", imageUrl: "", stock: "" };
const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function Admin() {
  const [tab, setTab] = useState("products");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {["products", "orders", "analytics"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize ${
              tab === t ? "border-brand-500 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" ? <ProductsTab /> : tab === "orders" ? <OrdersTab /> : <AnalyticsTab />}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts({ page, size: 10 })
      .then(({ data }) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description || "", price: p.price, costPrice: p.costPrice ?? "",
      category: p.category, imageUrl: p.imageUrl || "", stock: p.stock,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: Number(form.price), costPrice: Number(form.costPrice), stock: Number(form.stock) };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-sm"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <textarea placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" rows={3} />
              <input required placeholder="Category" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <input placeholder="Image URL" value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <div className="flex gap-3">
                <input required type="number" step="0.01" placeholder="Price" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
                <input required type="number" step="0.01" placeholder="Cost Price" value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              </div>
              <p className="text-xs text-slate-400 -mt-1.5">Cost price is used to calculate profit in Analytics — never shown to customers.</p>
              <input required type="number" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <button disabled={saving} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-sm">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Margin</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.category}</td>
                  <td className="px-4 py-3">₹{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    {p.costPrice ? `${(((p.price - p.costPrice) / p.price) * 100).toFixed(0)}%` : "—"}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-500 hover:text-brand-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function AnalyticsTab() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);

  const load = (y) => {
    setLoading(true);
    fetchSalesSummary(y)
      .then(({ data }) => {
        setSummary(data);
        setYear(data.year);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => load(year), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !summary) return <Spinner />;

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = summary.monthly.map((m) => ({
    month: monthLabels[m.month - 1],
    Revenue: m.revenue,
    Profit: m.profit,
  }));

  const marginPct = summary.totalRevenue > 0 ? (summary.totalProfit / summary.totalRevenue) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">Sales and profit overview</p>
        <select
          value={year}
          onChange={(e) => load(Number(e.target.value))}
          className="border border-slate-200 rounded-sm px-3 py-1.5 text-sm font-semibold text-ink"
        >
          {summary.availableYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-100 rounded-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
            <IndianRupee size={14} /> Total Revenue
          </div>
          <p className="text-2xl font-bold text-ink">₹{summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
            <TrendingUp size={14} /> Total Profit
          </div>
          <p className="text-2xl font-bold text-emerald-700">₹{summary.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-slate-400 mt-1">{marginPct.toFixed(1)}% margin</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
            <ShoppingBag size={14} /> Total Orders
          </div>
          <p className="text-2xl font-bold text-ink">{summary.totalOrders.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-sm p-5">
        <p className="text-sm font-semibold text-ink mb-4">Monthly Revenue vs. Profit — {summary.year}</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <Legend />
            <Bar dataKey="Revenue" fill="#ff3f6c" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Profit" fill="#282c3f" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = () => {
    setLoading(true);
    fetchAllOrders({ page })
      .then(({ data }) => {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-medium text-slate-800">#{o.id}</td>
                <td className="px-4 py-3 text-slate-600">{o.user?.fullName}</td>
                <td className="px-4 py-3">₹{o.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-500">{o.paymentMethod}</div>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    o.paymentStatus === "PAID" ? "bg-green-100 text-green-700" :
                    o.paymentStatus === "FAILED" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="border border-slate-200 rounded-sm px-2 py-1"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
