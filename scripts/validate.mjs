import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = await json('manifest.json');
const levels = new Set(['basic', 'intermediate', 'advanced', 'scenario']);
const ids = new Set();

assert(manifest.schemaVersion === 1, 'Manifest schemaVersion must be 1');
assert(Array.isArray(manifest.categories) && manifest.categories.length > 0, 'Manifest categories are required');
assert(Array.isArray(manifest.tracks) && manifest.tracks.length > 0, 'Manifest tracks are required');

const categoryIds = unique(manifest.categories.map(({ slug }) => requiredId(slug, 'category slug')), 'category slugs');
unique(manifest.tracks.map(({ slug }) => requiredId(slug, 'track slug')), 'track slugs');

for (const summary of manifest.tracks) {
  assert(categoryIds.has(summary.category), `${summary.slug} references an unknown category`);
  assert(summary.file === `tracks/${summary.slug}.json`, `${summary.slug} has an unsafe or mismatched file path`);

  const track = await json(summary.file);
  assert(track.schemaVersion === 1 && track.topic === summary.title, `${summary.slug} metadata does not match manifest`);
  assert(Array.isArray(track.questions) && track.questions.length === summary.questionCount, `${summary.slug} must contain ${summary.questionCount} questions`);
  unique(track.questions.map(({ id }) => requiredId(id, `${summary.slug} question id`)), `${summary.slug} question IDs`);
  unique(track.questions.map(({ question }) => requiredText(question, 'question')), `${summary.slug} question prompts`);

  for (const question of track.questions) {
    assert(!ids.has(question.id), `Duplicate global question ID: ${question.id}`);
    ids.add(question.id);
    assert(levels.has(question.level), `${question.id} has invalid level`);
    for (const field of ['category', 'answer', 'explanation', 'example']) requiredText(question[field], `${question.id} ${field}`);
    assert(question.answer.includes('**') && question.explanation.includes('**'), `${question.id} needs highlighted answer sections`);
    assert(Array.isArray(question.keyPoints) && question.keyPoints.length >= 3, `${question.id} needs at least three key points`);
    question.keyPoints.forEach((point) => requiredText(point, `${question.id} key point`));
    assert(Array.isArray(question.commonMistakes) && question.commonMistakes.length > 0, `${question.id} needs common mistakes`);
    question.commonMistakes.forEach((mistake) => requiredText(mistake, `${question.id} common mistake`));
    if (question.flow) {
      assert(Array.isArray(question.flow) && question.flow.length >= 2, `${question.id} flow must have at least two steps`);
      question.flow.forEach((step) => requiredText(step, `${question.id} flow step`));
    }
  }
}

const expectedQuestions = manifest.tracks.reduce((total, track) => total + track.questionCount, 0);
assert(ids.size === expectedQuestions, `Expected ${expectedQuestions} unique questions`);
process.stdout.write(`${JSON.stringify({ valid: true, tracks: manifest.tracks.length, questions: ids.size })}\n`);

async function json(path) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'));
}

function requiredId(value, name) {
  assert(typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), `Invalid ${name}`);
  return value;
}

function requiredText(value, name) {
  assert(typeof value === 'string' && value.trim(), `${name} is required`);
  return value;
}

function unique(values, name) {
  const items = new Set(values);
  assert(items.size === values.length, `Duplicate ${name}`);
  return items;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
