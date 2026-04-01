import { runResumeWorkflow, runCoverLetterWorkflow, runJobMatchWorkflow } from "../workflows/resume-workflow";

const sampleResume = `
John Doe | john@example.com | Lagos, Nigeria

EXPERIENCE
Software Engineer — TechCorp (2021–Present)
- Worked on backend systems
- Built APIs
- Helped with deployments

Junior Developer — StartupXYZ (2019–2021)
- Wrote code
- Fixed bugs
- Attended meetings

EDUCATION
B.Sc Computer Science — University of Lagos (2019)

SKILLS
JavaScript, Python, React, Node.js
`;

const sampleJobDescription = `
We are looking for a Senior Software Engineer to join our platform team.
Requirements:
- 4+ years of experience with Node.js and React
- Experience with distributed systems and microservices
- Strong understanding of REST APIs and GraphQL
- Experience with cloud platforms (AWS/GCP/Azure)
- Strong communication and collaboration skills
`;

async function main() {
  console.log("Testing Resume Workflow...\n");

  // Test 1 — Resume optimization (JSON)
  console.log("--- Resume Optimization (Structured JSON) ---");
  const resumeResult = await runResumeWorkflow({
    resumeText: sampleResume,
    jobDescription: sampleJobDescription,
  });
  console.log("Model:", resumeResult.model);
  console.log("Usage:", resumeResult.usage);
  console.log("Output:", JSON.stringify(resumeResult.data, null, 2));

  // Test 2 — Cover letter (JSON)
  console.log("\n--- Cover Letter (Structured JSON) ---");
  const coverResult = await runCoverLetterWorkflow({
    resumeText: sampleResume,
    jobTitle: "Senior Software Engineer",
    company: "Acme Corp",
    jobDescription: sampleJobDescription,
  });
  console.log("Output:", JSON.stringify(coverResult.data, null, 2));

  // Test 3 — Job match (JSON)
  console.log("\n--- Job Match Analysis (Structured JSON) ---");
  const matchResult = await runJobMatchWorkflow({
    resumeText: sampleResume,
    jobPosting: sampleJobDescription,
  });
  console.log("Output:", JSON.stringify(matchResult.data, null, 2));

  console.log("\nAll resume tests passed.");
}

main().catch(console.error);