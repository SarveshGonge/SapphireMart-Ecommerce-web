export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-4xl tracking-wide text-ink mb-6">About SapphireMart</h1>

      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 space-y-4 leading-relaxed">
        <p>
          SapphireMart is a full-stack e-commerce platform built to demonstrate a complete,
          production-style shopping experience — from browsing and cart management to secure
          checkout, order tracking, and an admin dashboard for managing inventory and sales.
        </p>
        <p>
          The platform is built with a Spring Boot REST API backed by Oracle SQL, a React
          frontend styled with Tailwind CSS, JWT-based authentication with role-based access
          control, and a real Razorpay payment integration for secure online payments.
        </p>
        <p>
          This project was developed by Sarvesh Gonge as a portfolio piece showcasing full-stack
          development skills across backend architecture, database design, frontend engineering,
          and third-party API integration.
        </p>
        <h2 className="text-lg font-bold text-ink pt-2">What we offer</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>A catalog of 500+ products across 11 categories</li>
          <li>Secure account creation and saved address management</li>
          <li>Real-time cart and wishlist functionality</li>
          <li>Secure payments via Razorpay, plus Cash on Delivery</li>
          <li>Order tracking and a full admin sales &amp; profit dashboard</li>
        </ul>
      </div>
    </div>
  );
}
