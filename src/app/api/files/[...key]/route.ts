import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_UPLOAD_DIR = "/tmp/depositsafe-uploads";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const fileName = key.join("_");
  const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = fileName.split(".").pop() || "jpg";
  const contentType =
    ext === "pdf"
      ? "application/pdf"
      : ext === "png"
      ? "image/png"
      : "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
