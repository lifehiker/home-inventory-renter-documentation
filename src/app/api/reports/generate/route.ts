import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, getFileUrl } from "@/lib/storage";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { propertyId } = body;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId: session.user.id },
      include: {
        rooms: {
          include: {
            photos: { orderBy: { order: "asc" } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const isPro = user?.proUnlocked ?? false;

    // Generate PDF using @react-pdf/renderer
    const React = (await import("react")).default;
    const {
      Document,
      Page,
      Text,
      View,
      StyleSheet,
      renderToBuffer,
      Image: PDFImage,
    } = await import("@react-pdf/renderer");

    const styles = StyleSheet.create({
      page: {
        padding: 40,
        fontSize: 11,
        fontFamily: "Helvetica",
        color: "#1a1a1a",
      },
      coverPage: {
        padding: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      title: {
        fontSize: 28,
        fontFamily: "Helvetica-Bold",
        marginBottom: 10,
        textAlign: "center",
      },
      subtitle: {
        fontSize: 14,
        marginBottom: 30,
        textAlign: "center",
        color: "#555",
      },
      coverInfo: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: "center",
      },
      tamperBadge: {
        marginTop: 40,
        padding: 12,
        backgroundColor: "#f0f9ff",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#0ea5e9",
      },
      tamperText: {
        fontSize: 10,
        color: "#0369a1",
        textAlign: "center",
      },
      roomHeader: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        marginBottom: 8,
        marginTop: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#1e40af",
        paddingBottom: 4,
      },
      roomNotes: {
        fontSize: 10,
        color: "#555",
        marginBottom: 12,
        fontStyle: "italic",
      },
      photoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
      },
      photoCell: {
        width: "47%",
        marginBottom: 16,
      },
      photoImage: {
        width: "100%",
        height: 160,
        objectFit: "cover",
        borderRadius: 4,
      },
      photoMeta: {
        marginTop: 4,
        fontSize: 8,
        color: "#555",
      },
      photoNotes: {
        marginTop: 2,
        fontSize: 8,
        fontStyle: "italic",
        color: "#333",
      },
      footer: {
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        color: "#999",
      },
      watermark: {
        fontSize: 8,
        color: "#ccc",
        textAlign: "center",
        marginTop: 4,
      },
      pageNumber: {
        fontSize: 8,
        color: "#999",
      },
    });

    const generatedDate = format(new Date(), "PPpp");

    interface PhotoData {
      id: string;
      r2Key: string;
      thumbnailKey: string;
      timestampCaptured: Date;
      latitude: number | null;
      longitude: number | null;
      notes: string | null;
      order: number;
    }

    interface RoomData {
      id: string;
      name: string;
      notes: string | null;
      photos: PhotoData[];
    }

    const getPhotoUrl = async (key: string) => {
      try {
        return await getFileUrl(key);
      } catch {
        return null;
      }
    };

    // Build photo URLs
    const roomsWithUrls = await Promise.all(
      property.rooms.map(async (room: RoomData) => ({
        ...room,
        photos: await Promise.all(
          room.photos.map(async (photo: PhotoData) => ({
            ...photo,
            url: await getPhotoUrl(photo.r2Key),
          }))
        ),
      }))
    );

    const doc = React.createElement(
      Document,
      null,
      // Cover page
      React.createElement(
        Page,
        { size: "A4", style: styles.coverPage },
        React.createElement(Text, { style: styles.title }, "DepositSafe"),
        React.createElement(
          Text,
          { style: styles.subtitle },
          "Property Documentation Report"
        ),
        React.createElement(
          Text,
          { style: styles.coverInfo },
          `Property: ${property.address}`
        ),
        React.createElement(
          Text,
          { style: styles.coverInfo },
          `Type: ${property.type}`
        ),
        React.createElement(
          Text,
          { style: styles.coverInfo },
          `Generated: ${generatedDate}`
        ),
        React.createElement(
          Text,
          { style: styles.coverInfo },
          `Rooms: ${property.rooms.length} | Photos: ${property.rooms.reduce((acc: number, r: RoomData) => acc + r.photos.length, 0)}`
        ),
        React.createElement(
          View,
          { style: styles.tamperBadge },
          React.createElement(
            Text,
            { style: styles.tamperText },
            "All timestamps are server-verified and cannot be altered after capture"
          ),
          isPro
            ? React.createElement(
                Text,
                { style: { ...styles.tamperText, marginTop: 4, fontFamily: "Helvetica-Bold" } },
                "✓ DepositSafe Pro — Tamper-Evident Report"
              )
            : null
        )
      ),
      // Room pages
      ...roomsWithUrls.map((room: RoomData & { photos: (PhotoData & { url: string | null })[] }) =>
        React.createElement(
          Page,
          { size: "A4", style: styles.page },
          React.createElement(Text, { style: styles.roomHeader }, room.name),
          room.notes
            ? React.createElement(
                Text,
                { style: styles.roomNotes },
                `Condition notes: ${room.notes}`
              )
            : null,
          React.createElement(
            View,
            { style: styles.photoGrid },
            ...room.photos.map((photo: PhotoData & { url: string | null }) =>
              React.createElement(
                View,
                { key: photo.id, style: styles.photoCell },
                photo.url
                  ? React.createElement(PDFImage, {
                      src: photo.url,
                      style: styles.photoImage,
                    })
                  : React.createElement(
                      View,
                      {
                        style: {
                          ...styles.photoImage,
                          backgroundColor: "#f0f0f0",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      },
                      React.createElement(
                        Text,
                        { style: { fontSize: 10, color: "#999" } },
                        "[Photo]"
                      )
                    ),
                React.createElement(
                  Text,
                  { style: styles.photoMeta },
                  `Captured: ${format(new Date(photo.timestampCaptured), "PPpp")}`
                ),
                photo.latitude && photo.longitude
                  ? React.createElement(
                      Text,
                      { style: styles.photoMeta },
                      `GPS: ${photo.latitude.toFixed(6)}°, ${photo.longitude.toFixed(6)}°`
                    )
                  : React.createElement(
                      Text,
                      { style: styles.photoMeta },
                      "GPS: Not available"
                    ),
                photo.notes
                  ? React.createElement(
                      Text,
                      { style: styles.photoNotes },
                      `Note: ${photo.notes}`
                    )
                  : null
              )
            )
          ),
          React.createElement(
            View,
            { style: styles.footer },
            React.createElement(
              Text,
              null,
              `Generated by DepositSafe · ${generatedDate}`
            ),
            isPro
              ? React.createElement(Text, null, "✓ Pro — Tamper-Evident")
              : React.createElement(
                  Text,
                  { style: styles.watermark },
                  "Generated with DepositSafe Free"
                ),
            React.createElement(
              Text,
              { render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
                  `Page ${pageNumber} of ${totalPages}` },
              null
            )
          )
        )
      )
    );

    const pdfBuffer = await renderToBuffer(doc);

    // Upload PDF to storage
    const pdfKey = `reports/${session.user.id}/${propertyId}/${Date.now()}.pdf`;
    await uploadFile(pdfKey, pdfBuffer as Buffer, "application/pdf");

    // Create report record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const report = await prisma.report.create({
      data: {
        propertyId,
        pdfR2Key: pdfKey,
        expiresAt,
      },
    });

    const downloadUrl = await getFileUrl(pdfKey);

    return NextResponse.json({
      reportId: report.id,
      shareSlug: report.shareSlug,
      downloadUrl,
      pdfKey,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
