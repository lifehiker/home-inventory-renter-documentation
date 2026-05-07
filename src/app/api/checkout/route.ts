import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { priceId, annual } = body;

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const selectedPriceId = annual
      ? process.env.STRIPE_ANNUAL_PRICE_ID
      : (priceId || process.env.STRIPE_PRO_PRICE_ID);

    if (!selectedPriceId) {
      return NextResponse.json(
        { error: "Price ID not configured" },
        { status: 503 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: annual ? "subscription" : "payment",
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/pro`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
