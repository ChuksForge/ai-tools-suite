import { stripe } from "@ai-tools-suite/billing";
import { updateSubscriptionPlan } from "@ai-tools-suite/db/queries/shared/subscription";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;
    if (userId) {
      await updateSubscriptionPlan(userId, "pro", session.customer);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as any;
    const userId = sub.metadata?.userId;
    if (userId) {
      await updateSubscriptionPlan(userId, "free");
    }
  }

  return NextResponse.json({ received: true });
}