"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

interface PhotoCaptureProps {
  roomId: string;
  onUploadComplete: () => void;
  onUpgradeTrigger: (reason: string) => void;
}

export function PhotoCapture({
  roomId,
  onUploadComplete,
  onUpgradeTrigger,
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  const requestGPS = (): Promise<{ lat: number; lng: number } | null> => {
    if (gpsCoords) return Promise.resolve(gpsCoords);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setGpsCoords(coords);
          resolve(coords);
        },
        () => resolve(null),
        { timeout: 10000 }
      );
    });
  };

  const uploadFile = useCallback(
    async (file: File, uploadId: string) => {
      const coords = await requestGPS();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", roomId);
      if (coords) {
        formData.append("latitude", coords.lat.toString());
        formData.append("longitude", coords.lng.toString());
      }

      // Simulate progress
      setUploading((prev) =>
        prev.map((u) =>
          u.id === uploadId ? { ...u, progress: 30 } : u
        )
      );

      try {
        const res = await fetch("/api/photos/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.status === 402) {
          setUploading((prev) => prev.filter((u) => u.id !== uploadId));
          onUpgradeTrigger(
            data.message ||
              "You've reached the free tier photo limit (30 photos). Upgrade to Pro for unlimited photos."
          );
          return;
        }

        if (!res.ok) {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === uploadId
                ? { ...u, status: "error", error: data.error || "Upload failed" }
                : u
            )
          );
          return;
        }

        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: "done", progress: 100 } : u
          )
        );

        // Remove from uploading list after a short delay
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== uploadId));
          onUploadComplete();
        }, 800);
      } catch {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: "error", error: "Upload failed. Please try again." }
              : u
          )
        );
      }
    },
    [roomId, onUploadComplete, onUpgradeTrigger] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );

      if (fileArray.length === 0) return;

      const newUploads: UploadingFile[] = fileArray.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        progress: 5,
        status: "uploading",
      }));

      setUploading((prev) => [...prev, ...newUploads]);

      fileArray.forEach((file, i) => {
        uploadFile(file, newUploads[i].id);
      });
    },
    [uploadFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Camera button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleInputChange}
        aria-label="Take photo"
      />

      {/* Desktop drop zone / Mobile capture */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="text-gray-600 mb-4">
          Take photos with your camera or drag &amp; drop files here
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.removeAttribute("capture");
                inputRef.current.click();
              }
            }}
            variant="outline"
          >
            Choose Photos
          </Button>
          <Button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.setAttribute("capture", "environment");
                inputRef.current.click();
              }
            }}
          >
            Take Photo
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {gpsCoords
            ? `GPS ready: ${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}`
            : "GPS will be requested on first upload"}
        </p>
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((upload) => (
            <div key={upload.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {upload.name}
                </span>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {upload.status === "done"
                    ? "✓ Done"
                    : upload.status === "error"
                    ? "✗ Failed"
                    : "Uploading..."}
                </span>
              </div>
              {upload.status !== "error" && (
                <Progress
                  value={upload.progress}
                  className="h-1.5"
                />
              )}
              {upload.error && (
                <p className="text-xs text-red-600 mt-1">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
