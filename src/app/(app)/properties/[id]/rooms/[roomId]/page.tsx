import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RoomDetail } from "@/components/RoomDetail";
import { getThumbnailUrl, getFileUrl } from "@/lib/storage";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const session = await auth();
  const { id: propertyId, roomId } = await params;

  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      propertyId,
      property: { userId: session!.user.id },
    },
    include: {
      photos: { orderBy: { order: "asc" } },
      property: { select: { address: true } },
    },
  });

  if (!room) {
    notFound();
  }

  // Build photo URLs
  const photosWithUrls = await Promise.all(
    room.photos.map(async (photo) => ({
      id: photo.id,
      r2Key: photo.r2Key,
      thumbnailKey: photo.thumbnailKey,
      timestampCaptured: photo.timestampCaptured.toISOString(),
      latitude: photo.latitude,
      longitude: photo.longitude,
      notes: photo.notes || "",
      order: photo.order,
      thumbnailUrl: await getThumbnailUrl(photo.thumbnailKey),
      fullUrl: await getFileUrl(photo.r2Key),
    }))
  );

  return (
    <RoomDetail
      propertyId={propertyId}
      roomId={roomId}
      roomName={room.name}
      propertyAddress={room.property.address}
      initialNotes={room.notes || ""}
      photos={photosWithUrls}
      isPro={session!.user.proUnlocked}
    />
  );
}
