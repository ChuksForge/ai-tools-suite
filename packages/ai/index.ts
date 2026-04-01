// Workflows — these are the public API of this package
export { runContentWorkflow } from "./workflows/content-workflow";
export { runResumeWorkflow, runCoverLetterWorkflow, runJobMatchWorkflow } from "./workflows/resume-workflow";

// Types
export type { AIResponse, StreamChunk, AIRequest } from "./types";

// Validators (apps can reuse these for form validation)
export {
  ContentInputSchema,
  ResumeInputSchema,
  CoverLetterInputSchema,
  JobMatchInputSchema,
} from "./utils/validators";

export type {
  ContentInput,
  ResumeInput,
  CoverLetterInput,
  JobMatchInput,
} from "./utils/validators";

// Models
export { MODELS } from "./providers/models";