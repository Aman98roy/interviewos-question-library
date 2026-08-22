# InterviewOS Question Library

Private content repository for the InterviewOS predefined technical, behavioral, HR, and time-management interview library. InterviewOS reads `manifest.json` and `tracks/*.json` through a fine-grained GitHub PAT with read-only Contents access.

## Catalog

- 25 engineering skill tracks plus 1 behavioral/HR track
- 160 questions per track
- Exactly 30 Basic, 40 Intermediate, 60 Advanced, and 30 Scenario questions
- 4,160 questions total
- 10 skills per track (260 subject-specific lesson briefs) covering technical mechanics, workplace evidence, limits, verification, real-world use, and a memory cue
- Relevant code examples for every practical question and responsive decision flows for every scenario/design question

## Commands

```bash
npm run generate
npm run validate
```

`generate` deterministically rebuilds the manifest and track files from the catalog in `scripts/generate.mjs` and the lesson bank in `scripts/lessons.mjs`. `validate` uses only Node.js and rejects malformed files, duplicate prompts or IDs, short/generic answers, missing scenario flows, invalid level mixes, and unsafe file paths.

Each question has a question-specific candidate response plus a separate detailed explanation, production example, verification guidance, and memorable cue. Code examples are attached only when they match the question topic. A subject-matter reviewer should still approve provider-specific cloud behavior, security guidance, code, and cost claims before production publication.

## Publishing

1. Create a private GitHub repository named `interviewos-question-library`.
2. Push this repository to its `main` branch.
3. Create a fine-grained PAT restricted to this repository with **Contents: Read-only**.
4. Configure InterviewOS with the repository owner, repository name, `main` ref, and PAT.
5. Run `npm run validate` as the required pull-request check.
