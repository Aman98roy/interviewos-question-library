import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lessons } from './lessons.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const categories = [
  ['cloud', 'Cloud', 'Public-cloud architecture, operations, security, reliability, and cost trade-offs.'],
  ['languages', 'Programming Languages', 'Language fundamentals, runtime behavior, maintainability, testing, and performance.'],
  ['frontend', 'Frontend', 'Browser-facing engineering, accessibility, rendering, state, and user-perceived performance.'],
  ['backend', 'Backend', 'API and service implementation, persistence, security, reliability, and production operations.'],
  ['data', 'Data', 'Data modeling, queries, consistency, caching, scale, and operational safety.'],
  ['devops', 'DevOps', 'Delivery automation, containers, infrastructure, networking, and reliable operations.'],
  ['architecture', 'Architecture', 'System decomposition, distributed trade-offs, security, resilience, and scale.'],
].map(([slug, title, description]) => ({ slug, title, description }));

const tracks = [
  track('aws', 'AWS', 'cloud', 'Design and operate secure, reliable, and cost-aware workloads on Amazon Web Services.', ['IAM', 'VPC', 'EC2 and Lambda', 'S3', 'RDS and DynamoDB'], 'an online marketplace absorbing unpredictable campaign traffic'),
  track('azure', 'Microsoft Azure', 'cloud', 'Build governed Azure workloads across identity, networking, compute, data, and operations.', ['Microsoft Entra ID', 'Virtual Networks', 'App Service and Functions', 'Azure Storage', 'Azure SQL and Cosmos DB'], 'an enterprise application integrating with corporate identity'),
  track('gcp', 'Google Cloud', 'cloud', 'Reason about Google Cloud services, least privilege, data platforms, reliability, and spend.', ['IAM', 'VPC', 'Cloud Run and GKE', 'Cloud Storage', 'Cloud SQL and Spanner'], 'a data-heavy service with global read traffic'),
  track('javascript-typescript', 'JavaScript & TypeScript', 'languages', 'Explain JavaScript runtime behavior and use TypeScript to make production code safer.', ['Event loop', 'Type system', 'Promises', 'Modules', 'Testing'], 'a browser and Node.js application sharing domain types'),
  track('python', 'Python', 'languages', 'Write clear Python and reason about concurrency, typing, testing, and runtime performance.', ['Data model', 'Typing', 'Async IO', 'Packaging', 'Testing'], 'a data-processing API with bursty background work'),
  track('java', 'Java', 'languages', 'Apply Java language, JVM, concurrency, testing, and performance principles in production.', ['JVM and memory', 'Collections', 'Concurrency', 'Streams', 'Testing'], 'a high-throughput transaction service'),
  track('csharp', 'C#', 'languages', 'Use modern C# effectively across types, asynchronous work, memory, testing, and maintainability.', ['Type system', 'LINQ', 'Async and await', 'Memory management', 'Testing'], 'an enterprise service processing long-running workflows'),
  track('go', 'Go', 'languages', 'Build simple concurrent Go services with explicit error handling and predictable operations.', ['Goroutines', 'Channels', 'Interfaces', 'Context', 'Testing'], 'a low-latency network service under variable load'),
  track('web-fundamentals', 'Web Fundamentals', 'frontend', 'Master browser standards, accessible HTML, CSS layout, networking, and performance.', ['Semantic HTML', 'CSS layout', 'Accessibility', 'HTTP and browsers', 'Core Web Vitals'], 'a commerce page used across mobile devices and assistive technology'),
  track('react', 'React', 'frontend', 'Reason about component boundaries, state, rendering, effects, accessibility, and performance.', ['Rendering model', 'State management', 'Effects', 'Accessibility', 'Performance'], 'an interactive operations dashboard with frequent updates'),
  track('nextjs', 'Next.js', 'frontend', 'Design App Router applications using server/client boundaries, caching, routing, and security.', ['Server Components', 'App Router', 'Caching', 'Route Handlers', 'Performance'], 'a content-rich SaaS with public and authenticated areas'),
  track('angular', 'Angular', 'frontend', 'Build maintainable Angular applications using dependency injection, RxJS, forms, and change detection.', ['Components', 'Dependency injection', 'RxJS', 'Forms', 'Change detection'], 'an enterprise administration portal with complex forms'),
  track('nodejs', 'Node.js', 'backend', 'Build secure Node.js services while understanding the event loop, streams, APIs, and operations.', ['Event loop', 'Streams', 'API design', 'Security', 'Observability'], 'an API gateway serving many concurrent clients'),
  track('spring-boot', 'Spring Boot', 'backend', 'Create production Spring Boot services with clear boundaries, transactions, security, and observability.', ['Dependency injection', 'REST APIs', 'Transactions', 'Spring Security', 'Observability'], 'an order service coordinating inventory and payment'),
  track('aspnet-core', 'ASP.NET Core', 'backend', 'Build efficient ASP.NET Core APIs with middleware, dependency injection, data access, and security.', ['Middleware', 'Dependency injection', 'Web APIs', 'Entity Framework Core', 'Authentication'], 'a multi-tenant business API with strict authorization'),
  track('django-fastapi', 'Django & FastAPI', 'backend', 'Choose and operate Python web frameworks with sound validation, data access, security, and async boundaries.', ['Request validation', 'ORM and data access', 'Authentication', 'Async boundaries', 'Testing'], 'a customer portal plus a high-throughput inference API'),
  track('sql-postgresql', 'SQL & PostgreSQL', 'data', 'Model relational data and diagnose queries using indexes, transactions, and PostgreSQL operations.', ['Data modeling', 'Indexes', 'Transactions', 'Query plans', 'Concurrency'], 'a subscription platform with auditable billing records'),
  track('mongodb-nosql', 'MongoDB & NoSQL', 'data', 'Model document workloads and reason about indexes, consistency, aggregation, and operational limits.', ['Document modeling', 'Indexes', 'Aggregation', 'Consistency', 'Scaling'], 'a product catalog with flexible attributes and heavy reads'),
  track('redis-caching', 'Redis & Caching', 'data', 'Use Redis and caching deliberately while handling invalidation, failure, consistency, and memory.', ['Cache patterns', 'Expiration', 'Data structures', 'Consistency', 'Failure handling'], 'a read-heavy API protecting a slower primary database'),
  track('linux-networking', 'Linux & Networking', 'devops', 'Diagnose Linux systems and network paths using evidence, protocols, permissions, and resource limits.', ['Processes', 'Files and permissions', 'TCP and DNS', 'Resource analysis', 'Troubleshooting'], 'a production service with intermittent latency and connection failures'),
  track('docker', 'Docker', 'devops', 'Build small secure images and operate containers with predictable configuration and debugging.', ['Images and layers', 'Networking', 'Storage', 'Security', 'Build optimization'], 'a service moving from developer laptops into repeatable deployments'),
  track('kubernetes', 'Kubernetes', 'devops', 'Operate Kubernetes workloads using scheduling, networking, configuration, security, and observability.', ['Pods and workloads', 'Services and ingress', 'Configuration', 'Security', 'Reliability'], 'a multi-service platform requiring safe rolling releases'),
  track('cicd-infrastructure', 'CI/CD & Infrastructure as Code', 'devops', 'Design repeatable delivery and infrastructure workflows with review, testing, rollback, and drift control.', ['Pipeline design', 'Terraform', 'Secrets', 'Deployment strategies', 'Observability'], 'a team releasing several services multiple times each day'),
  track('system-design', 'System Design', 'architecture', 'Translate product requirements into scalable services, data flows, interfaces, and operational controls.', ['Requirements', 'APIs and boundaries', 'Data architecture', 'Scale', 'Trade-offs'], 'a globally used notification and activity platform'),
  track('distributed-systems', 'Distributed Systems, Reliability & Security', 'architecture', 'Reason about partial failure, consistency, resilience, observability, and security boundaries.', ['Consistency', 'Messaging', 'Resilience', 'Observability', 'Threat modeling'], 'a financial workflow spanning independently deployed services'),
];

