import { runContentWorkflow } from "../workflows/content-workflow";

const sampleText = `
Consistency is the most underrated skill in building an audience online.
Most people post 10 times, see no results, and quit.
The ones who win are posting for 6 months before they see traction.
The algorithm rewards those who show up. Every single day.
It doesn't matter how good your content is if nobody sees it yet.
Volume builds distribution. Distribution builds trust. Trust builds business.
`;

async function main() {
  console.log("Testing Content Workflow...\n");

  // Test 1 — Twitter (JSON)
  console.log("--- Twitter (Structured JSON) ---");
  const twitterResult = await runContentWorkflow({
    text: sampleText,
    platform: "twitter",
    tone: "professional",
  });
  console.log("Model:", twitterResult.model);
  console.log("Usage:", twitterResult.usage);
  console.log("Output:", JSON.stringify(twitterResult.data, null, 2));

  // Test 2 — LinkedIn (JSON)
  console.log("\n--- LinkedIn (Structured JSON) ---");
  const linkedinResult = await runContentWorkflow({
    text: sampleText,
    platform: "linkedin",
    tone: "casual",
  });
  console.log("Output:", JSON.stringify(linkedinResult.data, null, 2));

  // Test 3 — Twitter (Streaming)
  console.log("\n--- Twitter (Streaming) ---");
  const streamResult = await runContentWorkflow(
    { text: sampleText, platform: "twitter", tone: "witty" },
    { stream: true }
  );

  const stream = streamResult.data as unknown as AsyncIterable<any>;
  process.stdout.write("Stream output: ");
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    process.stdout.write(delta);
  }
  console.log("\n\nAll content tests passed.");
}

main().catch(console.error);