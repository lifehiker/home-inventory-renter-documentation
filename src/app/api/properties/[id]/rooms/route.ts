import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRoomLimit } from "@/lib/tierCheck";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: propertyId } = await params;

  const property = await prisma.property.findFirst({
    where: { id: propertyId, userId: session.user.id },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const rooms = await prisma.room.findMany({
    where: { propertyId },
    include: {
      _count: { select: { photos: true } },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(rooms);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: propertyId } = await params;

  const property = await prisma.property.findFirst({
    where: { id: propertyId, userId: session.user.id },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const limit = await checkRoomLimit(session.user.id, propertyId);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "FREE_LIMIT_REACHED",
        upgradeUrl: "/pro",
        current: limit.current,
        limit: limit.limit,
        message: "Free tier allows 3 rooms per property. Upgrade to Pro for unlimited rooms.",
      },
      { status: 402 }
    );
  }

  const body = await req.json();
  const { name, type, notes } = body;

  if (!name) {
    return NextResponse.json({ error: "Room name is required" }, { status: 400 });
  }

  const lastRoom = await prisma.room.findFirst({
    where: { propertyId },
    orderBy: { order: "desc" },
  });

  const room = await prisma.room.create({
    data: {
      propertyId,
      name,
      type,
      notes,
      order: (lastRoom?.order ?? -1) + 1,
    },
  });

  // Update property updatedAt
  await prisma.property.update({
    where: { id: propertyId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(room, { status: 201 });
}
