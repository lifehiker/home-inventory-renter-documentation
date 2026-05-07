"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RoomCard } from "@/components/RoomCard";
import { UpgradeModal } from "@/components/UpgradeModal";

const PRESET_ROOMS = [
  "Living Room",
  "Kitchen",
  "Primary Bedroom",
  "Bedroom",
  "Bathroom",
  "Bathroom 2",
  "Dining Room",
  "Office",
  "Laundry Room",
  "Garage",
  "Storage",
  "Other",
];

interface Room {
  id: string;
  name: string;
  notes: string;
  order: number;
  photoCount: number;
}

interface PropertyDetailProps {
  propertyId: string;
  address: string;
  type: string;
  notes: string;
  rooms: Room[];
  totalPhotos: number;
  isPro: boolean;
}

export function PropertyDetail({
  propertyId,
  address,
  type,
  notes,
  rooms: initialRooms,
  totalPhotos: initialPhotoCount,
  isPro,
}: PropertyDetailProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [addingRoom, setAddingRoom] = useState(false);
  const [roomError, setRoomError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [deletingProperty, setDeletingProperty] = useState(false);

  const totalPhotos = rooms.reduce((a, r) => a + r.photoCount, 0) || initialPhotoCount;

  const handleAddRoom = async (name: string) => {
    if (!name.trim()) return;
    setAddingRoom(true);
    setRoomError("");

    try {
      const res = await fetch(`/api/properties/${propertyId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setShowUpgrade(true);
        setUpgradeReason(data.message || "You've reached the free tier room limit.");
        setShowAddRoom(false);
        return;
      }

      if (!res.ok) {
        setRoomError(data.error || "Failed to add room.");
        return;
      }

      setRooms((prev) => [
        ...prev,
        { id: data.id, name: data.name, notes: data.notes || "", order: data.order, photoCount: 0 },
      ]);
      setNewRoomName("");
      setShowAddRoom(false);
    } catch {
      setRoomError("Failed to add room.");
    } finally {
      setAddingRoom(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Delete this room and all its photos?")) return;

    await fetch(`/api/properties/${propertyId}/rooms/${roomId}`, {
      method: "DELETE",
    });

    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleDeleteProperty = async () => {
    if (!confirm(`Delete "${address}" and all its rooms and photos? This cannot be undone.`)) return;
    setDeletingProperty(true);
    await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  // Drag-to-reorder
  const handleDragStart = (e: React.DragEvent, roomId: string) => {
    e.dataTransfer.setData("roomId", roomId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOver(targetId);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("roomId");
    if (draggedId === targetId) return;

    const newRooms = [...rooms];
    const fromIdx = newRooms.findIndex((r) => r.id === draggedId);
    const toIdx = newRooms.findIndex((r) => r.id === targetId);
    const [moved] = newRooms.splice(fromIdx, 1);
    newRooms.splice(toIdx, 0, moved);

    // Update orders
    const updated = newRooms.map((r, i) => ({ ...r, order: i }));
    setRooms(updated);
    setDragOver(null);

    // Persist new order
    await Promise.all(
      updated.map((r) =>
        fetch(`/api/properties/${propertyId}/rooms/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: r.order }),
        })
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Dashboard
        </Link>
      </div>

      {/* Property header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{address}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()}
            {notes && ` · ${notes}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/properties/${propertyId}/report`}>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteProperty}
            disabled={deletingProperty}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{rooms.length}</div>
          <div className="text-sm text-gray-500">rooms</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{totalPhotos}</div>
          <div className="text-sm text-gray-500">photos</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            {isPro ? "∞" : "3"}
          </div>
          <div className="text-sm text-gray-500">room limit</div>
        </div>
      </div>

      {/* Rooms */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
        <Button size="sm" onClick={() => setShowAddRoom(true)}>
          + Add Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <p className="text-gray-500 mb-4">No rooms yet. Add rooms to start capturing photos.</p>
          <Button onClick={() => setShowAddRoom(true)}>Add First Room</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              draggable
              onDragStart={(e) => handleDragStart(e, room.id)}
              onDragOver={(e) => handleDragOver(e, room.id)}
              onDrop={(e) => handleDrop(e, room.id)}
              className={dragOver === room.id ? "ring-2 ring-blue-400 rounded-xl" : ""}
            >
              <RoomCard
                propertyId={propertyId}
                roomId={room.id}
                name={room.name}
                photoCount={room.photoCount}
                onDelete={() => handleDeleteRoom(room.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Room Dialog */}
      <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Room</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {roomError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {roomError}
              </div>
            )}
            <div>
              <Input
                placeholder="Custom room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddRoom(newRoomName);
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Or choose a preset:</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_ROOMS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAddRoom(preset)}
                    disabled={addingRoom}
                    className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-800 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRoom(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleAddRoom(newRoomName)}
              disabled={addingRoom || !newRoomName.trim()}
            >
              {addingRoom ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />
    </div>
  );
}
