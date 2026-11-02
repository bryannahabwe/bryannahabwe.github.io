/**
 * Engineering case studies.
 *
 * Rules for this file:
 *  - Every claim is traceable to specs, ADRs or commits I authored.
 *  - No internal codenames, hostnames, partner names, credentials or
 *    production metrics. Outcomes are stated qualitatively unless the number
 *    is both verified and safe to publish.
 */
export interface FlowStep {
  label: string;
  detail: string;
}

export interface Decision {
  title: string;
  choice: string;
  alternatives: string;
  why: string;
}

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  context: string;
  period: string;
  role: string;
  status: string;
  stack: string[];
  problem: string[];
  constraints: string[];
  flowTitle: string;
  flow: FlowStep[];
  decisions: Decision[];
  implementation: string[];
  outcomes: string[];
}

export const projects: Project[] = [
  {
    slug: "mobile-money-gateway",
    title: "A mobile-money gateway that fails safely",
    kicker: "Payments · Resilience",
    summary:
      "Rebuilding the service that moves customer deposits and withdrawals through the MTN MoMo Open API, so that a slow or failing provider can no longer take the platform down with it — or lose a payment callback.",
    context: "XENO Investment",
    period: "2022 — 2026",
    role: "Core engineer on the rebuild and the platform migration",
    status: "In production",
    stack: ["Java 25", "Spring Boot 4.1", "Resilience4j", "Kafka", "Redis", "k6", "WireMock"],
    problem: [
      "Every deposit and withdrawal in the investment platform ultimately becomes a call to a mobile-money provider. The original client was written for the happy path: no connect or read timeouts, no retry policy, no circuit breaker, and a fresh OAuth token fetched on every single call.",
      "When the provider slowed down, request threads queued behind it and the slowness spread upstream. When the message broker was briefly unavailable, provider callbacks — the only signal that money had actually moved — could be dropped.",
    ],
    constraints: [
      "Money-moving calls must never be duplicated by an automatic retry.",
      "Downstream consumers already depend on existing Kafka topics and payload shapes; they could not change in lockstep.",
      "Several tenants and products share the gateway; one misbehaving product must not starve the others.",
      "Customer phone numbers and request bodies must stay out of logs.",
      "The provider was moving customers to a new platform during the rebuild.",
    ],
    flowTitle: "Request and callback path",
    flow: [
      { label: "Platform request", detail: "Deposit or withdrawal with a unique reference ID; duplicates rejected with 409." },
      { label: "Token cache", detail: "OAuth tokens cached and refreshed ahead of expiry instead of per call." },
      { label: "Bulkhead + breaker", detail: "Isolated per tenant × product; 2 s connect, 10 s read budgets." },
      { label: "Provider API", detail: "New platform primary, legacy platform as fallback." },
      { label: "Callback → outbox", detail: "Callback persisted to a Redis outbox before publishing." },
      { label: "Kafka", detail: "Idempotent producer, acks=all, existing topics and payloads byte-for-byte." },
      { label: "Republish + reconcile", detail: "Pending events republished; status pulled for anything unconfirmed." },
    ],
    decisions: [
      {
        title: "No automatic retries on POST",
        choice: "Writes are attempted once and reconciled; only idempotent GETs retry, once, with backoff.",
        alternatives: "Retry everything with exponential backoff.",
        why: "A retried disbursement that the provider actually processed is a double payment. Reconciliation is slower but never wrong.",
      },
      {
        title: "Isolation per tenant × product",
        choice: "Separate circuit breaker and bulkhead instances keyed by tenant and product.",
        alternatives: "One global breaker for the provider.",
        why: "A global breaker turns one product's outage into everyone's outage. Fine-grained isolation keeps healthy flows moving.",
      },
      {
        title: "Outbox before broker",
        choice: "Persist each callback to an outbox, publish asynchronously, and republish anything left pending.",
        alternatives: "Publish directly to Kafka inside the callback handler.",
        why: "The callback is the source of truth that money moved; it must survive a broker outage rather than depend on one.",
      },
      {
        title: "Byte-for-byte topic compatibility",
        choice: "Keep existing topics and payloads exactly, enforced by tests.",
        alternatives: "Introduce new, cleaner event contracts.",
        why: "Lets the gateway be replaced independently of every consumer — the migration ships without a coordinated release.",
      },
    ],
    implementation: [
      "Rewrote the service from Groovy on Spring Boot 3.3 to Java 25 on Spring Boot 4.1, with the full design captured in a written specification.",
      "Built a provider client with cached tokens, explicit timeouts, Resilience4j breakers and bulkheads, and translation of provider errors into a stable internal error model.",
      "Added a Redis-backed outbox, a scheduled republish job for pending events, and a reconciliation pull for transactions without a final status.",
      "Removed sensitive values from logs and kept callbacks outside tenant filters so the provider can always reach them.",
      "Set up k6 scenarios against WireMock stubs with a p99 latency threshold to exercise the client under load.",
    ],
    outcomes: [
      "More than 90% of client deposits now arrive through the MTN and Airtel mobile-money integrations.",
      "Production traffic moved onto the provider's new platform, with the previous platform retained as a fallback.",
      "Callback events are published on the existing topics with identical payloads, so no downstream service had to change.",
      "A slow provider now consumes a bounded slice of capacity for one tenant and product instead of the whole service's thread pool.",
    ],
  },
  {
    slug: "strangler-migration",
    title: "Migrating a staff console off a monolith, one endpoint at a time",
    kicker: "Architecture · Migration",
    summary:
      "Replacing the Grails monolith behind the operations console with a Spring Boot 4 service — without a big-bang cutover, without changing the database underneath, and without breaking a single downstream event.",
    context: "XENO Investment",
    period: "2026 — ongoing",
    role: "Started and drives the service; author of the architecture decision records",
    status: "In progress",
    stack: ["Java 25", "Spring Boot 4.1", "Keycloak", "MySQL", "Kafka", "Liquibase", "OpenTelemetry", "Angular 22"],
    problem: [
      "Staff in compliance, operations and client service run the business from an admin console backed by a large Grails monolith. Every change to it carried the risk of the whole system, and the codebase was increasingly hard to secure and observe.",
      "A rewrite was the obvious temptation — and the classic way to stall for a year while the old system keeps changing underneath you.",
    ],
    constraints: [
      "The legacy database is shared and stays shared; schemas cannot fork.",
      "Other services consume the events the monolith emits and must not notice the switch.",
      "Tables are expected to grow toward a billion rows with hundreds of concurrent staff.",
      "Staff access must be revocable immediately, not at token expiry.",
    ],
    flowTitle: "Strangler routing",
    flow: [
      { label: "Angular console", detail: "Unchanged UI; calls one API surface." },
      { label: "Per-endpoint switch", detail: "Each endpoint routed to legacy or new independently." },
      { label: "New service", detail: "Spring Boot 4 on Java 25; tenant resolved from the JWT." },
      { label: "Keycloak check", detail: "Staff status verified on every request; revocation is immediate." },
      { label: "Shared MySQL", detail: "Same schema; query budgets and indexes for very large tables." },
      { label: "Contract tests", detail: "Fail if a write emits different events than legacy does." },
    ],
    decisions: [
      {
        title: "Strangler, not rewrite",
        choice: "Move endpoints individually behind a switch that can be flipped back.",
        alternatives: "Full rewrite with a single cutover date.",
        why: "Each slice ships and proves itself in production; rollback is a config change, not an incident.",
      },
      {
        title: "Tenant from the token",
        choice: "Resolve the tenant from the authenticated JWT.",
        alternatives: "Trust a tenant header sent by the client.",
        why: "A header can be forged; a signed token cannot. Tenant isolation should not depend on client honesty.",
      },
      {
        title: "Event contract tests",
        choice: "Tests assert the new write paths publish exactly the messages legacy publishes.",
        alternatives: "Rely on downstream teams to notice differences.",
        why: "Makes the invisible contract explicit, so the migration can't silently break consumers.",
      },
      {
        title: "Explicit query budgets",
        choice: "Default query time limits, with heavier aggregates given their own, larger budget.",
        alternatives: "Unbounded queries tuned only when they hurt.",
        why: "At this data size a single slow aggregate can saturate a pool; budgets make the cost of each query a design decision.",
      },
    ],
    implementation: [
      "Recorded the architecture in 29 ADRs, a written specification and a role matrix before and during the build.",
      "Integrated Keycloak through a shared multi-tenant OAuth2 starter, with staff suspend and restore wired through to identity.",
      "Added Resilience4j breakers, bulkheads and rate limiters; credentials from a secret manager via External Secrets.",
      "Centralised SQL table references to clear static-analysis security hotspots.",
      "Shipped Grafana golden-signal dashboards and alert rules alongside the service.",
    ],
    outcomes: [
      "Endpoints move in reversible slices behind per-endpoint switches instead of a single cutover.",
      "Event-contract tests turn any divergence from legacy behaviour into a failing build instead of a production surprise.",
      "In the same console I fixed defects including a currency-unit conversion that overstated one market's deposits, and an identity-path crash triggered by email addresses in URLs.",
    ],
  },
  {
    slug: "ussd-investing",
    title: "Investing over USSD on any phone",
    kicker: "Channels · Reactive systems",
    summary:
      "The USSD applications that let customers on basic feature phones open accounts, set goals, save automatically and invest — across two mobile networks, with sessions measured in seconds.",
    context: "XENO Investment",
    period: "2023 — 2026",
    role: "Built the channel; majority contributor across both network integrations",
    status: "In production",
    stack: ["Java 17", "Spring Boot 3", "WebFlux", "R2DBC", "Reactive Redis", "Kafka", "Testcontainers"],
    problem: [
      "Many of the people a savings product should reach do not have a smartphone. USSD works on every handset — but it is stateless per hop, sessions time out in seconds, and each network operator has its own gateway and behaviour.",
      "Menus that call slow downstream services feel broken to a user staring at a feature phone, and a dropped session mid-flow is a lost customer.",
    ],
    constraints: [
      "Tight network-imposed session timeouts on every response.",
      "Two operators with different gateways and message formats.",
      "Account and KYC lookups depend on external services that can fail.",
    ],
    flowTitle: "USSD session path",
    flow: [
      { label: "Operator gateway", detail: "MTN or Airtel USSD request for one menu step." },
      { label: "Reactive handler", detail: "WebFlux, non-blocking end to end." },
      { label: "Session in Redis", detail: "Menu state and inputs held in reactive Redis between hops." },
      { label: "R2DBC store", detail: "Non-blocking persistence for accounts and goals." },
      { label: "Kafka events", detail: "Savings and onboarding events published to the core platform." },
    ],
    decisions: [
      {
        title: "Reactive, non-blocking stack",
        choice: "WebFlux with R2DBC and reactive Redis, including automated savings.",
        alternatives: "Thread-per-request with blocking JDBC.",
        why: "Response time per hop is the product. Non-blocking I/O keeps latency flat while waiting on slower dependencies.",
      },
      {
        title: "Session state outside the process",
        choice: "Keep menu sessions in Redis.",
        alternatives: "In-memory sessions with sticky routing.",
        why: "Any instance can serve the next hop, so instances can scale and restart without dropping customers mid-flow.",
      },
      {
        title: "Separate partitions per direction",
        choice: "Publish and consume on different Kafka partitions.",
        alternatives: "Shared partitions for both directions.",
        why: "Resolved a production issue where services consumed messages meant for another network's flow.",
      },
    ],
    implementation: [
      "Built onboarding, add-account, add-goal, automated-savings (create, update, cancel) and group journeys.",
      "Refactored automated savings to be fully non-blocking.",
      "Handled KYC-lookup failures explicitly so onboarding degrades rather than fails.",
      "Integration-tested against real Kafka, MySQL and Redis with Testcontainers.",
    ],
    outcomes: [
      "Responses under 500 ms per menu step.",
      "Monthly visitors grew from 50,000 to over 200,000.",
      "Customers on both MTN and Airtel can onboard, set goals and save automatically from any phone.",
      "Cross-network message consumption issues were resolved by separating partitions.",
    ],
  },
  {
    slug: "notification-platform",
    title: "A multi-tenant notification platform",
    kicker: "Multi-tenancy · Platform",
    summary:
      "A shared service for SMS, email, WhatsApp and push, where tenant isolation is enforced by PostgreSQL itself and new providers plug in without touching the core.",
    context: "XENO Investment",
    period: "2026",
    role: "Designed and built from the first commit",
    status: "Built and tested",
    stack: ["Java", "Spring Boot 4", "PostgreSQL RLS", "Kafka", "Redis", "Liquibase", "Keycloak", "Testcontainers"],
    problem: [
      "Messaging was spread across services, each with its own provider integration. Adding a channel or switching a provider meant changing several codebases, and there was no single place to enforce tenant boundaries, preferences or delivery tracking.",
    ],
    constraints: [
      "Multiple tenants share one database; a bug must not leak one tenant's messages to another.",
      "Providers differ by market and change over time.",
      "Message volume grows unbounded, so storage has to be partitioned from day one.",
    ],
    flowTitle: "Message fan-out",
    flow: [
      { label: "Kafka / API", detail: "Products publish a notification request." },
      { label: "Preferences", detail: "Channel selection driven by recipient preferences." },
      { label: "Provider SPI", detail: "Adapter chosen per tenant, channel and market." },
      { label: "Adapters", detail: "Africa's Talking, Mailgun, Twilio, WhatsApp, FCM, Infobip." },
      { label: "PostgreSQL + RLS", detail: "Forced row-level security; partitioned delivery records." },
    ],
    decisions: [
      {
        title: "Row-level security, forced",
        choice: "PostgreSQL RLS policies with FORCE enabled, keyed on the tenant.",
        alternatives: "Tenant filtering in application queries.",
        why: "The database refuses cross-tenant reads even if application code forgets a filter.",
      },
      {
        title: "Provider SPI",
        choice: "A Provider / ProviderFactory interface with self-contained adapters.",
        alternatives: "Provider-specific branches inside the delivery service.",
        why: "Adding or swapping a provider becomes a new adapter, not a change to core logic.",
      },
      {
        title: "Partitioning up front",
        choice: "Partition delivery tables from the first migration.",
        alternatives: "Add partitioning later when tables are large.",
        why: "Retrofitting partitions onto a hot, large table is far riskier than starting with them.",
      },
    ],
    implementation: [
      "Wrote the requirements and technical specification and ADRs before implementation.",
      "Implemented six channel adapters behind the SPI.",
      "Verified RLS policies and partitioning against real PostgreSQL with Testcontainers.",
    ],
    outcomes: [
      "Tenant isolation is guaranteed by the database and verified by integration tests.",
      "New channels and providers are added as adapters without changes to the core engine.",
    ],
  },
  {
    slug: "core-platform-hardening",
    title: "Hardening the core investment platform",
    kicker: "Security · Reliability",
    summary:
      "Years of steady work on the Grails system at the heart of the business: upgrading it, securing it, and fixing the failure modes that only show up in production.",
    context: "XENO Investment",
    period: "2022 — 2026",
    role: "Long-term maintainer and contributor across two major framework versions",
    status: "In production",
    stack: ["Groovy", "Grails 4 → 6", "MySQL 8", "Kafka", "RabbitMQ", "Keycloak", "Kubernetes", "Helm"],
    problem: [
      "The core platform holds client accounts, goals, deposits and withdrawals. It predates most of the surrounding services and has to keep running while everything around it changes — new identity provider, new event streams, new channels.",
    ],
    constraints: [
      "Zero tolerance for errors in withdrawal and account-ownership logic.",
      "Changes must coexist with newer services consuming and producing the same events.",
    ],
    flowTitle: "Where the work landed",
    flow: [
      { label: "Withdrawals", detail: "Verification codes bound to the account owner; bounded code generation." },
      { label: "Identity", detail: "Existing staff linked to Keycloak identities." },
      { label: "Events", detail: "Consumer groups and partition rebalancing fixed; no self-consumption." },
      { label: "Database", detail: "Targeted indexes for queries that timed out in production." },
      { label: "Channels", detail: "USSD APIs, PIN reset, referrals and the new provider contract." },
    ],
    decisions: [
      {
        title: "Bind verification to the owner",
        choice: "Withdrawal codes are validated against the account owner who requested them.",
        alternatives: "Validate the code alone.",
        why: "Closed a path where a valid code belonging to someone else could confirm a withdrawal.",
      },
      {
        title: "Bounded code generation",
        choice: "Draw verification codes from a bounded pool with an explicit exhaustion path.",
        alternatives: "Random generation until an unused code appears.",
        why: "Unbounded generation loops forever once the code space is exhausted.",
      },
      {
        title: "Ignore your own events",
        choice: "Consumers skip messages the platform itself published.",
        alternatives: "Process every message on the topic.",
        why: "Prevents feedback loops once the monolith both produces and consumes shared topics.",
      },
    ],
    implementation: [
      "Worked across both the Grails 4 and Grails 6 generations of the platform, including Kubernetes deployment and service-discovery configuration.",
      "Added indexes through versioned migrations for lookups that were timing out.",
      "Built Kafka consumers that provision client, staff and partner users from the authentication service.",
    ],
    outcomes: [
      "Two withdrawal-verification flaws closed: code ownership and code-space exhaustion.",
      "Production query timeouts resolved with targeted indexes.",
      "Kafka rebalancing and self-consumption issues fixed as the platform moved to event-driven integration.",
    ],
  },
  {
    slug: "payments-platform",
    title: "Real-time payments between banks and mobile networks",
    kicker: "Payments · Cloud",
    summary:
      "Event-driven payment services that connect banks and mobile network operators — direct debits, merchant collections, fees and settlement reporting — run on Google Cloud.",
    context: "Rexial · Contract",
    period: "2024 — 2026",
    role: "Backend engineer across the payment services, CI and cloud deployment",
    status: "In production",
    stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "GKE", "Cloud Run", "Cloud SQL", "Memorystore", "Keycloak", "GitLab CI"],
    problem: [
      "Moving money between banks and mobile wallets in real time means integrating partners with very different APIs, availability and settlement rules — while merchants, banks and operators each need their own view of the same transactions.",
      "The platform had to start small and still be ready to grow from hundreds to thousands of transactions a day without a redesign.",
    ],
    constraints: [
      "Partner APIs fail independently; one slow partner must not stall the others.",
      "Payment credentials must be stored encrypted and access scoped per service.",
      "Releases had to get faster without loosening quality gates.",
    ],
    flowTitle: "Service landscape",
    flow: [
      { label: "API gateway", detail: "Single entry point; Keycloak-issued tokens." },
      { label: "Merchant & consumer services", detail: "Mandates, merchants and customer flows; tenant-aware." },
      { label: "Kafka", detail: "Services coupled through events, not synchronous chains." },
      { label: "MNO & bank adapters", detail: "MTN, Airtel and bank payment APIs behind dedicated services." },
      { label: "Billing", detail: "Merchant discount rates, surcharges and revenue splits." },
      { label: "Reporting", detail: "PostgreSQL reporting model and Metabase dashboards." },
    ],
    decisions: [
      {
        title: "Event-driven coupling",
        choice: "Services communicate through Kafka topics.",
        alternatives: "Synchronous REST chains between services.",
        why: "A slow partner integration backs up a topic rather than every caller's thread pool, and services scale independently.",
      },
      {
        title: "Consolidate reporting on PostgreSQL",
        choice: "Moved the reporting service from MongoDB to PostgreSQL, with customers consolidated into a materialised view.",
        alternatives: "Keep a separate document store for reporting.",
        why: "Financial reporting is relational by nature; one engine and one query model simplified joins, correctness and operations.",
      },
      {
        title: "Least-privilege cloud identity",
        choice: "IAM policies scoped per service on GKE and Cloud Run.",
        alternatives: "One shared service account.",
        why: "A compromised or buggy service can only reach the resources it actually needs.",
      },
    ],
    implementation: [
      "Built consumer, merchant, billing, reporting and mobile-network services on Spring Boot.",
      "GitLab CI pipelines with builds, tests, SonarQube quality gates and automated deployment.",
      "JUnit 5 and Mockito suites kept above the 80% coverage gate.",
      "Metabase dashboards for product and finance teams to answer their own reporting questions.",
    ],
    outcomes: [
      "Deployment time cut from about an hour to 15 minutes.",
      "Coverage held above 80% as enforced by the SonarQube gate.",
      "Real-time payments across banks and mobile networks on several channels.",
    ],
  },
  {
    slug: "au-innofest-platform",
    title: "The events platform behind AU INNOFEST '26",
    kicker: "Full-stack · Delivery",
    summary:
      "A bilingual events and accreditation platform for the African Union Innovation Lab — designed, built and shipped by one engineer in two months, ahead of a two-day gathering at the AU headquarters.",
    context: "AU InnoLab · Consultancy",
    period: "Aug — Sep 2026",
    role: "Sole developer: design, backend, frontend and deployment",
    status: "Delivered — event held 29–30 Sep 2026",
    stack: ["Java", "Spring Boot", "React", "PostgreSQL", "GCP"],
    problem: [
      "AU INNOFEST '26 brought delegates from across the continent to Addis Ababa, with three rooms running in parallel and sessions restricted to invited guests. The organisers needed one place for the programme, speakers, logistics and registration — and a way to control entry at the gate.",
      "The date was fixed. Requirements kept changing during the engagement.",
    ],
    constraints: [
      "Hard, immovable deadline: the event itself.",
      "Delegates read in English or French.",
      "Invitation-only sessions must not be open to general registration.",
    ],
    flowTitle: "Delegate journey",
    flow: [
      { label: "Public site", detail: "Programme by day, time and room; speakers; venue and travel; documents." },
      { label: "Registration", detail: "Pass registration with access rules per session." },
      { label: "QR pass", detail: "A QR-coded pass issued for each accredited attendee." },
      { label: "Gate", detail: "Pass scanned for entry on the day." },
    ],
    decisions: [
      {
        title: "Boring, proven stack",
        choice: "Spring Boot, PostgreSQL and React on GCP.",
        alternatives: "A hosted events SaaS or a newer framework.",
        why: "With a fixed date, predictability beats novelty — and the organisers needed custom accreditation rules a template wouldn't give them.",
      },
      {
        title: "Bilingual from the data model up",
        choice: "English and French content as first-class fields.",
        alternatives: "Machine translation in the browser.",
        why: "Programme and logistics information has to be exact for delegates in either language.",
      },
      {
        title: "Access rules on the session",
        choice: "Invitation-only enforced per session at registration.",
        alternatives: "Manual vetting after registration.",
        why: "Closed sessions stay closed without staff checking every sign-up.",
      },
    ],
    implementation: [
      "Public event pages with the full programme across three parallel rooms, speaker profiles and downloadable agenda and logistics notes.",
      "Accreditation flow with QR-coded passes used for entry at the gate.",
      "Continuous re-planning as requirements changed, without moving the delivery date.",
    ],
    outcomes: [
      "Delivered within two months, ahead of the event.",
      "The platform ran AU INNOFEST '26 on 29–30 September 2026 at the African Union headquarters.",
    ],
  },
  {
    slug: "moozo-school-platform",
    title: "Moozo: a multi-tenant school platform",
    kicker: "Product · Multi-tenancy",
    summary:
      "A school management platform where every school gets its own isolated database schema the moment it registers — with offline-first attendance and grades, and an alerts engine that tells parents when patterns change.",
    context: "Moozo · Co-founder",
    period: "2026",
    role: "Co-founder and lead backend engineer",
    status: "Co-founded product",
    stack: ["Java", "Spring Boot 4", "PostgreSQL", "Redis", "Flyway", "JWT", "WebSocket", "Firebase FCM", "Africa's Talking", "Docker"],
    problem: [
      "Schools need records they can trust — attendance, grades, discipline, health — and parents need to hear about problems early. But many classrooms have unreliable connectivity, and every school expects its data to be strictly its own.",
    ],
    constraints: [
      "Hard data isolation between schools on shared infrastructure.",
      "Teachers record attendance and grades on devices that go offline.",
      "Parents are reached by SMS and push, through more than one provider.",
    ],
    flowTitle: "Platform shape",
    flow: [
      { label: "School registers", detail: "A dedicated PostgreSQL schema is provisioned automatically." },
      { label: "Tenant filter", detail: "Each request bound to its school's schema via Hibernate multi-tenancy." },
      { label: "12 modules", detail: "Auth, staff roles, enrolment, attendance, grades, discipline, health, wellbeing, parents…" },
      { label: "Offline sync", detail: "Batch endpoints process each record independently on reconnect." },
      { label: "Alerts engine", detail: "Cross-module patterns notify parents via SMS and push." },
    ],
    decisions: [
      {
        title: "Schema-per-tenant",
        choice: "One PostgreSQL schema per school, created on registration.",
        alternatives: "Shared tables with a tenant column; a database per school.",
        why: "Stronger isolation than a column, far cheaper to operate than a database per school.",
      },
      {
        title: "Per-record batch results",
        choice: "Offline batches are processed record by record, each with its own result.",
        alternatives: "All-or-nothing batch transactions.",
        why: "One bad record shouldn't throw away a teacher's whole morning of attendance.",
      },
      {
        title: "Provider-agnostic messaging",
        choice: "A reusable SMS starter with pluggable providers, published as a library.",
        alternatives: "Provider code embedded in the core service.",
        why: "Switching or adding a provider is configuration, not a code change.",
      },
    ],
    implementation: [
      "Twelve connected backend modules from authentication and role-based staff management to wellbeing and parent access.",
      "An alerts engine that watches for repeated absence, grades falling across subjects and sudden attendance changes.",
      "JWT, WebSocket updates, Firebase push and Africa's Talking SMS, documented with OpenAPI 3.",
    ],
    outcomes: [
      "Each new school is isolated automatically at registration — no manual provisioning.",
      "Teachers can capture records offline without risking partial-sync data loss.",
    ],
  },
];

