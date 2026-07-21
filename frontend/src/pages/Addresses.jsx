import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { fetchAddresses, createAddress, updateAddress, deleteAddress } from "../api/addresses";
import Spinner from "../components/Spinner";

const EMPTY_FORM = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAddresses()
      .then(({ data }) => setAddresses(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ ...a });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success("Address updated");
      } else {
        await createAddress(form);
        toast.success("Address added");
      }
      setShowForm(false);
      load();
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === "string" ? data : data?.message || Object.values(data || {})[0] || "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address.id, { ...address, isDefault: true });
      toast.success("Default address updated");
      load();
    } catch (err) {
      toast.error("Could not update default address");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-wide text-ink">Manage Addresses</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold uppercase tracking-wide rounded-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20">
          <MapPin size={56} className="mx-auto text-slate-300 mb-4" strokeWidth={1.2} />
          <p className="text-slate-500">You haven't saved any addresses yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="bg-white border border-slate-100 rounded-sm p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-mist text-xs font-bold uppercase tracking-wide rounded-sm text-ink">
                      {a.label}
                    </span>
                    {a.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <Check size={12} /> Default
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-ink">{a.fullName}</p>
                  <p className="text-sm text-slate-600">
                    {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}, {a.city}, {a.state} {a.postalCode}, {a.country}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Phone: {a.phone}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(a)} className="p-1.5 text-slate-500 hover:text-brand-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {!a.isDefault && (
                <button
                  onClick={() => handleSetDefault(a)}
                  className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-ink">{editingId ? "Edit Address" : "New Address"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm"
              >
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
              <input required placeholder="Full Name" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <input required placeholder="Phone Number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <input required placeholder="Address Line 1" value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <input placeholder="Address Line 2 (optional)" value={form.addressLine2 || ""}
                onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm" />
              <div className="flex gap-3">
                <input required placeholder="City" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm" />
                <input required placeholder="State" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm" />
              </div>
              <div className="flex gap-3">
                <input required placeholder="Postal Code" value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm" />
                <input placeholder="Country" value={form.country || "India"}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={!!form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                Set as default address
              </label>
              <button
                disabled={saving}
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-sm rounded-sm"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
