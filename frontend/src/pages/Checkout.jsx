import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, Banknote, MapPin, Plus, ShieldCheck } from "lucide-react";
import { checkout } from "../api/orders";
import { fetchAddresses, createAddress } from "../api/addresses";
import { createRazorpayOrder } from "../api/payments";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const METHODS = [
  { id: "RAZORPAY", label: "Pay Online (Card / UPI / Net Banking)", icon: CreditCard },
  { id: "CASH_ON_DELIVERY", label: "Cash on Delivery", icon: Banknote },
];

const EMPTY_ADDRESS = {
  label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "India", isDefault: false,
};

function formatAddress(a) {
  return `${a.fullName}, ${a.addressLine1}${a.addressLine2 ? ", " + a.addressLine2 : ""}, ${a.city}, ${a.state} ${a.postalCode}, ${a.country} — Phone: ${a.phone}`;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, totalPrice, refreshCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);

  const [method, setMethod] = useState("RAZORPAY");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const loadAddresses = () => {
    setAddressesLoading(true);
    fetchAddresses()
      .then(({ data }) => {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        if (data.length === 0) setShowAddForm(true);
      })
      .finally(() => setAddressesLoading(false));
  };

  useEffect(loadAddresses, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { data } = await createAddress(newAddress);
      toast.success("Address saved");
      setShowAddForm(false);
      setNewAddress(EMPTY_ADDRESS);
      const { data: all } = await fetchAddresses();
      setAddresses(all);
      setSelectedAddressId(data.id);
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === "string" ? data : data?.message || Object.values(data || {})[0] || "Could not save address";
      toast.error(msg);
    } finally {
      setSavingAddress(false);
    }
  };

  const finalizeOrder = useCallback(async (payload) => {
    try {
      const { data } = await checkout(payload);
      await refreshCart();
      toast.success(
        data.paymentStatus === "PAID" ? "Payment successful — order placed!" : "Order placed (pay on delivery)"
      );
      navigate("/orders", { state: { newOrderId: data.id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }, [refreshCart, navigate]);

  const handleRazorpayPayment = useCallback(async (shippingAddress) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Could not load Razorpay checkout. Check your internet connection.");
      setPlacing(false);
      return;
    }

    let razorpayOrder;
    try {
      const { data } = await createRazorpayOrder();
      razorpayOrder = data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start payment — is Razorpay configured?");
      setPlacing(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.orderId,
      name: "SapphireMart",
      description: "Order payment",
      prefill: { name: user?.fullName, email: user?.email },
      theme: { color: "#ff3f6c" },
      handler: (response) => {
        finalizeOrder({
          shippingAddress,
          paymentMethod: "RAZORPAY",
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          setPlacing(false);
          toast("Payment cancelled", { icon: "ℹ️" });
        },
      },
    });

    rzp.on("payment.failed", () => {
      setPlacing(false);
      toast.error("Payment failed. Please try again.");
    });

    rzp.open();
  }, [user, finalizeOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (!selected) {
      toast.error("Please select or add a shipping address");
      return;
    }

    setPlacing(true);
    const shippingAddress = formatAddress(selected);

    if (method === "RAZORPAY") {
      handleRazorpayPayment(shippingAddress);
    } else {
      finalizeOrder({ shippingAddress, paymentMethod: "CASH_ON_DELIVERY" });
    }
  };

  if (items.length === 0) {
    return <p className="text-center py-20 text-slate-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <MapPin size={16} /> Shipping Address
            </label>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm((s) => !s)}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
              >
                <Plus size={13} /> Add New
              </button>
            )}
          </div>

          {addressesLoading ? (
            <p className="text-sm text-slate-400">Loading addresses...</p>
          ) : addresses.length > 0 && !showAddForm ? (
            <div className="space-y-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer ${
                    selectedAddressId === a.id ? "border-brand-500 bg-brand-50" : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === a.id}
                    onChange={() => setSelectedAddressId(a.id)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-ink">{a.label}</span>
                    {a.isDefault && <span className="ml-2 text-xs text-emerald-700 font-medium">Default</span>}
                    <p className="text-slate-600">
                      {a.fullName} — {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}, {a.city}, {a.state} {a.postalCode}
                    </p>
                  </div>
                </label>
              ))}
              <Link to="/addresses" className="inline-block text-xs text-slate-400 hover:text-brand-600 mt-1">
                Manage addresses
              </Link>
            </div>
          ) : (
            <div className="space-y-3 border border-slate-200 rounded-sm p-4">
              <input required placeholder="Full Name" value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm" />
              <input required placeholder="Phone Number" value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm" />
              <input required placeholder="Address Line 1" value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm" />
              <div className="flex gap-2">
                <input required placeholder="City" value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm text-sm" />
                <input required placeholder="State" value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm text-sm" />
                <input required placeholder="PIN" value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  className="w-full min-w-0 px-3 py-2 border border-slate-200 rounded-sm text-sm" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddAddress}
                  disabled={savingAddress}
                  className="flex-1 py-2 bg-ink text-white text-xs font-bold uppercase tracking-wide rounded-sm disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : "Save & Use This Address"}
                </button>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
          <div className="space-y-2">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded-sm border text-sm font-medium ${
                  method === id
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {method === "RAZORPAY" && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={13} /> Secured by Razorpay — supports cards, UPI, and net banking.
            </p>
          )}
          {method === "CASH_ON_DELIVERY" && (
            <p className="mt-2 text-xs text-slate-400">Pay in cash when your order arrives.</p>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-900">
          <span>Order Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-sm"
        >
          {placing ? "Processing..." : method === "RAZORPAY" ? "Proceed to Pay" : "Place Order"}
        </button>
      </form>
    </div>
  );
}
