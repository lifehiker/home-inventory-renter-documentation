import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PropertyDetail } from "@/components/PropertyDetail";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      rooms: {
        include: {
          _count: { select: { photos: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const totalPhotos = property.rooms.reduce((a, r) => a + r._count.photos, 0);

  return (
    <PropertyDetail
      propertyId={property.id}
      address={property.address}
      type={property.type}
      notes={property.notes || ""}
      rooms={property.rooms.map((r) => ({
        id: r.id,
        name: r.name,
        notes: r.notes || "",
        order: r.order,
        photoCount: r._count.photos,
      }))}
      totalPhotos={totalPhotos}
      isPro={session!.user.proUnlocked}
    />
  );
}
