"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

export function UpgradeModal({ open, onClose, reason }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>★</span> Upgrade to DepositSafe Pro
          </DialogTitle>
          <DialogDescription>
            {reason || "You've reached a free tier limit."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-amber-900 mb-2">Pro includes:</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>✓ Unlimited properties</li>
              <li>✓ Unlimited rooms per property</li>
              <li>✓ Unlimited photos (free tier: 30)</li>
              <li>✓ Tamper-evident PDF badge</li>
              <li>✓ Shareable report links</li>
              <li>✓ All future features included</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Lifetime — One Time</span>
                <span className="text-2xl font-bold text-gray-900">$39</span>
              </div>
              <p className="text-sm text-gray-500">Pay once, yours forever. No annual renewal.</p>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-blue-900">Annual Plan</span>
                <span className="text-2xl font-bold text-blue-900">$24/yr</span>
              </div>
              <p className="text-sm text-blue-700">Lower upfront cost, same Pro features.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-first">
            Not now
          </Button>
          <Link href="/pro" onClick={onClose} className="flex-1">
            <Button className="w-full">See Upgrade Options</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
