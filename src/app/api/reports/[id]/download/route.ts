import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFileBuffer } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const report = await prisma.report.findFirst({
    where: {
      id,
      property: { userId: session.user.id },
    },
    include: { property: true },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (!report.pdfR2Key) {
    return NextResponse.json({ error: "PDF not yet generated" }, { status: 404 });
  }

  const buffer = await getFileBuffer(report.pdfR2Key);
  if (!buffer) {
    return NextResponse.json({ error: "PDF file not found" }, { status: 404 });
  }

  const filename = `DepositSafe-Report-${report.property.address.replace(/[^a-z0-9]/gi, "-")}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
