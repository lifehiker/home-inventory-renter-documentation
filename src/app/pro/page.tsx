import { auth } from "@/auth";
import Link from "next/link";
import type { Metadata } from "next";
import { ProUpgradeClient } from "@/components/ProUpgradeClient";

export const metadata: Metadata = {
  title: "Upgrade to Pro — DepositSafe",
  description: "Unlock unlimited properties, rooms, and photos with a one-time $39 payment. No annual fee.",
};

export default async function ProPage() {
  const session = await auth();
  const isPro = session?.user?.proUnlocked ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold text-gray-900">DepositSafe</span>
          </Link>
          {session ? (
            <Link href="/dashboard" className="text-sm text-blue-700 hover:underline">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-blue-700 hover:underline">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {isPro ? (
          <div className="text-center">
            <div className="text-5xl mb-4">★</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You&apos;re already on DepositSafe Pro!
            </h1>
            <p className="text-gray-600 mb-8">
              You have unlimited properties, rooms, and photos. Enjoy!
            </p>
            <Link
              href="/dashboard"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Upgrade to DepositSafe Pro
              </h1>
              <p className="text-xl text-gray-600">
                One payment. Unlimited documentation. No annual renewal.
              </p>
            </div>

            {/* Comparison table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-10">
              <div className="grid grid-cols-3">
                <div className="col-span-1 bg-gray-50 p-6 border-r border-gray-200">
                  <h3 className="font-semibold text-gray-700">Feature</h3>
                </div>
                <div className="col-span-1 p-6 border-r border-gray-200 text-center">
                  <h3 className="font-semibold text-gray-700">Free</h3>
                </div>
                <div className="col-span-1 p-6 text-center bg-blue-50">
                  <h3 className="font-bold text-blue-900">Pro ★</h3>
                </div>
              </div>

              {[
                { feature: "Properties", free: "1", pro: "Unlimited" },
                { feature: "Rooms per property", free: "3", pro: "Unlimited" },
                { feature: "Photos total", free: "30", pro: "Unlimited" },
                { feature: "PDF export", free: "✓ (watermark)", pro: "✓ Clean" },
                { feature: "Tamper-evident badge", free: "–", pro: "✓" },
                { feature: "Shareable links", free: "–", pro: "✓ 30-day" },
                { feature: "Server timestamps", free: "✓", pro: "✓" },
                { feature: "GPS coordinates", free: "✓", pro: "✓" },
                { feature: "Future features", free: "–", pro: "✓ Included" },
              ].map((row) => (
                <div key={row.feature} className="grid grid-cols-3 border-t border-gray-100">
                  <div className="col-span-1 p-4 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-700">
                    {row.feature}
                  </div>
                  <div className="col-span-1 p-4 border-r border-gray-200 text-sm text-gray-600 text-center">
                    {row.free}
                  </div>
                  <div className="col-span-1 p-4 text-sm font-medium text-blue-900 text-center bg-blue-50">
                    {row.pro}
                  </div>
                </div>
              ))}
            </div>

            <ProUpgradeClient isLoggedIn={!!session} />
          </>
        )}
      </div>
    </div>
  );
}
