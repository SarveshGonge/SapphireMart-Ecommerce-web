import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Logo from "./Logo";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Logo iconSize={30} textClassName="text-2xl text-white" />
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Everything you need, in one place. A full-stack e-commerce platform built with
            Spring Boot, React, and Oracle SQL.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://www.instagram.com/sarvesh_gonge?igsh=MW40cW1tMzRpZDl3dg=="
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-brand-400"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://x.com/Sarvesh_gonge"
              target="_blank" rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-slate-400 hover:text-brand-400"
            >
              <XIcon />
            </a>
            <a
              href="mailto:sarveshgonge@gmail.com"
              aria-label="Email"
              className="text-slate-400 hover:text-brand-400"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300 mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
            <li><Link to="/" className="hover:text-white">Press</Link></li>
            <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300 mb-3">Help</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/" className="hover:text-white">Shipping Info</Link></li>
            <li><Link to="/" className="hover:text-white">Returns & Refunds</Link></li>
            <li><Link to="/" className="hover:text-white">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300 mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/" className="hover:text-white">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <span>© {year} SapphireMart. All rights reserved.</span>
          <span>Built by Sarvesh Gonge — a portfolio project for demonstration purposes.</span>
        </div>
      </div>
    </footer>
  );
}
