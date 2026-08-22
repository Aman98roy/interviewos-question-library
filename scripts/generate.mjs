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
  ['career', 'Career & Behavioral', 'Behavioral stories, HR conversations, workplace judgment, communication, and time management.'],
].map(([slug, title, description]) => ({ slug, title, description }));

const tracks = [
  track('aws', 'AWS', 'cloud', 'Design and operate secure, reliable, and cost-aware workloads on Amazon Web Services.', ['IAM', 'VPC', 'EC2 and Lambda', 'S3', 'RDS and DynamoDB', 'CloudFront and edge delivery', 'SQS and SNS', 'CloudWatch and observability', 'Auto Scaling and load balancing', 'Cost optimization'], 'an online marketplace absorbing unpredictable campaign traffic'),
  track('azure', 'Microsoft Azure', 'cloud', 'Build governed Azure workloads across identity, networking, compute, data, and operations.', ['Microsoft Entra ID', 'Virtual Networks', 'App Service and Functions', 'Azure Storage', 'Azure SQL and Cosmos DB', 'Azure Monitor', 'Service Bus and messaging', 'AKS and containers', 'Key Vault and secrets', 'Cost management'], 'an enterprise application integrating with corporate identity'),
  track('gcp', 'Google Cloud', 'cloud', 'Reason about Google Cloud services, least privilege, data platforms, reliability, and spend.', ['IAM', 'VPC', 'Cloud Run and GKE', 'Cloud Storage', 'Cloud SQL and Spanner', 'Pub/Sub', 'Cloud Monitoring', 'BigQuery', 'Secret Manager', 'Cost and billing'], 'a data-heavy service with global read traffic'),
  track('javascript-typescript', 'JavaScript & TypeScript', 'languages', 'Explain JavaScript runtime behavior and use TypeScript to make production code safer.', ['Event loop', 'Type system', 'Promises', 'Modules', 'Testing', 'Generics and advanced types', 'Error handling', 'Closures and memory', 'Performance profiling', 'Tooling and bundling'], 'a browser and Node.js application sharing domain types'),
  track('python', 'Python', 'languages', 'Write clear Python and reason about concurrency, typing, testing, and runtime performance.', ['Data model', 'Typing', 'Async IO', 'Packaging', 'Testing', 'Generators and iterators', 'Exceptions and error handling', 'Threads and processes', 'Performance and profiling', 'Standard library'], 'a data-processing API with bursty background work'),
  track('java', 'Java', 'languages', 'Apply Java language, JVM, concurrency, testing, and performance principles in production.', ['JVM and memory', 'Collections', 'Concurrency', 'Streams', 'Testing', 'Generics', 'Exception handling', 'Records and sealed types', 'I/O and NIO', 'Build and dependencies'], 'a high-throughput transaction service'),
  track('csharp', 'C#', 'languages', 'Use modern C# effectively across types, asynchronous work, memory, testing, and maintainability.', ['Type system', 'LINQ', 'Async and await', 'Memory management', 'Testing', 'Generics and constraints', 'Exception handling', 'Collections', 'Nullable reference types', 'Dependency injection'], 'an enterprise service processing long-running workflows'),
  track('go', 'Go', 'languages', 'Build simple concurrent Go services with explicit error handling and predictable operations.', ['Goroutines', 'Channels', 'Interfaces', 'Context', 'Testing', 'Error handling', 'Generics', 'Slices and maps', 'Modules and dependencies', 'Profiling and performance'], 'a low-latency network service under variable load'),
  track('web-fundamentals', 'Web Fundamentals', 'frontend', 'Master browser standards, accessible HTML, CSS layout, networking, and performance.', ['Semantic HTML', 'CSS layout', 'Accessibility', 'HTTP and browsers', 'Core Web Vitals', 'Forms and validation', 'Browser JavaScript', 'Web security', 'Caching and CDNs', 'Progressive enhancement'], 'a commerce page used across mobile devices and assistive technology'),
  track('react', 'React', 'frontend', 'Reason about component boundaries, state, rendering, effects, accessibility, and performance.', ['Rendering model', 'State management', 'Effects', 'Accessibility', 'Performance', 'Hooks and custom hooks', 'Context and composition', 'Data fetching and Suspense', 'Forms and controlled inputs', 'Error boundaries'], 'an interactive operations dashboard with frequent updates'),
  track('nextjs', 'Next.js', 'frontend', 'Design App Router applications using server/client boundaries, caching, routing, and security.', ['Server Components', 'App Router', 'Caching', 'Route Handlers', 'Performance', 'Server Actions', 'Data fetching and mutations', 'Authentication and middleware', 'Rendering strategies', 'Images and assets'], 'a content-rich SaaS with public and authenticated areas'),
  track('angular', 'Angular', 'frontend', 'Build maintainable Angular applications using dependency injection, RxJS, forms, and change detection.', ['Components', 'Dependency injection', 'RxJS', 'Forms', 'Change detection', 'Signals', 'Routing and guards', 'HTTP and interceptors', 'State management', 'Testing'], 'an enterprise administration portal with complex forms'),
  track('nodejs', 'Node.js', 'backend', 'Build secure Node.js services while understanding the event loop, streams, APIs, and operations.', ['Event loop', 'Streams', 'API design', 'Security', 'Observability', 'Error handling', 'Modules and packages', 'Worker threads and clustering', 'Configuration and environments', 'Testing'], 'an API gateway serving many concurrent clients'),
  track('spring-boot', 'Spring Boot', 'backend', 'Create production Spring Boot services with clear boundaries, transactions, security, and observability.', ['Dependency injection', 'REST APIs', 'Transactions', 'Spring Security', 'Observability', 'Configuration and profiles', 'Data access with JPA', 'Error handling', 'Caching', 'Testing'], 'an order service coordinating inventory and payment'),
  track('aspnet-core', 'ASP.NET Core', 'backend', 'Build efficient ASP.NET Core APIs with middleware, dependency injection, data access, and security.', ['Middleware', 'Dependency injection', 'Web APIs', 'Entity Framework Core', 'Authentication', 'Configuration and options', 'Error handling', 'Caching', 'Background services', 'Testing'], 'a multi-tenant business API with strict authorization'),
  track('django-fastapi', 'Django & FastAPI', 'backend', 'Choose and operate Python web frameworks with sound validation, data access, security, and async boundaries.', ['Request validation', 'ORM and data access', 'Authentication', 'Async boundaries', 'Testing', 'Migrations and schema', 'Caching', 'Background tasks', 'API design and versioning', 'Configuration and settings'], 'a customer portal plus a high-throughput inference API'),
  track('sql-postgresql', 'SQL & PostgreSQL', 'data', 'Model relational data and diagnose queries using indexes, transactions, and PostgreSQL operations.', ['Data modeling', 'Indexes', 'Transactions', 'Query plans', 'Concurrency', 'Joins and subqueries', 'Window functions', 'JSON and arrays', 'Partitioning', 'Backup and recovery'], 'a subscription platform with auditable billing records'),
  track('mongodb-nosql', 'MongoDB & NoSQL', 'data', 'Model document workloads and reason about indexes, consistency, aggregation, and operational limits.', ['Document modeling', 'Indexes', 'Aggregation', 'Consistency', 'Scaling', 'Schema validation', 'Transactions', 'Change streams', 'Data migration', 'Operational monitoring'], 'a product catalog with flexible attributes and heavy reads'),
  track('redis-caching', 'Redis & Caching', 'data', 'Use Redis and caching deliberately while handling invalidation, failure, consistency, and memory.', ['Cache patterns', 'Expiration', 'Data structures', 'Consistency', 'Failure handling', 'Distributed locks', 'Pub/Sub and streams', 'Rate limiting', 'Persistence', 'Cluster and replication'], 'a read-heavy API protecting a slower primary database'),
  track('linux-networking', 'Linux & Networking', 'devops', 'Diagnose Linux systems and network paths using evidence, protocols, permissions, and resource limits.', ['Processes', 'Files and permissions', 'TCP and DNS', 'Resource analysis', 'Troubleshooting', 'Shell and scripting', 'Systemd and services', 'Load balancing and proxies', 'TLS and certificates', 'Firewalls and security'], 'a production service with intermittent latency and connection failures'),
  track('docker', 'Docker', 'devops', 'Build small secure images and operate containers with predictable configuration and debugging.', ['Images and layers', 'Networking', 'Storage', 'Security', 'Build optimization', 'Compose and multi-container', 'Registries and distribution', 'Runtime and resource limits', 'Logging and monitoring', 'Debugging containers'], 'a service moving from developer laptops into repeatable deployments'),
  track('kubernetes', 'Kubernetes', 'devops', 'Operate Kubernetes workloads using scheduling, networking, configuration, security, and observability.', ['Pods and workloads', 'Services and ingress', 'Configuration', 'Security', 'Reliability', 'Scheduling and affinity', 'Autoscaling', 'Storage and volumes', 'Helm and packaging', 'Observability'], 'a multi-service platform requiring safe rolling releases'),
  track('cicd-infrastructure', 'CI/CD & Infrastructure as Code', 'devops', 'Design repeatable delivery and infrastructure workflows with review, testing, rollback, and drift control.', ['Pipeline design', 'Terraform', 'Secrets', 'Deployment strategies', 'Observability', 'Testing in pipelines', 'Artifact and registry management', 'Environment promotion', 'Drift detection', 'Rollback and recovery'], 'a team releasing several services multiple times each day'),
  track('system-design', 'System Design', 'architecture', 'Translate product requirements into scalable services, data flows, interfaces, and operational controls.', ['Requirements', 'APIs and boundaries', 'Data architecture', 'Scale', 'Trade-offs', 'Caching strategy', 'Load balancing', 'Rate limiting and quotas', 'Consistency and replication', 'Observability and SLOs'], 'a globally used notification and activity platform'),
  track('distributed-systems', 'Distributed Systems, Reliability & Security', 'architecture', 'Reason about partial failure, consistency, resilience, observability, and security boundaries.', ['Consistency', 'Messaging', 'Resilience', 'Observability', 'Threat modeling', 'Consensus and coordination', 'Time and ordering', 'Partitioning and sharding', 'Idempotency and deduplication', 'Disaster recovery'], 'a financial workflow spanning independently deployed services'),
  track('behavioral-hr', 'Behavioral, HR & Time Management', 'career', 'Practice credible workplace stories, HR conversations, collaboration, growth, and prioritization answers.', ['Behavioral storytelling', 'Motivation and career fit', 'Strengths, weaknesses and growth', 'Teamwork, conflict and feedback', 'Time management and prioritization', 'Leadership and influence', 'Failure and learning', 'Handling feedback and criticism', 'Communication with stakeholders', 'Salary and offer negotiation'], 'a candidate interviewing for a cross-functional product engineering role'),
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
const careerLevelBlueprints = {
  basic: [
    ['conceptual', 'Explain what a clear, honest answer should contain and one common mistake.'],
    ['practical', 'Give a concise answer with one specific action and result.'],
    ['troubleshooting', 'Recognize a vague or unfocused answer and improve it safely.'],
  ],
  intermediate: [
    ['conceptual', 'Connect the answer structure to evidence, self-awareness, and role relevance.'],
    ['practical', 'Answer with context, personal actions, trade-offs, outcome, and reflection.'],
    ['troubleshooting', 'Diagnose why an honest answer is not convincing and revise it without inventing details.'],
    ['design', 'Build a reusable answer structure and explain when to adapt it.'],
  ],
  advanced: [
    ['conceptual', 'Explain what senior interviewers infer from the answer and the subtle warning signs they notice.'],
    ['practical', 'Answer a high-stakes version with ambiguity, competing priorities, and measurable impact.'],
    ['scenario', 'Choose and defend a response when people, delivery, and business needs conflict.'],
    ['troubleshooting', 'Repair an answer after probing reveals missing ownership, evidence, or reflection.'],
    ['design', 'Create an answer framework that stays concise under follow-up questions and uncertainty.'],
    ['conceptual', 'Challenge a weak answer with a counterexample and explain what would make the evidence stronger.'],
  ],
  scenario: [
    ['scenario', 'Respond to a realistic workplace situation with incomplete information and clear trade-offs.'],
    ['troubleshooting', 'Recover when the interviewer challenges the example, outcome, or personal contribution.'],
    ['design', 'Structure the full response, likely follow-ups, evidence, learning, and what you would do differently.'],
  ],
};
const codeExamples = {
  azure: ['bicep', 'resource subnet \'Microsoft.Network/virtualNetworks/subnets@2023-09-01\' = {\n  name: \'app\'\n  properties: {\n    addressPrefix: \'10.0.1.0/24\'\n    networkSecurityGroup: { id: nsg.id }\n  }\n}'],
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
const codeExampleTopics = {
  azure: 'Virtual Networks',
  'javascript-typescript': 'Type system',
  python: 'Typing',
  java: 'Collections',
  csharp: 'LINQ',
  go: 'Goroutines',
  'web-fundamentals': 'Semantic HTML',
  react: 'State management',
  nextjs: 'Server Components',
  angular: 'RxJS',
  nodejs: 'Streams',
  'spring-boot': 'REST APIs',
  'aspnet-core': 'Web APIs',
  'django-fastapi': 'Request validation',
  'sql-postgresql': 'Indexes',
  'mongodb-nosql': 'Indexes',
  'redis-caching': 'Cache patterns',
  'linux-networking': 'TCP and DNS',
  docker: 'Images and layers',
  kubernetes: 'Services and ingress',
  'cicd-infrastructure': 'Terraform',
  'system-design': 'APIs and boundaries',
  'distributed-systems': 'Messaging',
};

await mkdir(resolve(root, 'tracks'), { recursive: true });
assert(Object.keys(lessons).length === tracks.length, 'Every track needs a lesson bank');
// One lesson per topic; each topic yields one question per blueprint round.
const blueprintsFor = (item) => item.category === 'career' ? careerLevelBlueprints : levelBlueprints;
const roundsPerTopic = (item) => Object.values(blueprintsFor(item)).reduce((sum, rounds) => sum + rounds.length, 0);
const questionCountFor = (item) => item.topics.length * roundsPerTopic(item);
for (const item of tracks) assert(lessons[item.slug]?.length === item.topics.length, `${item.slug} needs one lesson per topic`);

await writeJson('manifest.json', {
  schemaVersion: 1,
  categories,
  tracks: tracks.map(({ examples: _examples, ...item }) => ({ ...item, questionCount: questionCountFor(item), file: `tracks/${item.slug}.json` })),
});

let generatedQuestions = 0;
for (const item of tracks) {
  const blueprints = blueprintsFor(item);
  const questions = Object.entries(blueprints).flatMap(([level, levelItems]) => {
    const entries = lessons[item.slug].flatMap((material, topicIndex) => levelItems.map(([kind, focus], round) => ({ material, topicIndex, kind, focus, round })));
    return entries
      .map((entry, index) => ({ entry, question: question(item, entry, level, index) }))
      .sort((a, b) => a.entry.round - b.entry.round || a.entry.topicIndex - b.entry.topicIndex)
      .map(({ question: itemQuestion }) => itemQuestion);
  });
  await writeJson(`tracks/${item.slug}.json`, { schemaVersion: 1, slug: item.slug, questions });
  generatedQuestions += questions.length;
}

process.stdout.write(`Generated ${tracks.length} tracks and ${generatedQuestions} subject-specific questions.\n`);

function track(slug, title, category, summary, topics, example) {
  // example is one scenario string or an array of scenarios rotated across topics.
  return { slug, title, category, summary, topics, examples: Array.isArray(example) ? example : [example] };
}

function question(item, entry, level, index) {
  const { material, topicIndex, kind, focus } = entry;
  const topic = item.topics[topicIndex];
  const scenario = item.examples[topicIndex % item.examples.length];
  const prompt = promptFor(item, material, topic, kind, focus, scenario);
  const { explanation, modelAnswer } = answer(item, material, topic, level, kind, focus);
  const result = {
    id: `${item.slug}-${level}-${String(index + 1).padStart(2, '0')}`,
    level,
    kind,
    prompt,
    skillsTested: [topic, item.category === 'career' ? careerSkillFor(kind) : skillFor(kind), `${capitalize(level)} reasoning`],
    answer: {
      spokenAnswer: spokenAnswer(item, material, topic, kind, scenario),
      modelAnswer,
      explanation,
      keyPoints: [
        `**Remember:** ${material.memory}`,
        firstSentence(material.teach),
        firstSentence(material.operate),
      ],
      realWorldExample: item.category === 'career'
        ? `🎤 **In an interview:** ${material.example}\n\n✅ **Why this is a strong answer:** It makes ${topic} specific, credible, and easy to probe without inventing details.`
        : `🏭 **In production:** ${material.example}\n\n✅ **Why this is a strong answer:** It connects ${topic} to a concrete outcome and explains what the team would observe to confirm the decision works safely.`,
      commonMistakes: item.category === 'career'
        ? [`Making broad claims about ${topic} without a specific personal example.`, 'Hiding the trade-off, overstating personal credit, blaming others, or skipping the result and learning.']
        : [`Naming ${topic} without explaining its mechanism, ownership, or limit.`, 'Describing only success and omitting failure behavior, security, observability, or recovery.'],
    },
  };

  if (kind === 'practical' && codeExamples[item.slug] && codeExampleTopics[item.slug] === topic) {
    const [language, source] = codeExamples[item.slug];
    result.answer.code = { language, source };
  }
  if (kind === 'scenario' || kind === 'design') {
    result.answer.flow = item.category === 'career' ? {
      title: `${topic}: evidence-to-reflection flow`,
      steps: [
        { label: 'Clarify', detail: 'Identify what the interviewer is testing and choose one honest, relevant example.' },
        { label: 'Structure', detail: 'Keep context brief, state your responsibility, and spend most of the answer on your actions.' },
        { label: 'Evidence', detail: 'Name the decision, trade-off, collaboration, and measurable or observable outcome.' },
        { label: 'Reflect', detail: 'Explain what you learned, what you would change, and answer follow-ups consistently.' },
      ],
    } : {
      title: `${topic}: requirement-to-proof flow`,
      steps: [
        { label: 'Clarify', detail: `${capitalize(scenario)}: state workload, correctness, security, scale, and recovery requirements.` },
        { label: 'Choose', detail: firstSentence(material.teach) },
        { label: 'Protect', detail: firstSentence(material.operate) },
        { label: 'Prove', detail: 'Test success, overload, dependency failure, recovery, and the user-visible latency or correctness target.' },
      ],
    };
  }
  return result;
}

// One flowing first-person answer a candidate can say aloud, built from the same lesson material as the sectioned modelAnswer.
function spokenAnswer(item, material, topic, kind, scenario) {
  if (item.category === 'career') {
    return `In the interview I'd answer it like this: ${material.example} That works because ${lowercaseFirst(material.teach)} As I deliver it, ${lowercaseFirst(material.operate)} If they probe further, I'd stay specific and honest about what was mine versus the team's rather than inflating my part, and close with what I learned.`;
  }
  const verify = verificationFor(kind, topic);
  return `Here's how I'd say it in the interview: ${material.teach} In practice, I would ${lowercaseFirst(material.operate)} For a concrete case, on ${scenario}, ${lowercaseFirst(material.example)} I'd show it actually works by ${lowercaseFirst(verify)}, and the one limit I'd flag up front is captured by my rule of thumb: “${material.memory}”`;
}

function promptFor(item, material, topic, kind, focus, scenario) {
  const prompts = item.category === 'career' ? {
    conceptual: `What makes an interview answer about ${topic} clear, credible, and easy to verify? Use this example as a reference: ${material.example}`,
    practical: `Give a candidate-ready answer about ${topic} using this honest example: ${material.example}`,
    scenario: `${capitalize(scenario)} faces a difficult question about ${topic}. Use this situation as evidence: ${material.example} How should the candidate respond?`,
    troubleshooting: `A candidate gives this ${topic} example, but it sounds vague under follow-up questions: ${material.example} How should they improve it without inventing details?`,
    design: `How should a candidate structure a concise, credible answer about ${topic}? Use this example to show the structure: ${material.example}`,
  } : {
    conceptual: `What is ${topic} in ${item.title}, how does it work, and why does it matter? Use this production case in your explanation: ${material.example}`,
    practical: `How would you use ${item.title} to achieve the ${topic} outcome below for ${scenario}? Target outcome: ${material.example}`,
    scenario: `Review this ${item.title} proposal for ${scenario}: ${material.example} Focusing on ${topic}, would you approve it, change it, or reject it?`,
    troubleshooting: `In ${scenario}, this expected outcome fails intermittently in production: ${material.example} Focusing on ${topic}, how would you investigate without guessing?`,
    design: `For ${scenario}, how would you design the part of the system concerned with ${topic} using ${item.title}? The target outcome is: ${material.example}`,
  };
  return `${prompts[kind]} Your answer should ${lowercaseFirst(focus)}`;
}

function answer(item, material, topic, level, kind, focus) {
  if (item.category === 'career') return careerAnswer(item, material, topic, level, kind, focus);
  const rule = firstSentence(material.operate);
  const depth = {
    basic: `My rule of thumb is “${material.memory}” I would explain one limit of ${topic} instead of only naming it.`,
    intermediate: `Before shipping, I would make ${topic} ownership, invalid input, dependency failure, security, observability, and recovery explicit. Concretely: ${lowercaseFirst(rule)}`,
    advanced: `For ${topic} at scale I would quantify latency, correctness, security, and cost limits, compare the simplest credible alternative, and name the measured threshold that changes this design. My check: ${lowercaseFirst(rule)}`,
    scenario: `My assumptions: the workload fits current ${topic} limits, the required guarantees match the mechanism, and rollback is available. If a measurement disproves one, I take the simplest credible alternative and retest — verifying by ${lowercaseFirst(rule)}`,
  };
  const verification = verificationFor(kind, topic);
  const conceptualResponse = focus.startsWith('Teach the trade-off')
    ? sections([
      ['Direct answer', material.teach],
      ['Counterexample', `A team does not understand ${topic} if it cannot explain or verify those guarantees.`],
      ['Production use', material.operate],
      ['Concrete example', material.example],
      ['Decision limit', depth[level]],
    ])
    : sections([
      ['Direct answer', material.teach],
      ['Production use', material.operate],
      ['Concrete example', material.example],
      ['How to verify it', capitalize(verification)],
      ['Trade-off and limit', depth[level]],
    ]);
  const responses = {
    conceptual: conceptualResponse,
    practical: sections([
      ['Recommended approach', material.teach],
      ['Implementation', material.operate],
      ['Concrete example', material.example],
      ['How to test it', capitalize(verification)],
      ['Trade-off and limit', depth[level]],
    ]),
    troubleshooting: sections([
      ['Expected behavior', material.teach],
      ['Evidence first', 'Confirm user impact and timeline, then compare one failing request or instance with a healthy one.'],
      ['Narrow the cause', `I would ${lowercaseFirst(material.operate)}`],
      ['Confirm and prevent', `Change one variable at a time. ${capitalize(verification)}. Add a regression check and alert on the signal that exposed the failure.`],
      ['Trade-off and limit', depth[level]],
    ]),
    scenario: sections([
      ['Recommendation', `I would approve this direction, subject to the assumptions below. ${material.teach}`],
      ['Production approach', `I would ${lowercaseFirst(material.operate)}`],
      ['Concrete example', material.example],
      ['Alternative and proof', `I would reject a broader or more expensive option unless a measured requirement justifies it. I would prove this choice by ${lowercaseFirst(verification)}.`],
      ['Assumptions and rollback', depth[level]],
    ]),
    design: sections([
      ['Boundary', `I would give ${topic} a clear owner, inputs, outputs, failure behavior, and recovery path. ${material.teach}`],
      ['Production controls', `I would ${lowercaseFirst(material.operate)}`],
      ['Concrete example', material.example],
      ['How to prove it', capitalize(verification)],
      ['Trade-off and redesign point', depth[level]],
    ]),
  };

  return {
    modelAnswer: responses[kind],
    explanation: sections([
      ['Why this answer is correct', material.teach],
      ['In plain language', material.memory],
      ['How it applies in production', material.operate],
      ['Evidence to ask for', capitalize(verification)],
      ['What a complete answer includes', focus],
    ]),
  };
}

function careerAnswer(item, material, topic, level, kind, focus) {
  const depth = {
    basic: 'I would keep the response concise, truthful, and centered on one personal action rather than a list of traits.',
    intermediate: 'I would make the decision process, collaboration, outcome, and learning explicit so follow-up questions remain consistent.',
    advanced: 'At senior depth, I would address ambiguity, competing interests, influence without authority, measurable impact, and what I would change now.',
    scenario: 'Because details are incomplete, I would state assumptions, ask one useful clarifying question, explain the trade-off, and avoid pretending there was one perfect answer.',
  };
  const verification = careerVerificationFor(kind, topic);
  const conceptualResponse = focus.startsWith('Challenge')
    ? sections([
      ['Weak answer', `A polished claim about ${topic} is weak when it cannot survive a specific follow-up question.`],
      ['What a credible answer needs', material.teach],
      ['How to strengthen it', material.operate],
      ['Candidate-ready example', material.example],
      ['What the interviewer verifies', capitalize(verification)],
    ])
    : sections([
      ['Direct answer', material.teach],
      ['How to deliver it', material.operate],
      ['Candidate-ready example', material.example],
      ['What the interviewer verifies', capitalize(verification)],
      ['What I would emphasize', depth[level]],
    ]);
  const responses = {
    conceptual: conceptualResponse,
    practical: sections([
      ['Candidate-ready answer', material.example],
      ['Why it works', material.teach],
      ['How to deliver it', material.operate],
      ['What follow-up questions verify', capitalize(verification)],
      ['What I would emphasize', depth[level]],
    ]),
    troubleshooting: sections([
      ['Problem', `Do not invent detail. Find the missing context, responsibility, personal action, trade-off, result, or learning in the ${topic} answer.`],
      ['What a credible answer needs', material.teach],
      ['How to revise it', material.operate],
      ['Candidate-ready example', material.example],
      ['What I would emphasize', depth[level]],
    ]),
    scenario: sections([
      ['Response', material.teach],
      ['How to structure it', material.operate],
      ['Candidate-ready example', material.example],
      ['Trade-off and evidence', `Acknowledge the rejected option and explain what evidence drove the decision. ${capitalize(verification)}.`],
      ['What I would emphasize', depth[level]],
    ]),
    design: sections([
      ['Answer structure', `Use brief context, clear responsibility, specific personal actions, decision and trade-off, observable result, then reflection. ${material.teach}`],
      ['How to apply it', material.operate],
      ['Candidate-ready example', material.example],
      ['How to adapt it', 'Treat the structure as a guide, not a script; shorten or expand it in response to follow-up questions.'],
      ['What I would emphasize', depth[level]],
    ]),
  };

  return {
    modelAnswer: responses[kind],
    explanation: sections([
      ['Why this answer is credible', material.teach],
      ['In plain language', material.memory],
      ['How to deliver it', material.operate],
      ['Evidence to listen for', capitalize(verification)],
      ['What a complete answer includes', focus],
    ]),
  };
}

function verificationFor(kind, topic) {
  return {
    conceptual: `showing one expected ${topic} behavior and one boundary case, then connecting both to observable evidence`,
    practical: `testing the intended result, rejected invalid or unauthorized input, one dependency failure, recovery, and the relevant logs or metrics`,
    scenario: `checking the stated assumptions with representative load, failure injection, security review, recovery rehearsal, and cost measurement`,
    troubleshooting: `reproducing or isolating one symptom, narrowing it with ordered evidence, and confirming the fix with the original failing signal`,
    design: `walking through success, invalid input, saturation, dependency failure, recovery, authorization, observability, and the stated SLO`,
  }[kind];
}

function careerVerificationFor(kind, topic) {
  return {
    conceptual: `a clear principle, one ${lowercaseFirst(topic)} example, an honest limit, and a reflection that survives follow-up questions`,
    practical: 'specific personal actions, a visible decision or trade-off, an observable result, and consistency under probing',
    scenario: 'stated assumptions, stakeholder awareness, a defensible choice, the rejected alternative, and learning',
    troubleshooting: 'removing vague claims, separating personal and team contributions, adding evidence, and preserving honesty',
    design: 'a concise context-action-result-reflection structure that adapts without becoming scripted',
  }[kind];
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

function careerSkillFor(kind) {
  return {
    conceptual: 'Self-awareness and communication',
    practical: 'Evidence-based storytelling',
    scenario: 'Workplace judgment',
    troubleshooting: 'Reflection and improvement',
    design: 'Structured communication',
  }[kind];
}

function firstSentence(value) {
  return value.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? value;
}

function lowercaseFirst(value) {
  return `${value[0].toLowerCase()}${value.slice(1)}`;
}

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function sections(items) {
  return items.map(([heading, body]) => `**${heading}:** ${body}`).join('\n\n');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function writeJson(path, value) {
  await writeFile(resolve(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
