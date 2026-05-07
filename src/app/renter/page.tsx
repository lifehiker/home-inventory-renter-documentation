import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Move-Out Documentation App — GPS Photos & Free PDF Export | DepositSafe",
  description:
    "Document your move-out in 10 minutes. Room-by-room photos with GPS timestamps, free PDF export — no $49/year paywall. Start free today.",
};

export default function RenterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">DepositSafe</span>
          </Link>
          <Link
            href="/register"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 bg-gradient-to-b from-green-50 to-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Move-Out Documentation App with GPS Timestamps
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Document your entire rental in 10 minutes. Walk room-by-room, capture photos with GPS coordinates, export a court-ready PDF. Free forever.
          </p>
          <Link
            href="/register"
            className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors inline-block"
          >
            Start Documenting Free
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card · Free: 1 property, 3 rooms, 30 photos</p>
        </div>
      </section>

      {/* 3-step workflow */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Document your move-out in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create your property",
                desc: "Add your address and property type. Takes 30 seconds. One property free, no credit card needed.",
                icon: "🏠",
              },
              {
                step: "2",
                title: "Capture room-by-room photos",
                desc: "Walk each room. Tap to shoot with your phone camera. GPS coordinates attach automatically. Add notes for pre-existing damage.",
                icon: "📸",
              },
              {
                step: "3",
                title: "Export PDF report",
                desc: "Generate a structured PDF with room labels, timestamps, GPS coordinates, and notes. Share directly with your landlord.",
                icon: "📄",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success story */}
      <section className="px-6 py-16 bg-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Real renters win deposit disputes with documentation
          </h2>
          <blockquote className="bg-white rounded-2xl p-8 border border-green-200">
            <p className="text-xl text-gray-700 italic mb-4">
              &ldquo;My landlord lost in small claims because I had a PDF report with timestamped, room-labeled photos. I made it myself in Google Docs but it took 3 hours.&rdquo;
            </p>
            <footer className="text-gray-500">— u/throwaway_renting, r/renting</footer>
          </blockquote>
          <p className="text-gray-600 mt-6">
            DepositSafe does in 10 minutes what took this renter 3 hours — and your report is structured, court-ready, and GPS-verified.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for renter move-out documentation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Server-Verified Timestamps",
                desc: "Timestamps are set by our server at the moment of upload — not by your phone clock. Cannot be altered after the fact. Judges accept server-verified timestamps as tamper-evident.",
              },
              {
                title: "GPS Coordinates on Every Photo",
                desc: "We request your location once per session. Every photo gets latitude and longitude attached — showing exactly where you were standing when you documented the damage.",
              },
              {
                title: "Room-by-Room Organization",
                desc: "Photos are organized by room, not dumped in a camera roll. Your PDF is structured by room with condition notes and a photo grid — the format lawyers and judges expect.",
              },
              {
                title: "Free PDF Export, Always",
                desc: "No $49/year paywall like Sortly. Export your full documentation as a PDF at any time, forever, on the free tier. Pay once ($39) for unlimited rooms and photos.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Start your move-out documentation today
          </h2>
          <p className="text-blue-100 mb-8">
            Free, no credit card, no app download. Works on your phone browser right now.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
