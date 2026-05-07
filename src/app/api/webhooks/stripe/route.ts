import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendProConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "customer.subscription.updated"
    ) {
      const session = event.data.object as {
        client_reference_id?: string;
        metadata?: { userId?: string };
        customer_email?: string;
      };

      const userId =
        session.client_reference_id || session.metadata?.userId;

      if (userId) {
        const user = await prisma.user.update({
          where: { id: userId },
          data: { proUnlocked: true },
        });

        if (user.email) {
          sendProConfirmationEmail(user.email).catch(console.error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
