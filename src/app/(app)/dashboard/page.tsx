import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const params = await searchParams;

  const properties = await prisma.property.findMany({
    where: { userId: session!.user.id },
    include: {
      rooms: {
        include: {
          _count: { select: { photos: true } },
        },
      },
      _count: { select: { rooms: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const totalPhotos = properties.reduce((acc, p) => {
    return acc + p.rooms.reduce((a, r) => a + r._count.photos, 0);
  }, 0);

  return (
    <div>
      {params.upgraded === "true" && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <span>★</span>
          <span>Welcome to DepositSafe Pro! You now have unlimited properties, rooms, and photos.</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {properties.length} {properties.length === 1 ? "property" : "properties"} · {totalPhotos} photos
          </p>
        </div>
        <Link href="/properties/new">
          <Button>+ Add Property</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No properties yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Add your first property to start documenting rooms and photos for your security deposit protection.
          </p>
          <Link href="/properties/new">
            <Button size="lg">Add Your First Property</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const photoCount = property.rooms.reduce(
              (a, r) => a + r._count.photos,
              0
            );
            return (
              <PropertyCard
                key={property.id}
                id={property.id}
                address={property.address}
                type={property.type}
                roomCount={property._count.rooms}
                photoCount={photoCount}
                updatedAt={property.updatedAt.toISOString()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
