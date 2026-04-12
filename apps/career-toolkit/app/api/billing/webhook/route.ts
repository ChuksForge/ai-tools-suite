export const runtime = "nodejs";

import { verifyTransaction } from "@ai-tools-suite/billing";
import { updateSubscriptionPlan } from "@ai-tools-suite/db/queries/shared/subscription";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const userId = event.data?.metadata?.userId;
      if (userId) {
        await updateSubscriptionPlan(userId, "pro");
      }
    }

    if (event.event === "subscription.disable") {
      const userId = event.data?.metadata?.userId;
      if (userId) {
        await updateSubscriptionPlan(userId, "free");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}