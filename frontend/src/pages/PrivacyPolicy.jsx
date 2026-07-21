export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-4xl tracking-wide text-ink mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: July 2026</p>

      <div className="text-sm sm:text-base text-slate-600 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name, email address, and password
            (stored securely as a one-way hash — we never store plain-text passwords). When you
            save a shipping address, we store the address details, phone number, and recipient
            name you provide. When you place an order, we retain order and payment-status
            history associated with your account.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used solely to operate your account: processing orders,
            managing your cart and wishlist, delivering purchases to your saved addresses, and
            authenticating your login sessions via JWT tokens.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">3. Payment Information</h2>
          <p>
            Online payments are processed by Razorpay. SapphireMart does not store your card,
            UPI, or net banking credentials on its own servers — that data is handled entirely
            within Razorpay's secure, PCI-DSS-compliant infrastructure.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">4. Data Sharing</h2>
          <p>
            We do not sell or share your personal information with third parties, other than
            the payment processor (Razorpay) required to complete a transaction you initiate.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">5. Your Rights</h2>
          <p>
            You may update or delete your saved addresses at any time from your account. To
            request full account deletion, contact us using the details in the footer.
          </p>
        </section>
        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
          This is a demonstration policy for a portfolio project and does not constitute a
          legally binding agreement.
        </p>
      </div>
    </div>
  );
}
