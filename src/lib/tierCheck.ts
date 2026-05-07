import { prisma } from "@/lib/prisma";

export const FREE_PHOTO_LIMIT = 30;
export const FREE_ROOM_LIMIT = 3;
export const FREE_PROPERTY_LIMIT = 1;

export async function checkPhotoLimit(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.proUnlocked) return { allowed: true, current: 0, limit: Infinity };

  const count = await prisma.photo.count({
    where: { room: { property: { userId } } },
  });
  return {
    allowed: count < FREE_PHOTO_LIMIT,
    current: count,
    limit: FREE_PHOTO_LIMIT,
  };
}

export async function checkRoomLimit(userId: string, propertyId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.proUnlocked) return { allowed: true, current: 0, limit: Infinity };

  const count = await prisma.room.count({ where: { propertyId } });
  return {
    allowed: count < FREE_ROOM_LIMIT,
    current: count,
    limit: FREE_ROOM_LIMIT,
  };
}

export async function checkPropertyLimit(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.proUnlocked) return { allowed: true, current: 0, limit: Infinity };

  const count = await prisma.property.count({ where: { userId } });
  return {
    allowed: count < FREE_PROPERTY_LIMIT,
    current: count,
    limit: FREE_PROPERTY_LIMIT,
  };
}
