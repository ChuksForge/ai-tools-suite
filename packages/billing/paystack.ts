const PAYSTACK_BASE = "https://api.paystack.co";

function paystackHeaders() {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not set");
  }
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function initializeTransaction(params: {
  email: string;
  amount: number; // in kobo (multiply NGN by 100)
  reference?: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference ?? `ref_${Date.now()}`,
      callback_url: params.callbackUrl,
      metadata: params.metadata ?? {},
    }),
  });

  const data = await res.json() as {
    status: boolean;
    message: string;
    data: { authorization_url: string; access_code: string; reference: string };
  };

  if (!data.status) throw new Error(`Paystack error: ${data.message}`);
  return data.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: paystackHeaders(),
  });

  const data = await res.json() as {
    status: boolean;
    message: string;
    data: {
      status: string; // "success" | "failed" | "abandoned"
      reference: string;
      amount: number;
      metadata: Record<string, any>;
      customer: { email: string };
    };
  };

  if (!data.status) throw new Error(`Paystack verify error: ${data.message}`);
  return data.data;
}

export async function createSubscriptionPlan(params: {
  name: string;
  amount: number; // kobo
  interval: "monthly" | "annually";
}) {
  const res = await fetch(`${PAYSTACK_BASE}/plan`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      name: params.name,
      amount: params.amount,
      interval: params.interval,
    }),
  });

  const data = await res.json() as {
    status: boolean;
    message: string;
    data: { plan_code: string; name: string; amount: number };
  };

  if (!data.status) throw new Error(`Paystack plan error: ${data.message}`);
  return data.data;
}