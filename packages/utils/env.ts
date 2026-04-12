const REQUIRED_ENV = {
  shared: [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "DATABASE_URL",
    "OPENROUTER_API_KEY",
    "PAYSTACK_SECRET_KEY",
  ],
} as const;

export function validateEnv(product: "content" | "career") {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV.shared) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}`
    );
  }
}