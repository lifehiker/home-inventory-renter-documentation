import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkPhotoLimit } from "@/lib/tierCheck";
import { uploadFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const roomId = formData.get("roomId") as string | null;
    const latitude = formData.get("latitude") as string | null;
    const longitude = formData.get("longitude") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!file || !roomId) {
      return NextResponse.json(
        { error: "file and roomId are required" },
        { status: 400 }
      );
    }

    // Verify room belongs to user
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: { userId: session.user.id },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check photo limit
    const limit = await checkPhotoLimit(session.user.id);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "FREE_LIMIT_REACHED",
          upgradeUrl: "/pro",
          current: limit.current,
          limit: limit.limit,
          message: "Free tier allows 30 photos. Upgrade to Pro for unlimited photos.",
        },
        { status: 402 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer) as Buffer;
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const r2Key = `photos/${session.user.id}/${roomId}/${timestamp}.${ext}`;
    const thumbnailKey = `thumbnails/${session.user.id}/${roomId}/${timestamp}.${ext}`;

    // Process with sharp if available, otherwise use original
    let thumbnailBuffer: Buffer = buffer;
    let mainBuffer: Buffer = buffer;

    try {
      const sharp = (await import("sharp")).default;
      const mainResult = await sharp(buffer)
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      const thumbResult = await sharp(buffer)
        .resize(400, 400, { fit: "cover" })
        .jpeg({ quality: 75 })
        .toBuffer();
      mainBuffer = Buffer.from(mainResult) as Buffer;
      thumbnailBuffer = Buffer.from(thumbResult) as Buffer;
    } catch {
      // sharp not available, use original
    }

    await uploadFile(r2Key, mainBuffer, file.type || "image/jpeg");
    await uploadFile(thumbnailKey, thumbnailBuffer, "image/jpeg");

    // Get last photo order
    const lastPhoto = await prisma.photo.findFirst({
      where: { roomId },
      orderBy: { order: "desc" },
    });

    const photo = await prisma.photo.create({
      data: {
        roomId,
        r2Key,
        thumbnailKey,
        timestampCaptured: new Date(), // Server-side timestamp
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        notes: notes || null,
        order: (lastPhoto?.order ?? -1) + 1,
      },
    });

    // Update property updatedAt
    await prisma.property.update({
      where: { id: room.propertyId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
