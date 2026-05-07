"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { PhotoCapture } from "@/components/PhotoCapture";
import { PhotoGrid } from "@/components/PhotoGrid";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Photo {
  id: string;
  r2Key: string;
  thumbnailKey: string;
  timestampCaptured: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  order: number;
  thumbnailUrl: string;
  fullUrl: string;
}

interface RoomDetailProps {
  propertyId: string;
  roomId: string;
  roomName: string;
  propertyAddress: string;
  initialNotes: string;
  photos: Photo[];
  isPro: boolean;
}

export function RoomDetail({
  propertyId,
  roomId,
  roomName,
  propertyAddress,
  initialNotes,
  photos: initialPhotos,
  isPro,
}: RoomDetailProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [notes, setNotes] = useState(initialNotes);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesTimer, setNotesTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (notesTimer) clearTimeout(notesTimer);
    const timer = setTimeout(async () => {
      setNotesSaving(true);
      await fetch(`/api/properties/${propertyId}/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: value }),
      });
      setNotesSaving(false);
    }, 1000);
    setNotesTimer(timer);
  };

  const handleUploadComplete = useCallback(async () => {
    // Refetch photos
    const res = await fetch(`/api/properties/${propertyId}/rooms/${roomId}`);
    if (res.ok) {
      const data = await res.json();
      // Build URLs for new photos
      const newPhotos = await Promise.all(
        (data.photos || []).map(async (photo: Photo) => ({
          ...photo,
          timestampCaptured: photo.timestampCaptured,
          thumbnailUrl: `/api/files/${photo.thumbnailKey.replace(/\//g, "_")}`,
          fullUrl: `/api/files/${photo.r2Key.replace(/\//g, "_")}`,
        }))
      );
      setPhotos(newPhotos);
    }
  }, [propertyId, roomId]);

  const handleUpgradeTrigger = useCallback((reason: string) => {
    setUpgradeReason(reason);
    setShowUpgrade(true);
  }, []);

  const handleDeletePhoto = async (photoId: string) => {
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleUpdatePhotoNotes = async (photoId: string, photoNotes: string) => {
    await fetch(`/api/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: photoNotes }),
    });
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, notes: photoNotes } : p))
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-700">
          Dashboard
        </Link>
        <span>›</span>
        <Link href={`/properties/${propertyId}`} className="hover:text-gray-700">
          {propertyAddress}
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{roomName}</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{roomName}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {photos.length} {photos.length === 1 ? "photo" : "photos"}
      </p>

      {/* Room Notes */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Condition Notes
          {notesSaving && (
            <span className="ml-2 text-xs text-gray-400">Saving...</span>
          )}
        </label>
        <Textarea
          placeholder="Describe the condition of this room (e.g., 'Small scuff on west wall, pre-existing. Carpet has light wear near entrance.')..."
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Photo Capture */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Capture Photos</h2>
        <PhotoCapture
          roomId={roomId}
          onUploadComplete={handleUploadComplete}
          onUpgradeTrigger={handleUpgradeTrigger}
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Photos ({photos.length})
          </h2>
          <PhotoGrid
            photos={photos}
            onDeletePhoto={handleDeletePhoto}
            onUpdateNotes={handleUpdatePhotoNotes}
          />
        </div>
      )}

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />
    </div>
  );
}
