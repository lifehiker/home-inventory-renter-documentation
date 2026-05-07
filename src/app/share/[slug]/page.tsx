import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getThumbnailUrl } from "@/lib/storage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = await prisma.report.findUnique({
    where: { shareSlug: slug },
    include: { property: true },
  });
  if (!report) return { title: "Report not found" };
  return {
    title: `${report.property.address} — DepositSafe Report`,
    description: "Room-by-room property documentation with GPS-verified timestamps.",
  };
}

export default async function SharePage({ params }: Props) {
  const { slug } = await params;

  const report = await prisma.report.findUnique({
    where: { shareSlug: slug },
    include: {
      property: {
        include: {
          rooms: {
            include: {
              photos: { orderBy: { order: "asc" } },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!report) {
    notFound();
  }

  // Check expiry
  if (report.expiresAt && report.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Expired</h1>
          <p className="text-gray-600 mb-6">
            This shared report link has expired. Please request a new link from the property owner.
          </p>
          <Link
            href="/"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block"
          >
            Go to DepositSafe
          </Link>
        </div>
      </div>
    );
  }

  const property = report.property;

  // Build photo URLs
  const roomsWithUrls = await Promise.all(
    property.rooms.map(async (room) => ({
      ...room,
      photos: await Promise.all(
        room.photos.map(async (photo) => ({
          ...photo,
          thumbnailUrl: await getThumbnailUrl(photo.thumbnailKey),
        }))
      ),
    }))
  );

  const totalPhotos = roomsWithUrls.reduce((a, r) => a + r.photos.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold text-gray-900">DepositSafe</span>
          </Link>
          <span className="text-sm text-gray-500">Shared Report (Read-only)</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Report header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {property.address}
              </h1>
              <p className="text-gray-500">
                {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <p className="text-xs text-blue-700 font-medium">Server-Verified Timestamps</p>
                <p className="text-xs text-blue-600">All timestamps are tamper-evident</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">{property.rooms.length}</span> rooms
            </div>
            <div>
              <span className="font-medium">{totalPhotos}</span> photos
            </div>
            <div>
              Generated: {format(report.generatedAt, "PPP")}
            </div>
            {report.expiresAt && (
              <div>
                Expires: {format(report.expiresAt, "PPP")}
              </div>
            )}
          </div>
        </div>

        {/* Rooms */}
        {roomsWithUrls.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h2>
            {room.notes && (
              <p className="text-gray-600 text-sm mb-4 italic">
                Condition notes: {room.notes}
              </p>
            )}
            {room.photos.length === 0 ? (
              <p className="text-gray-400 text-sm">No photos in this room.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.photos.map((photo) => (
                  <div key={photo.id} className="rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.thumbnailUrl}
                      alt="Property photo"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-gray-600 bg-white border-t border-gray-100">
                      <p className="font-medium">
                        {format(new Date(photo.timestampCaptured), "MMM d, yyyy")}
                      </p>
                      <p className="text-gray-400">
                        {format(new Date(photo.timestampCaptured), "h:mm a")}
                      </p>
                      {photo.latitude && photo.longitude && (
                        <p className="text-green-700">
                          📍 {photo.latitude.toFixed(4)}°, {photo.longitude.toFixed(4)}°
                        </p>
                      )}
                      {photo.notes && (
                        <p className="text-gray-600 mt-1 italic">{photo.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA */}
        <div className="bg-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Create your own documentation
          </h2>
          <p className="text-blue-100 mb-6">
            Protect your security deposit with GPS-timestamped photo documentation. Free to start.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Start Free — No Credit Card
          </Link>
        </div>
      </div>
    </div>
  );
}
