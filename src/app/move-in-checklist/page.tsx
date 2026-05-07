import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Move-In Photo Checklist App with GPS Timestamps | DepositSafe",
  description:
    "Document your move-in condition with room-by-room photos and GPS timestamps. Free PDF export. Never lose a security deposit dispute again.",
};

const CHECKLIST_ROOMS = [
  {
    room: "Living Room",
    items: ["Walls (all four)", "Ceiling", "Floors/carpet", "Windows and blinds", "Light fixtures", "Outlets and switches", "Door and frame"],
  },
  {
    room: "Kitchen",
    items: ["Countertops", "Cabinets (inside and out)", "Appliances (stove, fridge, dishwasher)", "Sink and faucet", "Floors", "Walls", "Light fixtures"],
  },
  {
    room: "Primary Bedroom",
    items: ["Walls", "Ceiling", "Floors/carpet", "Closet doors and interior", "Windows", "Light fixtures"],
  },
  {
    room: "Bathroom",
    items: ["Tub/shower grout and caulk", "Toilet", "Sink and vanity", "Mirror", "Floors", "Walls", "Exhaust fan"],
  },
];

export default function MoveInChecklistPage() {
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

      <section className="px-6 py-20 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Move-In Photo Checklist App with GPS Timestamps
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The only move-in checklist that automatically timestamps and GPS-tags every photo — creating tamper-evident documentation that protects your deposit.
          </p>
          <Link
            href="/register"
            className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 inline-block"
          >
            Start Free Checklist
          </Link>
        </div>
      </section>

      {/* Why photos matter */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why you need photos — not just a paper checklist
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Paper move-in checklists are better than nothing, but they have a critical flaw: your landlord can dispute what you wrote, and you have no visual evidence. A landlord who wants to keep your deposit can simply claim the damage you noted was &ldquo;normal wear and tear&rdquo; versus &ldquo;tenant damage.&rdquo;
            </p>
            <p>
              Photos with server-verified timestamps and GPS coordinates change the equation entirely. GPS shows you were at the property. The server timestamp shows exactly when — before or after move-in. The room label shows which area of the apartment. Together, these three elements create documentation that&apos;s almost impossible to dispute.
            </p>
          </div>
        </div>
      </section>

      {/* Room checklist */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Move-In Photo Checklist by Room
          </h2>
          <div className="space-y-6">
            {CHECKLIST_ROOMS.map((room) => (
              <div key={room.room} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {room.room}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {room.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 border border-gray-300 rounded flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            FAQ: What can landlords legally dispute?
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can my landlord charge me for normal wear and tear?",
                a: "No. In almost every US state, landlords cannot deduct for normal wear and tear from a security deposit. This includes minor carpet wear, small nail holes, and faded paint. They can only deduct for damage beyond normal use. Documentation showing the condition at move-in vs. move-out is your evidence.",
              },
              {
                q: "What if I didn't document at move-in?",
                a: "Document immediately at move-out instead. Courts generally put the burden on the landlord to prove damage was caused by you — but photos at move-out showing the current condition are still valuable. Many renters who documented only move-out still won their cases.",
              },
              {
                q: "What makes a photo legally usable as evidence?",
                a: "A photo is stronger evidence when it has a verifiable timestamp (not editable phone metadata), GPS location proving you were at the property, and context (room label, what the photo shows). DepositSafe provides all three automatically.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Use DepositSafe for your move-in checklist
          </h2>
          <p className="text-blue-100 mb-8">
            GPS-timestamped photos, organized by room, free PDF export. The checklist that actually protects you.
          </p>
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
