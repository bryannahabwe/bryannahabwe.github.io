/**
 * Roles, dates and figures come from the CV (Nov 2026) and commit history.
 * No internal service names, hostnames or credentials.
 */
export interface Role {
  company: string;
  url?: string;
  title: string;
  kind?: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const experience: Role[] = [
  {
    company: "XENO Investment",
    url: "https://myxeno.com/",
    title: "Software Engineer",
    period: "Apr 2022 — Present",
    location: "Kampala, Uganda",
    summary:
      "A digital fund manager that helps people plan, save and invest toward their goals. I work across the core investment platform, its payment rails, its customer channels and the infrastructure that watches over them.",
    highlights: [
      "Integrated the MTN and Airtel mobile-money Open APIs for deposits and withdrawals — now the route for more than 90% of client deposits — and later rebuilt the MTN gateway around timeouts, per-tenant circuit breakers, idempotent references and an outbox.",
      "Built the USSD investing channel on Spring WebFlux with Redis sessions: responses under 500 ms while monthly visitors grew from 50,000 to over 200,000.",
      "Set up monitoring from scratch with Prometheus, Grafana and the LGTM stack, so problems surface through alerts rather than user reports.",
      "Drive the incremental migration of the staff operations console from a Grails monolith to Spring Boot 4 on Java 25, documented in 29 architecture decision records.",
      "Manage identity and access in Keycloak — users, groups, roles and clients — securing fund-data APIs (NAV, portfolio values, transactions) with OAuth2 and RBAC.",
      "Added Redis caching to the busiest endpoints, taking response times from seconds to milliseconds and reducing database load.",
      "Mentored 3+ junior developers through code review and agreed coding standards.",
    ],
    stack: ["Java 17–25", "Spring Boot", "WebFlux", "Groovy/Grails", "Kafka", "MySQL", "PostgreSQL", "Redis", "Keycloak", "Kubernetes", "Prometheus/Grafana"],
  },
  {
    company: "Rexial",
    title: "Backend Software Engineer",
    kind: "Contract",
    period: "Sep 2024 — Jun 2026",
    location: "Kampala, Uganda",
    summary:
      "Payment platforms connecting banks and mobile network operators for real-time payments, direct debits and merchant collections.",
    highlights: [
      "Built loosely coupled payment services on Spring Boot and Kafka, designed to grow from hundreds to thousands of transactions a day.",
      "Integrated bank and mobile-network payment APIs (MTN, Airtel) for real-time payments across several channels.",
      "Ran the payment microservices on GCP — GKE and Cloud Run with Cloud SQL, Memorystore and IAM policies scoped per service.",
      "Built GitLab CI for builds, tests, SonarQube gates and deployments, cutting deployment time from about an hour to 15 minutes.",
      "Kept coverage above 80% with JUnit 5 and Mockito; secured services with JWT, Keycloak, input validation and encrypted payment credentials.",
    ],
    stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "GKE", "Cloud Run", "Keycloak", "GitLab CI", "SonarQube"],
  },
  {
    company: "AU InnoLab",
    url: "https://innolab.africa/",
    title: "Consultant — Events Management Platform",
    kind: "Consultancy",
    period: "Aug — Sep 2026",
    location: "Remote",
    summary:
      "Sole developer of the platform that ran AU INNOFEST '26 at the African Union headquarters in Addis Ababa.",
    highlights: [
      "Designed and built the whole system — React frontend, Spring Boot backend, PostgreSQL — deployed on GCP and delivered in two months, ahead of the event.",
      "Public programme across three parallel rooms, speaker profiles, travel information and documents, in English and French.",
      "Accreditation with QR-coded passes for gate entry, and invitation-only sessions closed to general registration.",
    ],
    stack: ["Java", "Spring Boot", "React", "PostgreSQL", "GCP"],
  },
  {
    company: "OMNI-Tech U Ltd",
    url: "https://omnitech.co.ug/",
    title: "Software Developer",
    period: "Aug 2017 — Mar 2022",
    location: "Kampala, Uganda",
    summary: "A software house building custom web, mobile and desktop systems for businesses and development organisations.",
    highlights: [
      "Contributed to an M&E data-collection platform used by NGOs including SNV, DRC and GIZ, with 50+ field staff per organisation replacing paper-based processes.",
      "Built the backend integration with Camunda for UNICEF Uganda to automate multi-step approval and reporting workflows.",
      "Built custom Odoo modules in Python and Metabase dashboards for multi-project KPI tracking; deployed and maintained Spring Boot services on Linux.",
    ],
    stack: ["Java", "Spring Boot", "Groovy/Grails", "Python", "Odoo", "Camunda", "MySQL", "PostgreSQL"],
  },
];