const levelBlueprints = {
  basic: [
    ['conceptual', 'Explain the mental model, vocabulary, and one important limit.'],
    ['practical', 'Show the smallest correct use and how a beginner can verify it.'],
    ['troubleshooting', 'Recognize a common failure from simple evidence and correct it safely.'],
  ],
  intermediate: [
    ['conceptual', 'Connect the mechanism to implementation and operational trade-offs.'],
    ['practical', 'Implement it with validation, security, observability, and failure handling.'],
    ['troubleshooting', 'Diagnose an intermittent production failure using ordered evidence.'],
    ['design', 'Design the boundary and justify the main alternative you rejected.'],
  ],
  advanced: [
    ['conceptual', 'Explain internal behavior, guarantees, and the subtle limit senior engineers watch.'],
    ['practical', 'Implement for high scale with bounded resources and measurable correctness.'],
    ['scenario', 'Choose between credible alternatives under latency, scale, security, and cost constraints.'],
    ['troubleshooting', 'Diagnose partial failure, contention, or saturation without guessing.'],
    ['design', 'Design for failure isolation, recovery, evolution, and an explicit SLO.'],
    ['conceptual', 'Teach the trade-off through a counterexample and define when the decision changes.'],
  ],
  scenario: [
    ['scenario', 'Make and defend a real production decision with incomplete information.'],
    ['troubleshooting', 'Lead an incident response from symptoms to evidence, mitigation, and prevention.'],
    ['design', 'Whiteboard the end-to-end design, failure paths, security controls, cost, and rollback.'],
  ],
};
const codeExamples = {
  aws: ['hcl', 'resource "aws_security_group_rule" "https" {\n  type              = "ingress"\n  from_port         = 443\n  to_port           = 443\n  protocol          = "tcp"\n  security_group_id = aws_security_group.app.id\n  source_security_group_id = aws_security_group.lb.id\n}'],
  azure: ['bicep', 'resource subnet \'Microsoft.Network/virtualNetworks/subnets@2023-09-01\' = {\n  name: \'app\'\n  properties: {\n    addressPrefix: \'10.0.1.0/24\'\n    networkSecurityGroup: { id: nsg.id }\n  }\n}'],
  gcp: ['hcl', 'resource "google_compute_firewall" "allow_lb" {\n  name    = "allow-lb-to-app"\n  network = google_compute_network.main.name\n  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]\n  allow { protocol = "tcp" ports = ["8080"] }\n}'],
  'javascript-typescript': ['typescript', 'const User = z.object({ id: z.string().uuid(), name: z.string().min(1) });\ntype User = z.infer<typeof User>;\nconst user = User.parse(await response.json());'],
  python: ['python', 'class UserReader(Protocol):\n    def get(self, user_id: UUID) -> User | None: ...\n\ndef find_user(reader: UserReader, user_id: UUID) -> User:\n    user = reader.get(user_id)\n    if user is None:\n        raise UserNotFound(user_id)\n    return user'],
  java: ['java', 'Map<String, Integer> totals = new HashMap<>();\nfor (Order order : orders) {\n    totals.merge(order.customerId(), order.amount(), Integer::sum);\n}'],
  csharp: ['csharp', 'var invoices = await db.Invoices\n    .Where(x => x.OrganizationId == organizationId && !x.Paid)\n    .OrderBy(x => x.DueAt)\n    .Select(x => new InvoiceRow(x.Id, x.Total, x.DueAt))\n    .ToListAsync(cancellationToken);'],
  go: ['go', 'jobs := make(chan Job, 32)\nfor i := 0; i < 4; i++ {\n    go worker(ctx, jobs)\n}\nselect {\ncase jobs <- job:\ncase <-ctx.Done():\n    return ctx.Err()\n}'],
  'web-fundamentals': ['html', '<fieldset>\n  <legend>Delivery speed</legend>\n  <label><input type="radio" name="speed" value="standard"> Standard</label>\n  <label><input type="radio" name="speed" value="express"> Express</label>\n</fieldset>'],
  react: ['tsx', 'function Incidents() {\n  const [query, setQuery] = useState(\'\');\n  const incidents = useIncidents();\n  const visible = incidents.filter((item) => item.title.includes(query));\n  return <IncidentTable rows={visible} />;\n}'],
  nextjs: ['tsx', 'export default async function Page() {\n  const account = await getAccount();\n  return <AccountSummary account={account} />;\n}\n\n// Only this leaf needs browser interaction.\n\'use client\';\nexport function ThemeControl() { /* ... */ }'],
  angular: ['typescript', 'results$ = this.query.valueChanges.pipe(\n  debounceTime(250),\n  distinctUntilChanged(),\n  switchMap(query => this.api.search(query))\n);'],
  nodejs: ['typescript', 'await pipeline(\n  objectStore.createReadStream(key),\n  createGzip(),\n  response,\n  { signal: request.signal },\n);'],
  'spring-boot': ['java', '@RestController\n@RequiredArgsConstructor\nclass OrderController {\n  private final CreateOrder createOrder;\n\n  @PostMapping("/orders")\n  OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {\n    return OrderResponse.from(createOrder.handle(request.toCommand()));\n  }\n}'],
  'aspnet-core': ['csharp', 'app.MapPost("/invoices", async (CreateInvoice request, ClaimsPrincipal user, CancellationToken ct) =>\n{\n    var organizationId = user.RequireOrganizationId();\n    return Results.Ok(await service.Create(organizationId, request, ct));\n}).RequireAuthorization("CanManageBilling");'],
  'django-fastapi': ['python', 'class CreateJob(BaseModel):\n    model: str\n    input: str = Field(min_length=1, max_length=10_000)\n\n@app.post("/jobs")\nasync def create_job(command: CreateJob, account: Account = Depends(current_account)):\n    return await service.create(account.id, command)'],
  'sql-postgresql': ['sql', 'CREATE INDEX CONCURRENTLY invoice_unpaid_due_idx\nON invoice (organization_id, due_at)\nWHERE paid_at IS NULL;'],
  'mongodb-nosql': ['javascript', 'db.products.createIndex(\n  { categoryId: 1, available: 1, price: 1 },\n  { name: "category_available_price" }\n);'],
  'redis-caching': ['typescript', 'const cached = await redis.get(key);\nif (cached) return JSON.parse(cached);\nconst value = await repository.find(id);\nawait redis.set(key, JSON.stringify(value), { EX: 300 + randomJitter() });\nreturn value;'],
  'linux-networking': ['bash', 'dig api.example.com\nss -ntp\nip route get 203.0.113.10\ncurl -v --connect-timeout 3 https://api.example.com/health'],
  docker: ['dockerfile', 'FROM node:20-bookworm AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-bookworm-slim\nUSER node\nCOPY --from=build --chown=node:node /app/.next/standalone /app\nCMD ["node", "/app/server.js"]'],
  kubernetes: ['yaml', 'apiVersion: v1\nkind: Service\nmetadata:\n  name: api\nspec:\n  selector:\n    app: api\n  ports:\n    - port: 80\n      targetPort: 8080'],
  'cicd-infrastructure': ['hcl', 'terraform {\n  backend "s3" {\n    bucket         = "company-terraform-state"\n    key            = "services/orders.tfstate"\n    dynamodb_table = "terraform-locks"\n    encrypt        = true\n  }\n}'],
  'system-design': ['text', 'POST /v1/notifications\nIdempotency-Key: <client-generated-id>\n\n202 Accepted\n{ "notificationId": "...", "status": "queued" }'],
  'distributed-systems': ['sql', 'BEGIN;\nINSERT INTO payment (id, status) VALUES ($1, \'captured\');\nINSERT INTO outbox (id, topic, payload) VALUES ($2, \'payment.captured\', $3);\nCOMMIT;'],
};

