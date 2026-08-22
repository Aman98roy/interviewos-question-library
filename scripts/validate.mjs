import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Blueprint rounds per topic, per level. Absolute counts derive from each track's topic list.
const levelRatio = { basic: 3, intermediate: 4, advanced: 6, scenario: 3 };
const questionsPerTopic = Object.values(levelRatio).reduce((sum, count) => sum + count, 0);
const kinds = new Set(['conceptual', 'practical', 'troubleshooting', 'scenario', 'design']);
const manifest = await json('manifest.json');
assert(manifest.schemaVersion === 1, 'Manifest schemaVersion must be 1');
assert(Array.isArray(manifest.categories) && manifest.categories.length > 0, 'Manifest categories are required');
assert(Array.isArray(manifest.tracks) && manifest.tracks.length === 26, 'Manifest must contain 26 tracks');

const categoryIds = unique(manifest.categories.map((item) => required(item.slug, 'category slug')), 'category slugs');
const trackIds = unique(manifest.tracks.map((item) => required(item.slug, 'track slug')), 'track slugs');
const allQuestionIds = new Set();
const allSpokenAnswers = new Set();
const technicalKindHeadings = {
  conceptual: '**How it works:**',
  practical: '**Implementation:**',
  troubleshooting: '**Diagnosis:**',
  scenario: '**Decision:**',
  design: '**Design:**',
};
const careerKindHeadings = {
  conceptual: '**Action — Credibility:**',
  practical: '**Action — Delivery:**',
  troubleshooting: '**Action — Revision:**',
  scenario: '**Action — Judgment:**',
  design: '**Action — Structure:**',
};

