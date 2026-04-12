export const runtime = "nodejs";

import { createClient } from "@ai-tools-suite/auth/server";
import { initializeTransaction, toKobo, PLANS } from "@ai-tools-suite/billing";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transaction = await initializeTransaction({
      email: user.email!,
      amount: toKobo(PLANS.PRO.priceNGN),
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/billing/verify`,
      metadata: {
        userId: user.id,
        product: "career-toolkit",
        plan: "pro",
      },
    });

    return NextResponse.json({ url: transaction.authorization_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}