"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Photo {
  id: string;
  fullUrl: string;
  thumbnailUrl: string;
  timestampCaptured: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
}

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onDelete: () => void;
  onUpdateNotes: (notes: string) => void;
}

export function PhotoModal({
  photo,
  onClose,
  onDelete,
  onUpdateNotes,
}: PhotoModalProps) {
  const [notes, setNotes] = useState(photo.notes);
  const [savingNotes, setSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await onUpdateNotes(notes);
    setSavingNotes(false);
  };

  const handleDelete = () => {
    if (confirm("Delete this photo? This cannot be undone.")) {
      onDelete();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Photo Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo */}
          <div className="rounded-xl overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.fullUrl}
              alt="Property photo"
              className="w-full max-h-96 object-contain"
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1 font-medium uppercase tracking-wide">
                Timestamp
              </p>
              <p className="text-gray-900 font-medium">
                {format(new Date(photo.timestampCaptured), "PPP")}
              </p>
              <p className="text-gray-700">
                {format(new Date(photo.timestampCaptured), "p")}
              </p>
              <p className="text-xs text-green-700 mt-1">
                ✓ Server-verified
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1 font-medium uppercase tracking-wide">
                GPS Location
              </p>
              {photo.latitude && photo.longitude ? (
                <>
                  <p className="text-gray-900 font-medium">
                    {photo.latitude.toFixed(6)}°
                  </p>
                  <p className="text-gray-700">
                    {photo.longitude.toFixed(6)}°
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${photo.latitude},${photo.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 block"
                  >
                    View on map ↗
                  </a>
                </>
              ) : (
                <p className="text-gray-500">Not available</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Notes
            </label>
            <Textarea
              placeholder="Describe what this photo shows (e.g., 'Pre-existing scuff on west wall, 3 inches from floor')..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Photo
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleSaveNotes} disabled={savingNotes}>
                {savingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
