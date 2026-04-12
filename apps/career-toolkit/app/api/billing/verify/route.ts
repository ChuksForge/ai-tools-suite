export const runtime = "nodejs";

import { verifyTransaction } from "@ai-tools-suite/billing";
import { updateSubscriptionPlan } from "@ai-tools-suite/db/queries/shared/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference");
    if (!reference) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=no_reference`);

    const transaction = await verifyTransaction(reference);

    if (transaction.status === "success") {
      const userId = transaction.metadata?.userId;
      if (userId) {
        await updateSubscriptionPlan(userId, "pro");
      }
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=payment_failed`);
  } catch (err: any) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=verify_failed`);
  }
}