export const PLANS = {
  FREE: {
    name: "Free",
    monthlyGenerations: 10,
    priceId: null,
    price: 0,
  },
  PRO: {
    name: "Pro",
    monthlyGenerations: Infinity,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    price: 19,
  },
} as const;

export type PlanKey = keyof typeof PLANS;