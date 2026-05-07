import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Win a Security Deposit Dispute (Complete Guide) | DepositSafe",
  description:
    "Step-by-step guide to winning a security deposit dispute. What documentation you need, how small claims court works, and how to create tamper-evident photo evidence.",
};

export default function BlogPostPage() {
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

      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-3">Guide · 8 min read</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            How to Win a Security Deposit Dispute: A Complete Guide
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about documenting your rental, understanding your rights, and winning in small claims court.
          </p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">The $40 billion problem renters face</h2>
            <p>
              Security deposits are one of the most common sources of financial disputes between renters and landlords. Estimates suggest American renters collectively lose over $40 billion in security deposits each year to improper deductions — charges for &ldquo;damage&rdquo; that was pre-existing, deductions for normal wear and tear, and landlords who simply don&apos;t return deposits on time.
            </p>
            <p>
              The good news: renters who document properly win a disproportionate share of these disputes. The bad news: most renters document badly — 100+ unorganized photos in a camera roll, no timestamps, no room labels, no structure. Landlords know this and bet on it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">What landlords can and cannot charge for</h2>
            <p>
              Understanding this distinction is the foundation of winning a deposit dispute. In virtually every US state, landlords can only deduct from a security deposit for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Actual damage beyond normal wear and tear</strong> — large holes in walls, broken fixtures, deep stains that require professional cleaning or replacement</li>
              <li><strong>Unpaid rent</strong></li>
              <li><strong>Cleaning costs</strong> — but only if the unit was left in materially dirtier condition than it was rented</li>
              <li><strong>Lost keys or remotes</strong></li>
            </ul>
            <p>
              They cannot charge for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Normal wear and tear — minor carpet wear, small nail holes from hanging artwork, faded paint from sunlight</li>
              <li>Pre-existing damage (if you documented it at move-in)</li>
              <li>Painting the unit a neutral color after you leave (in most states)</li>
              <li>Replacing carpet or appliances that are at end of their useful life regardless of your tenancy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">The three elements of winning documentation</h2>
            <p>
              A renter on r/renting described winning a small claims case with a PDF report of timestamped, room-labeled photos. That anecdote captures the three elements that turn photos into evidence:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Timestamp you can prove.</strong> Phone EXIF metadata can be edited. A server-side timestamp — recorded by a server at the moment of upload, not by your phone — cannot be altered after the fact. This is what makes evidence tamper-evident: the timestamp was set by a third-party system, not by you.
              </li>
              <li>
                <strong>GPS location proving you were there.</strong> GPS coordinates attached to a photo prove you were standing at the property when you took it. Combined with a timestamp, this proves you documented the condition of that specific location at that specific moment.
              </li>
              <li>
                <strong>Structure and room labels.</strong> A folder of 200 unnamed photos is nearly useless in court. A PDF organized room-by-room, with each room&apos;s condition notes and labeled photos, is what judges and mediators expect. It tells a story: here is the bathroom as I found it on move-in day. Here it is on move-out day. Compare.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">How to document your rental (move-in and move-out)</h2>
            <p>
              The ideal documentation process takes about 20-30 minutes for a 1-bedroom apartment and creates evidence that is extremely difficult to dispute.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">Step 1: Create a property in a documentation tool</h3>
            <p>
              Before taking a single photo, create a structured record of your property with room labels matching the actual rooms in your unit. Tools like{" "}
              <Link href="/" className="text-blue-700 hover:underline">DepositSafe</Link>{" "}
              let you add rooms from a preset list (Living Room, Kitchen, Bedroom, Bathroom) in under a minute.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">Step 2: Walk every room systematically</h3>
            <p>
              Don&apos;t photograph randomly. Start in one corner of each room and work clockwise. Photograph:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Each wall individually (all four)</li>
              <li>The ceiling</li>
              <li>The floor — especially corners and under furniture</li>
              <li>Windows, blinds, and window frames</li>
              <li>Closets — including floors and shelves</li>
              <li>All appliances (open the oven, dishwasher, refrigerator)</li>
              <li>Under-sink areas</li>
              <li>Tub/shower — close-ups of grout and caulk</li>
            </ul>
            <p>
              For anything you notice as pre-existing damage, take two photos: a wide shot showing the location, and a close-up of the specific damage. Add a note: &ldquo;Pre-existing scuff on baseboard, west wall of living room.&rdquo;
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">Step 3: Allow GPS location access</h3>
            <p>
              When the app prompts you for location access, approve it. This attaches coordinates to every photo, proving you were physically at the property when each photo was taken.
            </p>

            <div className="my-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">Document smarter with DepositSafe</h3>
              <p className="text-blue-800 text-sm mb-4">
                DepositSafe handles the timestamp, GPS, room organization, and PDF generation automatically. Document your entire apartment in 10 minutes and export a court-ready PDF for free.
              </p>
              <Link
                href="/register"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 inline-block text-sm"
              >
                Start Documenting Free
              </Link>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Step 4: Export and send your documentation immediately</h3>
            <p>
              Do this on the same day as your walkthrough. Export a PDF and email it to yourself (creating an email timestamp), email a copy to your landlord, and save a copy to cloud storage. Having multiple timestamped copies of your documentation makes it essentially irrefutable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">How small claims court works for deposit disputes</h2>
            <p>
              Most deposit disputes go to small claims court, which is specifically designed to be accessible without a lawyer. Filing fees are typically $30-100. Most states have dollar limits between $2,500 and $10,000 — more than enough for a security deposit dispute.
            </p>
            <p>
              The process is straightforward:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Send a written demand letter first.</strong> Most states require you to demand the deposit in writing before suing. Send it certified mail to create a paper trail. Many landlords will return the deposit at this point to avoid court.</li>
              <li><strong>File your claim.</strong> Go to your local courthouse, fill out a small claims complaint, and pay the filing fee. You&apos;ll be assigned a hearing date.</li>
              <li><strong>Prepare your evidence packet.</strong> This is where your documentation PDF is critical. Print it out. Organize it by room. Highlight the timestamps and GPS coordinates. Write a 1-page summary of the timeline: move-in date, condition at move-in (referenced to the documentation), move-out date, condition at move-out, what the landlord charged for, and why each charge is improper.</li>
              <li><strong>Attend the hearing.</strong> Small claims hearings are usually 10-15 minutes. Present your evidence calmly and factually. Let the documentation do the talking.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">State-specific deposit laws that matter</h2>
            <p>
              Most states have laws that go beyond basic deposit return requirements:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Deadline to return deposit:</strong> California (21 days), New York (14 days), Texas (30 days), Florida (15-60 days depending on dispute). Missing the deadline often results in automatic forfeiture of the landlord&apos;s right to make deductions.</li>
              <li><strong>Penalty for bad-faith withholding:</strong> Many states allow you to claim 2-3x the withheld amount if the landlord is found to have acted in bad faith. Document the landlord&apos;s communications — if they&apos;re evasive or dishonest, that&apos;s evidence of bad faith.</li>
              <li><strong>Itemized deduction requirement:</strong> Most states require landlords to provide an itemized written statement of deductions. If they don&apos;t, they may forfeit the right to any deductions.</li>
            </ul>
            <p>
              Look up your specific state&apos;s tenant rights laws — the National Housing Law Project and your state&apos;s Attorney General website are good sources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">The documentation checklist</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Photo documentation at move-in AND move-out, both with timestamps and GPS</li>
              <li>Documentation organized by room, not a random camera roll</li>
              <li>Written notes on pre-existing damage at move-in</li>
              <li>Move-in/out walkthrough dates confirmed in writing with landlord</li>
              <li>Written demand letter sent certified mail</li>
              <li>Copies of lease, move-in checklist (if provided by landlord), and any written communications</li>
              <li>PDF report exported and backed up in multiple places</li>
            </ul>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-8">
            <h3 className="font-bold text-gray-900 mb-2">Start your documentation today</h3>
            <p className="text-gray-600 text-sm mb-4">
              Use DepositSafe to create GPS-timestamped documentation for your rental. Free for 1 property, 3 rooms, 30 photos. Upgrade to Pro for unlimited documentation.
            </p>
            <Link href="/register" className="text-blue-700 hover:underline font-semibold text-sm">
              Create free account →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
