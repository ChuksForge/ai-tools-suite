import { createClient } from "@ai-tools-suite/auth/server";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIToolsSuite/1.0)" },
    });

    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, footer, header, aside, .ads, #ads").remove();

    // Extract meaningful content
    const title = $("title").text().trim() ||
      $("h1").first().text().trim();

    const metaDesc = $('meta[name="description"]').attr("content") ?? "";

    // Get main content — try article first, fall back to body
    const mainEl = $("article").length ? $("article") : $("main").length ? $("main") : $("body");
    const paragraphs: string[] = [];

    mainEl.find("p, h1, h2, h3, h4, li").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) paragraphs.push(text);
    });

    const extracted = [title, metaDesc, ...paragraphs]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 8000);

    return NextResponse.json({ text: extracted, title });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}