await mkdir(resolve(root, 'tracks'), { recursive: true });
assert(Object.keys(lessons).length === tracks.length, 'Every track needs a lesson bank');
for (const item of tracks) assert(lessons[item.slug]?.length === 5, `${item.slug} needs five lessons`);

await writeJson('manifest.json', {
  schemaVersion: 1,
  categories,
  tracks: tracks.map(({ example: _example, ...item }) => ({ ...item, questionCount: 80, file: `tracks/${item.slug}.json` })),
});

for (const item of tracks) {
  const questions = Object.entries(levelBlueprints).flatMap(([level, blueprints]) => lessons[item.slug].flatMap((material, topicIndex) => blueprints.map(([kind, focus], round) => ({ material, topicIndex, kind, focus, round }))).map((entry, index) => question(item, entry, level, index)));
  await writeJson(`tracks/${item.slug}.json`, { schemaVersion: 1, slug: item.slug, questions });
}

process.stdout.write(`Generated ${tracks.length} tracks and ${tracks.length * 80} subject-specific questions.\n`);

function track(slug, title, category, summary, topics, example) {
  return { slug, title, category, summary, topics, example };
}

function question(item, entry, level, index) {
  const { material, topicIndex, kind, focus } = entry;
  const topic = item.topics[topicIndex];
  const prompt = `${prompts(item, topic)[kind]} ${focus}`;
  const modelAnswer = answer(item, material, topic, level, kind);
  const result = {
    id: `${item.slug}-${level}-${String(index + 1).padStart(2, '0')}`,
    level,
    kind,
    prompt,
    skillsTested: [topic, skillFor(kind), `${capitalize(level)} reasoning`],
    answer: {
      modelAnswer,
      keyPoints: [
        `**Remember:** ${material.memory}`,
        firstSentence(material.teach),
        firstSentence(material.operate),
      ],
      realWorldExample: `🏭 **In production:** ${material.example}\n\n✅ **Why this is a strong answer:** It connects ${topic} to a concrete outcome and explains what the team would observe to confirm the decision works safely.`,
      commonMistakes: [
        `Naming ${topic} without explaining its mechanism, ownership, or limit.`,
        'Describing only success and omitting failure behavior, security, observability, or recovery.',
      ],
    },
  };

  if (kind === 'practical' && codeExamples[item.slug]) {
    const [language, source] = codeExamples[item.slug];
    result.answer.code = { language, source };
  }
  if (kind === 'scenario' || kind === 'design') {
    result.answer.flow = {
      title: `${topic}: requirement-to-proof flow`,
      steps: [
        { label: 'Clarify', detail: `${item.example}: state workload, correctness, security, scale, and recovery requirements.` },
        { label: 'Choose', detail: firstSentence(material.teach) },
        { label: 'Protect', detail: firstSentence(material.operate) },
        { label: 'Prove', detail: 'Test success, overload, dependency failure, recovery, and the user-visible latency or correctness target.' },
      ],
    };
  }
  return result;
}

