// Prices in NGN (Paystack works in kobo = NGN * 100)
export const PLANS = {
  FREE: {
    name: "Free",
    contentGenerations: 10,
    careerActions: 5,
    paystackPlanCode: null,
    priceNGN: 0,
  },
  PRO: {
    name: "Pro",
    contentGenerations: Infinity,
    careerActions: Infinity,
    paystackPlanCode: process.env.PAYSTACK_PRO_PLAN_CODE ?? null,
    priceNGN: 28000, // ₦30,000/month — adjust to your market
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function toKobo(naira: number) {
  return naira * 100;
}