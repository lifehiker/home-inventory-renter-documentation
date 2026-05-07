import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkPropertyLimit } from "@/lib/tierCheck";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
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

  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await checkPropertyLimit(session.user.id);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "FREE_LIMIT_REACHED",
        upgradeUrl: "/pro",
        current: limit.current,
        limit: limit.limit,
        message: "Free tier allows 1 property. Upgrade to Pro for unlimited properties.",
      },
      { status: 402 }
    );
  }

  const body = await req.json();
  const { address, type, notes } = body;

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const property = await prisma.property.create({
    data: {
      userId: session.user.id,
      address,
      type: type || "APARTMENT",
      notes,
    },
  });

  return NextResponse.json(property, { status: 201 });
}
