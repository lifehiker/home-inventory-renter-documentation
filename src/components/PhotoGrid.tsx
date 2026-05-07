"use client";

import { useState } from "react";
import { PhotoModal } from "@/components/PhotoModal";
import { format } from "date-fns";

interface Photo {
  id: string;
  thumbnailUrl: string;
  fullUrl: string;
  timestampCaptured: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  order: number;
}

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function PhotoGrid({ photos, onDeletePhoto, onUpdateNotes }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square bg-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumbnailUrl}
              alt={`Photo taken at ${format(new Date(photo.timestampCaptured), "PPpp")}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Timestamp overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs font-medium leading-tight">
                {format(new Date(photo.timestampCaptured), "MMM d, p")}
              </p>
              {photo.latitude && (
                <p className="text-white/80 text-xs">
                  📍 GPS
                </p>
              )}
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded transition-opacity">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={() => {
            onDeletePhoto(selectedPhoto.id);
            setSelectedPhoto(null);
          }}
          onUpdateNotes={(notes) => {
            onUpdateNotes(selectedPhoto.id, notes);
            setSelectedPhoto({ ...selectedPhoto, notes });
          }}
        />
      )}
    </>
  );
}