/** Products I run, shown as compact cards rather than full case studies. */
export const products = [
  {
    name: "RentFlow",
    tagline: "Multi-tenant rental management",
    href: "https://rental.askmoozo.com/",
    role: "Built and run independently",
    points: [
      "Shared-schema multi-tenancy with isolation enforced in the service layer; manages 10+ landlords.",
      "A payment engine that records which month a payment covers separately from when it was paid.",
      "Docker Compose on a VPS behind Nginx and Let's Encrypt, deployed by GitLab CI.",
    ],
    stack: ["Java 25", "Spring Boot 4", "PostgreSQL", "Flyway", "Docker", "Nginx"],
  },
  {
    name: "Church Billionaire SACCO",
    tagline: "Core savings & credit system",
    href: "https://sacco.askmoozo.com/",
    role: "Project lead and sole backend engineer",
    points: [
      "Replaced a spreadsheet process: members, share capital, savings, the loan lifecycle and financial reporting, with audit trails.",
      "Loans checked against share and savings balances, routed through officer and credit committee, with amortisation schedules and arrears flags.",
      "On AWS: ECR, EC2 behind an Application Load Balancer, RDS PostgreSQL and CloudWatch logs.",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "JWT/RBAC", "AWS"],
  },
] as const;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Display order on the home page; the first four are featured. */
export const projectOrder = [
  "mobile-money-gateway",
  "ussd-investing",
  "payments-platform",
  "strangler-migration",
  "au-innofest-platform",
  "notification-platform",
  "moozo-school-platform",
  "core-platform-hardening",
];
export const orderedProjects = projectOrder.map((slug) => getProject(slug)!).filter(Boolean);
