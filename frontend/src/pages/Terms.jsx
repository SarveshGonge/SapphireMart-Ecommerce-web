export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-4xl tracking-wide text-ink mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: July 2026</p>

      <div className="text-sm sm:text-base text-slate-600 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or placing an order on SapphireMart, you agree to these terms.
            If you do not agree, please discontinue use of the platform.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">2. Orders &amp; Payments</h2>
          <p>
            Orders are confirmed once payment is successfully verified (for online payments via
            Razorpay) or placed (for Cash on Delivery). Product prices, availability, and stock
            levels are subject to change without notice.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">3. Shipping</h2>
          <p>
            Orders are shipped to the address selected at checkout. Delivery timelines shown are
            estimates and are not guaranteed.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">4. Returns &amp; Refunds</h2>
          <p>
            Eligible items may be returned within 7 days of delivery. Refunds for online
            payments are processed back to the original payment method via Razorpay.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink mb-2">5. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activity that occurs under your account.
          </p>
        </section>
        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
          This is a demonstration terms document for a portfolio project and does not constitute
          a legally binding agreement.
        </p>
      </div>
    </div>
  );
}
