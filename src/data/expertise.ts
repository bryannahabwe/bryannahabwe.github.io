/** Each group lists only tools with evidence in shipped code or commit history. */
export const expertise = [
  {
    title: "Backend engineering",
    blurb: "Services that stay correct when their dependencies don't.",
    items: ["Java 17–25", "Spring Boot 2.7–4.1", "WebFlux & R2DBC", "Groovy / Grails 4–6", "Python / FastAPI", "Resilience4j", "REST & OpenAPI"],
  },
  {
    title: "Data & messaging",
    blurb: "Durable events, honest schemas, indexes that earn their keep.",
    items: ["Apache Kafka", "PostgreSQL", "MySQL", "Redis", "RabbitMQ", "Liquibase & Flyway", "Transactional outbox"],
  },
  {
    title: "Fintech & payments",
    blurb: "Mobile money and investing rails across East Africa.",
    items: ["MTN MoMo Open API", "Airtel Money", "USSD channels", "SMS gateways", "Reconciliation", "Request signing", "goAML reporting"],
  },
  {
    title: "Multi-tenancy & security",
    blurb: "Isolation enforced at the lowest layer that can enforce it.",
    items: ["Keycloak / OIDC", "OAuth2 & JWT", "PKCE & BFF", "PostgreSQL RLS", "Schema-per-tenant", "RBAC & audit trails"],
  },
  {
    title: "Platform & delivery",
    blurb: "Shipping small, observing everything.",
    items: ["Docker", "Kubernetes & Helm", "GitLab CI", "OpenTelemetry", "Prometheus & Grafana", "Loki", "Camunda 8"],
  },
  {
    title: "Frontend & quality",
    blurb: "Enough of the stack to ship the whole feature.",
    items: ["React", "Next.js", "Angular", "Flutter", "Testcontainers", "WireMock", "k6 & Locust"],
  },
] as const;

export const principles = [
  {
    title: "Design the failure path first",
    body: "Every remote call gets a timeout, a budget and a decision about retries. Money-moving POSTs are never retried blindly; they carry an idempotency reference and are reconciled instead.",
  },
  {
    title: "Write the decision down",
    body: "Non-trivial choices become short architecture decision records — context, options, consequence — so the next engineer inherits the reasoning, not just the code.",
  },
  {
    title: "Migrate in slices, not leaps",
    body: "Legacy systems are replaced one endpoint at a time behind a switch, with contract tests proving the new path emits exactly what the old one did.",
  },
  {
    title: "Isolate tenants where it can't be forgotten",
    body: "Tenant boundaries belong in the database and the token — row-level security or schema-per-tenant, tenant resolved from the JWT — not in a WHERE clause someone has to remember.",
  },
  {
    title: "Treat customer data as a liability",
    body: "No request bodies or phone numbers in logs, secrets from a secret manager, least-privilege roles, and access revocation checked on every request.",
  },
  {
    title: "Make it observable before it's urgent",
    body: "Golden-signal dashboards, alert rules and traces ship with the service, so production questions have answers before they become incidents.",
  },
] as const;

/**
 * Writing. Drafts render without links until published; add `href` when live.
 */
export const writing: { title: string; summary: string; status: "draft" | "published"; href?: string; topic: string }[] = [
  {
    title: "A Keycloak-style provider SPI for multi-tenant notifications",
    summary:
      "Using Provider / ProviderFactory and ServiceLoader so SMS, email, push and WhatsApp adapters can be dropped in as JARs without touching the core engine.",
    status: "published",
    href: "/insights/keycloak-style-provider-spi/",
    topic: "Architecture",
  },
  {
    title: "Deploying Odoo 17 on DigitalOcean with Docker",
    summary: "A practical, reproducible setup for running Odoo with custom addons on a single droplet.",
    status: "draft",
    topic: "Operations",
  },
];

/** Compact skill tiles for the home page; `expertise` above holds the full detail. */
export const skills = [
  { icon: "server", title: "Backend", detail: "Java, Spring Boot, Groovy, Grails" },
  { icon: "python", title: "Python", detail: "FastAPI, Odoo" },
  { icon: "database", title: "Databases", detail: "PostgreSQL, MySQL, Redis" },
  { icon: "stream", title: "Event Streaming", detail: "Kafka, outbox, RabbitMQ" },
  { icon: "cloud", title: "Cloud & DevOps", detail: "Docker, Kubernetes, GCP, AWS" },
  { icon: "shield", title: "Security", detail: "Keycloak, OAuth2, JWT, RBAC" },
  { icon: "code", title: "Frontend", detail: "React, Angular, TypeScript" },
  { icon: "network", title: "Architecture", detail: "Microservices, multi-tenant" },
] as const;

export const pillarsOfApproach = [
  { icon: "trend", title: "Scalability", body: "Services that grow from hundreds to thousands of transactions a day." },
  { icon: "shield", title: "Reliability", body: "Timeouts, circuit breakers, idempotency and reconciliation." },
  { icon: "bolt", title: "Performance", body: "Caching and indexing that turn seconds into milliseconds." },
  { icon: "lock", title: "Security", body: "Tenant isolation in the database and token; no PII in logs." },
  { icon: "wrench", title: "Maintainability", body: "Decision records, contract tests and incremental migration." },
] as const;
