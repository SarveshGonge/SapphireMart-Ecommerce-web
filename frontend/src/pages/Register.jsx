import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(fullName, email, password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === "string" ? data : data?.message || Object.values(data || {})[0] || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 rounded-sm overflow-hidden shadow-sm">
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-ink to-slate-700 p-10 text-white">
        <Logo iconSize={40} showText={false} className="mb-4" />
        <p className="font-display text-5xl leading-tight">JOIN SAPPHIREMART CLUB</p>
        <p className="mt-4 text-white/85 text-sm">
          Create an account to save your wishlist, speed through checkout, and track every order.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10">
        <h1 className="text-xl font-bold text-ink mb-1">Sign Up</h1>
        <p className="text-sm text-slate-500 mb-6">Create your account in seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-1 py-2.5 border-b-2 border-slate-200 focus:border-brand-500 focus:outline-none text-sm"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-1 py-2.5 border-b-2 border-slate-200 focus:border-brand-500 focus:outline-none text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 6 characters)"
            className="w-full px-1 py-2.5 border-b-2 border-slate-200 focus:border-brand-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-sm rounded-sm"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