for (const summary of manifest.tracks) {
  assert(categoryIds.has(summary.category), `${summary.slug} references an unknown category`);
  assert(new RegExp(`^tracks/${summary.slug}\\.json$`).test(summary.file), `${summary.slug} has an unsafe or mismatched file path`);
  assert(Array.isArray(summary.topics) && summary.topics.length >= 3, `${summary.slug} needs at least three topics`);
  const expectedTotal = summary.topics.length * questionsPerTopic;
  assert(summary.questionCount === expectedTotal, `${summary.slug} questionCount must equal topics × ${questionsPerTopic} (${expectedTotal})`);
  const track = await json(summary.file);
  assert(track.schemaVersion === 1 && track.slug === summary.slug, `${summary.slug} track metadata does not match manifest`);
  assert(Array.isArray(track.questions) && track.questions.length === expectedTotal, `${summary.slug} must contain ${expectedTotal} questions`);
  unique(track.questions.map((question) => required(question.id, `${summary.slug} question id`)), `${summary.slug} question IDs`);
  unique(track.questions.map((question) => question.prompt), `${summary.slug} question prompts`);
  unique(track.questions.map((question) => question.answer.modelAnswer), `${summary.slug} candidate answers`);
  for (const [level, ratio] of Object.entries(levelRatio)) {
    const count = summary.topics.length * ratio;
    const questions = track.questions.filter((question) => question.level === level);
    assert(questions.length === count, `${summary.slug} must contain ${count} ${level} questions`);
    assert(questions.slice(0, summary.topics.length).every((question, index) => question.skillsTested[0] === summary.topics[index]), `${summary.slug} ${level} questions must rotate through every topic before repeating one`);
  }
  for (const question of track.questions) {
    assert(!allQuestionIds.has(question.id), `Duplicate global question ID: ${question.id}`);
    allQuestionIds.add(question.id);
    assert(kinds.has(question.kind), `${question.id} has invalid kind`);
    assert(typeof question.prompt === 'string' && question.prompt.length >= 15, `${question.id} prompt is too short`);
    assert(!/^(Basic|Intermediate|Advanced)(?: scenario| troubleshooting| design)?:/i.test(question.prompt), `${question.id} repeats its level in the prompt`);
    assert(question.prompt.includes('Your answer should '), `${question.id} does not state the expected answer depth`);
    assert(!/Implement a production-safe|has an intermittent .+ problem|Show the smallest useful example.+Show the smallest correct use/i.test(question.prompt), `${question.id} contains a vague or repeated prompt template`);
    assert(Array.isArray(question.skillsTested) && question.skillsTested.length > 0, `${question.id} needs skillsTested`);
    const answer = question.answer;
    assert(answer && typeof answer.spokenAnswer === 'string', `${question.id} needs a spoken candidate answer`);
    const spokenWords = wordCount(answer.spokenAnswer);
    assert(spokenWords >= 300 && spokenWords <= 450, `${question.id} spoken answer must contain 300-450 words; found ${spokenWords}`);
    assert(answer.spokenAnswer.includes(question.skillsTested[0]), `${question.id} spoken answer must mention ${question.skillsTested[0]}`);
    assert(!allSpokenAnswers.has(answer.spokenAnswer), `Duplicate global spoken answer: ${question.id}`);
    allSpokenAnswers.add(answer.spokenAnswer);
    const requiredHeadings = summary.category === 'career'
      ? ['**My answer:**', '**Situation and responsibility:**', careerKindHeadings[question.kind], '**Result:**', '**Reflection:**', '**Follow-up and caveat:**']
      : ['**Direct answer:**', '**Mental model:**', '**Key ideas:**', technicalKindHeadings[question.kind], '**Production example:**', '**Depth and trade-off:**', '**Verification and caveat:**'];
    assert(requiredHeadings.every((heading) => answer.spokenAnswer.includes(heading)), `${question.id} spoken answer has the wrong structure`);
    assert(answer && typeof answer.modelAnswer === 'string' && answer.modelAnswer.length >= 400, `${question.id} needs a detailed candidate answer`);
    assert((answer.modelAnswer.match(/\*\*[^*]+:\*\*/g) ?? []).length >= 4, `${question.id} candidate answer must be easy to scan`);
    assert(typeof answer.explanation === 'string' && answer.explanation.length >= 300, `${question.id} needs a detailed explanation`);
    assert(answer.explanation.includes('**Why this answer is correct:**') || answer.explanation.includes('**Why this answer is credible:**'), `${question.id} needs a correctness explanation`);
    assert(answer.explanation.includes('**In plain language:**'), `${question.id} needs a plain-language explanation`);
    assert(answer.explanation.includes('**Evidence to ask for:**') || answer.explanation.includes('**Evidence to listen for:**'), `${question.id} needs question-specific proof`);
    assert(!answer.modelAnswer.includes('answers should begin with the requirement'), `${question.id} still contains the retired generic template`);
    assert(!answer.modelAnswer.includes('Use it when the mechanism matches the problem'), `${question.id} still contains generic filler`);
    assert(Array.isArray(answer.keyPoints) && answer.keyPoints.length >= 2, `${question.id} needs key points`);
    assert(typeof answer.realWorldExample === 'string' && answer.realWorldExample.length >= 30, `${question.id} needs a real-world example`);
    assert(Array.isArray(answer.commonMistakes) && answer.commonMistakes.length > 0, `${question.id} needs common mistakes`);
    if (answer.code?.language === 'hcl') assert(question.prompt.includes('Terraform'), `${question.id} includes Terraform even though the question does not ask for it`);
    if (question.kind === 'scenario' || question.kind === 'design') assert(answer.flow, `${question.id} needs a decision flow`);
    if (answer.flow) assert(Array.isArray(answer.flow.steps) && answer.flow.steps.length >= 2 && answer.flow.steps.length <= 8, `${question.id} flow must have 2-8 steps`);
  }
}

const expectedQuestions = manifest.tracks.reduce((sum, track) => sum + track.questionCount, 0);
assert(trackIds.size === manifest.tracks.length, 'Track slugs must be unique across the manifest');
assert(allQuestionIds.size === expectedQuestions, `Expected ${expectedQuestions} unique questions`);
assert(allSpokenAnswers.size === expectedQuestions, `Expected ${expectedQuestions} unique spoken answers`);
process.stdout.write(`${JSON.stringify({ valid: true, tracks: trackIds.size, questions: allQuestionIds.size })}\n`);

async function json(path) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'));
}

function required(value, name) {
  assert(typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), `Invalid ${name}`);
  return value;
}

function unique(values, name) {
  const items = new Set(values);
  assert(items.size === values.length, `Duplicate ${name}`);
  return items;
}

function wordCount(value) {
  return value.trim().split(/\s+/).length;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
