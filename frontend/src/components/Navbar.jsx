import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag, Heart, User, LogOut, Package, LayoutDashboard, Search, Menu, X, MapPin, Home as HomeIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { CATEGORIES } from "../constants/categories";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    closeMobile();
    navigate(query.trim() ? `/?search=${encodeURIComponent(query.trim())}` : "/");
  };

  // Auto-close on route change — covers product-detail navigation, category
  // clicks, and any other in-app navigation, even ones not wired to
  // closeMobile() individually.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  // Close on Escape key.
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const mobileLinkClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-ink hover:bg-mist rounded-sm";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center gap-3">
        {/* Logo — pinned to the far left on every screen size */}
        <Link to="/" className="shrink-0 select-none mr-auto lg:mr-0">
          <Logo iconSize={26} textClassName="text-[22px] sm:text-2xl lg:text-3xl text-ink" />
        </Link>

        {/* Search — hidden on small screens, shown from md up */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full bg-mist rounded-sm pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-300"
          />
        </form>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-5 sm:gap-7">
          {user ? (
            <div className="flex flex-col items-center text-[11px] font-semibold text-ink cursor-default">
              <User size={20} strokeWidth={1.7} />
              <span className="mt-0.5 max-w-[70px] truncate">{user.fullName.split(" ")[0]}</span>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
              <User size={20} strokeWidth={1.7} />
              <span className="mt-0.5">Login</span>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
              <LayoutDashboard size={20} strokeWidth={1.7} />
              <span className="mt-0.5">Admin</span>
            </Link>
          )}

          {user && (
            <Link to="/orders" className="flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
              <Package size={20} strokeWidth={1.7} />
              <span className="mt-0.5">Orders</span>
            </Link>
          )}

          {user && (
            <Link to="/addresses" className="flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
              <MapPin size={20} strokeWidth={1.7} />
              <span className="mt-0.5">Addresses</span>
            </Link>
          )}

          <Link to="/wishlist" className="relative flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
            <Heart size={20} strokeWidth={1.7} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
            <span className="mt-0.5">Wishlist</span>
          </Link>

          <Link to="/cart" className="relative flex flex-col items-center text-[11px] font-semibold text-ink hover:text-brand-500">
            <ShoppingBag size={20} strokeWidth={1.7} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="mt-0.5">Bag</span>
          </Link>

          {user && (
            <button onClick={handleLogout} className="flex flex-col items-center text-[11px] font-semibold text-slate-400 hover:text-red-500">
              <LogOut size={20} strokeWidth={1.7} />
              <span className="mt-0.5">Logout</span>
            </button>
          )}
        </nav>

        {/* Mobile header cluster: who's logged in + (admin shortcut, if
            admin) + wishlist + bag, all compact icons living right next to
            the logo. Hamburger sits at the far right to open the full
            drawer for everything else. */}
        <div className="flex lg:hidden items-center gap-3 sm:gap-4">
          {user ? (
            <Link to="/orders" className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link to="/login" className="text-ink shrink-0">
              <User size={22} strokeWidth={1.7} />
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="text-ink shrink-0" aria-label="Admin Dashboard">
              <LayoutDashboard size={22} strokeWidth={1.7} />
            </Link>
          )}

          <Link to="/wishlist" className="relative text-ink shrink-0">
            <Heart size={22} strokeWidth={1.7} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-ink shrink-0">
            <ShoppingBag size={22} strokeWidth={1.7} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="shrink-0"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 relative">
        <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more"
          className="w-full bg-mist rounded-sm pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none"
        />
      </form>

      {/* Desktop category strip */}
      <div className="hidden lg:flex flex-row items-center gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 h-12 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            to={`/?category=${encodeURIComponent(c.name)}`}
            className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-wide text-ink/80 hover:text-brand-500"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[82%] max-w-xs bg-white z-50 lg:hidden shadow-xl transition-transform duration-300 ease-out overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-[70px] border-b border-slate-100">
          <Logo iconSize={30} textClassName="text-2xl text-ink" />
          <button onClick={closeMobile} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="py-2">
          {user ? (
            <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 mb-2 bg-mist/60">
              <div className="h-11 w-11 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  isAdmin ? "bg-ink text-white" : "bg-brand-100 text-brand-600"
                }`}>
                  {isAdmin ? "Admin" : "Customer"}
                </span>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={closeMobile} className={mobileLinkClass}>
              <User size={18} /> Login
            </Link>
          )}

          <Link to="/" onClick={closeMobile} className={mobileLinkClass}>
            <HomeIcon size={18} /> Home
          </Link>

          {isAdmin && (
            <Link to="/admin" onClick={closeMobile} className={mobileLinkClass}>
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
          )}

          {user && (
            <Link to="/orders" onClick={closeMobile} className={mobileLinkClass}>
              <Package size={18} /> Orders
            </Link>
          )}

          {user && (
            <Link to="/addresses" onClick={closeMobile} className={mobileLinkClass}>
              <MapPin size={18} /> Addresses
            </Link>
          )}

          <Link to="/wishlist" onClick={closeMobile} className={mobileLinkClass}>
            <Heart size={18} /> Wishlist
            {wishlistIds.length > 0 && (
              <span className="ml-auto bg-brand-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <Link to="/cart" onClick={closeMobile} className={mobileLinkClass}>
            <ShoppingBag size={18} /> Bag
            {totalItems > 0 && (
              <span className="ml-auto bg-brand-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user && (
            <button onClick={handleLogout} className={`${mobileLinkClass} w-full text-left text-red-500 hover:bg-red-50`}>
              <LogOut size={18} /> Logout
            </button>
          )}

          <div className="border-t border-slate-100 mt-2 pt-2">
            <p className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Categories
            </p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                to={`/?category=${encodeURIComponent(c.name)}`}
                onClick={closeMobile}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/80 hover:bg-mist hover:text-brand-500"
              >
                <span className="text-base">{c.emoji}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
