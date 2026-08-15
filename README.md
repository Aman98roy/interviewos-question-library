# InterviewOS Question Library

Private content repository for the InterviewOS predefined technical interview library. InterviewOS reads `manifest.json` and `tracks/*.json` through a fine-grained GitHub PAT with read-only Contents access.

## Catalog

- 25 engineering skill tracks
- 80 questions per track
- Exactly 15 Basic, 20 Intermediate, 30 Advanced, and 15 Scenario questions
- 2,000 questions total
- 125 subject-specific lesson briefs covering the core mechanics, limits, failure modes, verification, real-world use, and a memory cue
- Relevant code examples for every practical question and responsive decision flows for every scenario/design question

## Commands

```bash
npm run generate
npm run validate
```

`generate` deterministically rebuilds the manifest and track files from the catalog in `scripts/generate.mjs` and the technical lesson bank in `scripts/lessons.mjs`. `validate` uses only Node.js and rejects malformed files, duplicate prompts or IDs, short/generic answers, missing scenario flows, invalid level mixes, and unsafe file paths.

Each question has a question-specific candidate response plus a separate detailed explanation, production example, verification guidance, and memorable cue. Code examples are attached only when they match the question topic. A subject-matter reviewer should still approve provider-specific cloud behavior, security guidance, code, and cost claims before production publication.

## Publishing

1. Create a private GitHub repository named `interviewos-question-library`.
2. Push this repository to its `main` branch.
3. Create a fine-grained PAT restricted to this repository with **Contents: Read-only**.
4. Configure InterviewOS with the repository owner, repository name, `main` ref, and PAT.
5. Run `npm run validate` as the required pull-request check.
