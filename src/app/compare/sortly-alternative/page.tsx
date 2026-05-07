import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sortly Alternative — Free PDF Export, No Subscription | DepositSafe",
  description:
    "Sortly charges $49/year just to export a PDF. DepositSafe has free PDF export forever, plus GPS timestamps and renter-specific workflows. Compare Sortly vs DepositSafe.",
};

const comparison = [
  { feature: "PDF export", depositsafe: "Always free", sortly: "$49/year (paid tiers only)" },
  { feature: "Pricing", depositsafe: "$0 free / $39 lifetime / $24/year", sortly: "$0 (no export) / $49/year / $99/year" },
  { feature: "GPS timestamps", depositsafe: "Yes — on every photo", sortly: "No" },
  { feature: "Server-verified timestamps", depositsafe: "Yes — tamper-evident", sortly: "No" },
  { feature: "Renter move-in/out workflow", depositsafe: "Yes — built for renters", sortly: "No — general inventory" },
  { feature: "Court-ready PDF format", depositsafe: "Yes", sortly: "No" },
  { feature: "Shareable report links", depositsafe: "Yes (Pro)", sortly: "No" },
  { feature: "Free properties", depositsafe: "1", sortly: "Unlimited (no export)" },
  { feature: "Subscription required for export", depositsafe: "No", sortly: "Yes — $49+/year" },
  { feature: "App download required", depositsafe: "No — works in browser", sortly: "App Store / Google Play" },
];

export default function SortlyAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">DepositSafe</span>
          </Link>
          <Link href="/register" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
            Start Free
          </Link>
        </div>
      </nav>

      <section className="px-6 py-20 text-center bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free Sortly Alternative with No PDF Paywall
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sortly charges $49/year just to export a PDF. DepositSafe exports for free — forever. Plus GPS timestamps and a renter-specific workflow Sortly doesn&apos;t have.
          </p>
          <Link
            href="/register"
            className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 inline-block"
          >
            Try DepositSafe Free
          </Link>
        </div>
      </section>

      {/* Reddit quote */}
      <section className="px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <blockquote className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl p-6">
            <p className="text-lg text-gray-700 italic">
              &ldquo;Sortly works but it&apos;s $49/year just to export a PDF, which feels like a ransom for your own data.&rdquo;
            </p>
            <footer className="text-gray-500 text-sm mt-2">— r/personalfinance</footer>
          </blockquote>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            DepositSafe vs Sortly
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="col-span-1 p-5 bg-gray-50">
                <span className="font-semibold text-gray-700">Feature</span>
              </div>
              <div className="col-span-1 p-5 text-center bg-blue-50">
                <span className="font-bold text-blue-900">DepositSafe</span>
              </div>
              <div className="col-span-1 p-5 text-center">
                <span className="font-semibold text-gray-600">Sortly</span>
              </div>
            </div>
            {comparison.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 border-t border-gray-100">
                <div className="col-span-1 p-4 bg-gray-50 border-r border-gray-100 text-sm font-medium text-gray-700">
                  {row.feature}
                </div>
                <div className="col-span-1 p-4 border-r border-gray-100 text-sm text-green-800 font-medium text-center bg-blue-50">
                  {row.depositsafe}
                </div>
                <div className="col-span-1 p-4 text-sm text-gray-600 text-center">
                  {row.sortly}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we&apos;re different */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why we built a free Sortly alternative
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Sortly has 1M+ users and strong App Store presence — but it made a decision that generated sustained Reddit backlash: paywalling PDF export behind a $49/year subscription. For users who just want to document their home inventory and export it occasionally, this feels like paying a ransom for their own data.
            </p>
            <p>
              DepositSafe was built specifically for renters who need move-in and move-out documentation. Sortly is a general inventory catalog — it has no concept of &ldquo;security deposit protection&rdquo; or &ldquo;court-ready evidence.&rdquo; We built the workflow that Sortly never will: walk-through documentation with GPS timestamps, organized by room, exported as a structured PDF that looks like something you&apos;d submit as evidence.
            </p>
            <p>
              PDF export is free on DepositSafe forever. You can upgrade to Pro ($39 one-time) for unlimited rooms and photos — but basic documentation and PDF export never requires payment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Switch from Sortly — free, no credit card
          </h2>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
