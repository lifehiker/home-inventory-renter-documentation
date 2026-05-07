"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Report {
  reportId: string;
  shareSlug: string;
  downloadUrl: string;
}

export default function ReportPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);

  const [propertyAddress, setPropertyAddress] = useState("Your Property");

  useEffect(() => {
    fetch(`/api/properties/${propertyId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.address) setPropertyAddress(d.address);
      })
      .catch(() => {});
  }, [propertyId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate report.");
        return;
      }

      setReport(data);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    setError("");

    try {
      const res = await fetch("/api/reports/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setShowUpgrade(true);
          return;
        }
        setError(data.error || "Failed to create share link.");
        return;
      }

      setShareUrl(data.shareUrl);
    } catch {
      setError("Failed to create share link.");
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/properties/${propertyId}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Property
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Report</h1>
      <p className="text-gray-500 mb-8">
        Create a PDF documentation report for <strong>{propertyAddress}</strong>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Generate PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PDF Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Generate a room-by-room PDF with all photos, GPS coordinates, and server-verified timestamps.
              Perfect for sending to your landlord or keeping for your records.
            </p>
            {!report ? (
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? "Generating PDF..." : "Generate PDF Report"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  ✓ Report generated successfully
                </div>
                <div className="flex gap-3">
                  <a
                    href={report.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button>Download PDF</Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={generating}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shareable Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a read-only link to share your documentation with your landlord, insurer, or lawyer.
              Valid for 30 days.
            </p>
            {!shareUrl ? (
              <Button variant="outline" onClick={handleShare} disabled={sharing}>
                {sharing ? "Creating link..." : "Create Share Link"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                  <code className="text-sm text-gray-700 flex-1 truncate">{shareUrl}</code>
                  <Button size="sm" onClick={handleCopy} variant="outline">
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This link expires in 30 days and does not require the recipient to create an account.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="Shareable report links are a Pro feature."
      />
    </div>
  );
}
