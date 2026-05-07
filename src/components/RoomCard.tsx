"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  propertyId: string;
  roomId: string;
  name: string;
  photoCount: number;
  onDelete: () => void;
}

export function RoomCard({
  propertyId,
  roomId,
  name,
  photoCount,
  onDelete,
}: RoomCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
      {/* Drag handle */}
      <div className="cursor-grab text-gray-400 hover:text-gray-600 flex-shrink-0 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Room info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">
          {photoCount} {photoCount === 1 ? "photo" : "photos"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={`/properties/${propertyId}/rooms/${roomId}`}>
          <Button size="sm" variant="default">
            Open
          </Button>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
