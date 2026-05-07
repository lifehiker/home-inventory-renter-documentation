"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProUpgradeClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"lifetime" | "annual" | null>(null);
  const [error, setError] = useState("");

  const handleCheckout = async (annual: boolean) => {
    if (!isLoggedIn) {
      router.push("/register");
      return;
    }

    setLoading(annual ? "annual" : "lifetime");
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annual }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(
          data.error === "Stripe not configured"
            ? "Payment is not yet configured. Please contact us."
            : data.error || "Failed to start checkout."
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Lifetime */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-1">Lifetime</h3>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            $39
          </div>
          <p className="text-gray-500 text-sm mb-6">One-time payment. Yours forever.</p>
          <Button
            className="w-full"
            onClick={() => handleCheckout(false)}
            disabled={loading !== null}
          >
            {loading === "lifetime" ? "Redirecting..." : "Unlock Pro — $39"}
          </Button>
        </div>

        {/* Annual */}
        <div className="bg-blue-700 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-xl mb-1">Annual</h3>
          <div className="text-4xl font-bold mb-1">
            $24<span className="text-xl font-normal">/year</span>
          </div>
          <p className="text-blue-200 text-sm mb-6">Lower upfront. Same features. Auto-renews.</p>
          <Button
            className="w-full bg-white text-blue-700 hover:bg-blue-50"
            onClick={() => handleCheckout(true)}
            disabled={loading !== null}
          >
            {loading === "annual" ? "Redirecting..." : "Start Annual — $24/yr"}
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Secure checkout via Stripe. {" "}
        {!isLoggedIn && (
          <>
            <Link href="/register" className="text-blue-700 hover:underline">
              Create a free account
            </Link>{" "}
            first to upgrade.
          </>
        )}
      </p>
    </div>
  );
}
