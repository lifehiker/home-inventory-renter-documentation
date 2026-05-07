"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface PropertyCardProps {
  id: string;
  address: string;
  type: string;
  roomCount: number;
  photoCount: number;
  updatedAt: string;
}

const typeColors: Record<string, string> = {
  APARTMENT: "bg-blue-100 text-blue-800",
  HOUSE: "bg-green-100 text-green-800",
  CONDO: "bg-purple-100 text-purple-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export function PropertyCard({
  id,
  address,
  type,
  roomCount,
  photoCount,
  updatedAt,
}: PropertyCardProps) {
  const typeLabel = type.charAt(0) + type.slice(1).toLowerCase();
  const colorClass = typeColors[type] || typeColors.OTHER;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{address}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${colorClass}`}>
            {typeLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{roomCount}</div>
            <div className="text-xs text-gray-500">rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{photoCount}</div>
            <div className="text-xs text-gray-500">photos</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2 flex-wrap">
        <Link href={`/properties/${id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full">
            View
          </Button>
        </Link>
        <Link href={`/properties/${id}/report`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Report
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
