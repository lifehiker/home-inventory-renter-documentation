import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; roomId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: propertyId, roomId } = await params;

  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      propertyId,
      property: { userId: session.user.id },
    },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; roomId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: propertyId, roomId } = await params;

  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      propertyId,
      property: { userId: session.user.id },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, notes, order } = body;

  const updated = await prisma.room.update({
    where: { id: roomId },
    data: {
      ...(name !== undefined && { name }),
      ...(notes !== undefined && { notes }),
      ...(order !== undefined && { order }),
    },
  });

  await prisma.property.update({
    where: { id: propertyId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; roomId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: propertyId, roomId } = await params;

  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      propertyId,
      property: { userId: session.user.id },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  await prisma.room.delete({ where: { id: roomId } });

  return NextResponse.json({ success: true });
}
