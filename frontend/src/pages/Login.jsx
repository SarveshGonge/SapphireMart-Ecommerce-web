import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 rounded-sm overflow-hidden shadow-sm">
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-brand-500 to-brand-800 p-10 text-white">
        <Logo iconSize={40} showText={false} className="mb-4" />
        <p className="font-display text-5xl leading-tight">WELCOME TO SAPPHIREMART</p>
        <p className="mt-4 text-white/85 text-sm">
          Log in to track orders, manage your wishlist, and pick up right where you left off.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10">
        <h1 className="text-xl font-bold text-ink mb-1">Login</h1>
        <p className="text-sm text-slate-500 mb-6">Get access to your orders and wishlist.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-1 py-2.5 border-b-2 border-slate-200 focus:border-brand-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-1 py-2.5 border-b-2 border-slate-200 focus:border-brand-500 focus:outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-sm rounded-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        <div className="mt-8 p-3 bg-mist rounded-sm text-xs text-slate-500">
          <p className="font-semibold mb-1">Demo credentials</p>
          <p>Customer: user@ecommerce.com / User@123</p>
          <p>Admin: admin@ecommerce.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
}
