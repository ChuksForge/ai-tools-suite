import { createClient } from "@ai-tools-suite/auth/server";
import { runContentWorkflow } from "@ai-tools-suite/ai";
import { checkUsageLimit } from "@ai-tools-suite/billing";
import { createContentJob, updateContentJob } from "@ai-tools-suite/db/queries/content/jobs";
import { upsertUser } from "@ai-tools-suite/db/queries/shared/user";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../../../lib/rate-limit";
import { z } from "zod";

const GenerateSchema = z.object({
  text: z.string().min(50, "Input too short").max(10000, "Input too long"),
  platform: z.enum(["twitter", "linkedin", "newsletter", "tiktok", "instagram", "blog"]),
  tone: z.enum(["professional", "casual", "witty"]).default("professional"),
  stream: z.boolean().default(false),
});

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export const runtime = "nodejs";
export const maxDuration = 60; // tell Next.js to allow up to 60s

export async function POST(req: NextRequest) {
  try {
    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure user exists in DB
  await upsertUser(user.id, user.email!);

    // Usage check
    const usage = await checkUsageLimit(user.id);
    if (!usage.allowed) {
      return NextResponse.json({
        error: "Monthly limit reached",
        usage,
      }, { status: 429 });
    }

    const rateCheck = checkRateLimit(`generate:${user.id}`, 20, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = GenerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    const { text, platform, tone, stream } = parsed.data;
    

    // Create job record
    const job = await createContentJob(user.id, text, platform);

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const result = await runContentWorkflow(
              { text, platform, tone },
              { stream: true }
            );

            const aiStream = result.data as unknown as AsyncIterable<any>;
            for await (const chunk of aiStream) {
              const delta = chunk.choices[0]?.delta?.content ?? "";
              controller.enqueue(encoder.encode(delta));
            }
            controller.close();
          } catch (err) {
            await updateContentJob(job.id, {}, "failed");
            controller.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Job-Id": job.id,
        },
      });
    }

    // Structured JSON response
    const result = await withTimeout(
      runContentWorkflow({ text, platform, tone }),
      55000
    );

    console.log("AI result received, updating job:", job.id);

    try {
      await updateContentJob(job.id, result.data as unknown as object, "complete");
      console.log("Job updated successfully:", job.id);
    } catch (updateErr) {
      console.error("Failed to update job status:", updateErr);
    }

    return NextResponse.json({
      jobId: job.id,
      output: result.data,
      usage: result.usage,
      usageStats: { ...usage, used: usage.used + 1 },
    });

  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}