function prompts(item, topic) {
  return {
    conceptual: `Explain ${topic} in ${item.title} to an engineer who must use it tomorrow.`,
    practical: `Implement a production-safe ${topic} solution with ${item.title}. Show the smallest useful example and explain how you would test it.`,
    scenario: `${capitalize(item.example)} needs a decision about ${topic}. What would you choose, what would you reject, and why?`,
    troubleshooting: `${capitalize(item.example)} has an intermittent ${topic} problem. Which evidence do you collect first, how do you narrow the cause, and how do you prevent recurrence?`,
    design: `Design the ${topic} boundary for ${item.example}. Cover data flow, failure, security, observability, cost, and the condition that would make you redesign it.`,
  };
}

function answer(item, material, topic, level, kind) {
  const leads = {
    conceptual: firstSentence(material.teach),
    practical: `Start with the smallest implementation that preserves the contract. ${firstSentence(material.teach)}`,
    scenario: `For ${item.example}, make the decision from workload and correctness needs. ${firstSentence(material.teach)}`,
    troubleshooting: `Establish impact and compare healthy behavior before changing configuration. ${firstSentence(material.teach)}`,
    design: `Treat ${topic} as an explicit, owned boundary. ${firstSentence(material.teach)}`,
  };
  const depth = {
    basic: `Use it when the mechanism matches the problem; avoid it when its main limit breaks correctness or makes the system harder to operate.`,
    intermediate: `Production behavior matters as much as syntax. Explain ownership, invalid input, dependency failure, security, and the recovery path.`,
    advanced: `The key trade-off is whether the guarantee justifies its coordination, latency, operational, security, and cost burden. Compare the simplest credible alternative and name the measured threshold that would trigger a redesign.`,
    scenario: `State assumptions before choosing. Compare at least one credible alternative, describe overload and dependency failure, make permissions and data exposure explicit, and keep rollback possible.`,
  };
  const mechanismDetail = withoutFirstSentence(material.teach) || `The important part is the behavior and guarantee ${topic} provides, not merely the feature name.`;
  const verification = kind === 'troubleshooting'
    ? `Reproduce or isolate one symptom, change one variable at a time, and confirm recovery with the same signal that proved the failure.`
    : `Test the happy path, invalid input, overload, dependency failure, and recovery. Measure latency, errors, saturation, correctness, and cost where they apply.`;

  return [
    `🎯 **Direct answer — ${topic}:** ${leads[kind]}`,
    `🧠 **How it works:** ${mechanismDetail}`,
    `🛠️ **How to use it in a real system:** ${material.operate}`,
    `⚖️ **When to use it—and when not to:** ${depth[level]}`,
    `✅ **How to prove the answer:** ${verification}`,
    `💡 **Memory hook:** “${material.memory}”`,
  ].join('\n\n');
}

function skillFor(kind) {
  return {
    conceptual: 'Concept explanation',
    practical: 'Implementation and testing',
    scenario: 'Scenario trade-offs',
    troubleshooting: 'Evidence-based diagnosis',
    design: 'System design',
  }[kind];
}

function firstSentence(value) {
  return value.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? value;
}

function withoutFirstSentence(value) {
  return value.slice(firstSentence(value).length).trim();
}

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function writeJson(path, value) {
  await writeFile(resolve(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
