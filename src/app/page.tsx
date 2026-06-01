import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DepositSafe — Free Home Inventory App, No PDF Paywall",
  description:
    "Document your rental property with GPS-timestamped photos. Free PDF export forever — no $49/year paywall like Sortly. Room-by-room documentation for security deposit disputes.",
};

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">DepositSafe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Free PDF Export — No Subscription Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Free Home Inventory &amp; Move-Out Documentation App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Document your rental property room-by-room with GPS-timestamped photos. Generate a court-ready PDF in minutes.
            No $49/year paywall. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Start Documenting Free
            </Link>
            <Link
              href="/renter"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-400 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required · Free tier: 1 property, 3 rooms, 30 photos
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to protect your deposit
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">GPS Timestamps</h3>
              <p className="text-gray-600">
                Every photo gets a server-verified timestamp and GPS coordinates. Cannot be altered after capture — perfect for court evidence.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Free PDF Export</h3>
              <p className="text-gray-600">
                Generate a room-by-room PDF report instantly. No paywall, no subscription. Share directly with your landlord or insurer.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Court-Ready Evidence</h3>
              <p className="text-gray-600">
                Structured documentation with room labels, condition notes, and tamper-evident timestamps that stand up in small claims court.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Document your rental in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Property</h3>
              <p className="text-gray-600 text-sm">Add your property address and type. Takes 30 seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Capture Photos</h3>
              <p className="text-gray-600 text-sm">Walk room-by-room. Tap to capture with your phone camera. GPS tags automatically.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Export PDF</h3>
              <p className="text-gray-600 text-sm">Generate your court-ready PDF report. Share with landlord or save for your records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What renters say
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 mb-4 italic">
                &ldquo;My landlord lost in small claims because I had a PDF report with timestamped, room-labeled photos. I made it myself in Google Docs but it took 3 hours. Wish I had this app.&rdquo;
              </p>
              <p className="text-sm text-gray-500">— u/throwaway_renting, r/renting</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 mb-4 italic">
                &ldquo;I wish there was an app that would lock in GPS coordinates and timestamp and make it tamper-evident. Something you could literally show a judge.&rdquo;
              </p>
              <p className="text-sm text-gray-500">— r/legaladvice user</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 mb-4 italic">
                &ldquo;Sortly works but it&apos;s $49/year just to export a PDF, which feels like a ransom for your own data.&rdquo;
              </p>
              <p className="text-sm text-gray-500">— r/personalfinance user</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 mb-4 italic">
                &ldquo;Is there an app that organizes move-in photos by room automatically? I would pay for that.&rdquo;
              </p>
              <p className="text-sm text-gray-500">— r/renting user</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Start documenting your property today
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Free forever. No credit card. No $49/year paywall. Just protection for your deposit.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="font-bold text-gray-900">DepositSafe</span>
              </div>
              <p className="text-sm text-gray-500">
                GPS-timestamped property documentation for renters.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/register" className="hover:text-gray-900">Get Started</Link></li>
                <li><Link href="/pro" className="hover:text-gray-900">Upgrade to Pro</Link></li>
                <li><Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/renter" className="hover:text-gray-900">Move-Out Guide</Link></li>
                <li><Link href="/move-in-checklist" className="hover:text-gray-900">Move-In Checklist</Link></li>
                <li><Link href="/blog/how-to-win-security-deposit-dispute" className="hover:text-gray-900">Win Deposit Disputes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compare</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/compare/sortly-alternative" className="hover:text-gray-900">vs Sortly</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
            <p>© 2026 DepositSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
