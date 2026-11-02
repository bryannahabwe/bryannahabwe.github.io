/**
 * Identity, contact and SEO facts. Everything here is public: sourced from the
 * previous site, the CV, or public profiles. Keep private contact details out.
 */
export const profile = {
  name: "Nahabwe Brian",
  role: "Software Engineer",
  currentTitle: "Software Engineer",
  focus: "Backend engineering, distributed systems & fintech infrastructure",
  location: "Kampala, Uganda",
  since: 2017,
  yearsLabel: "8+ years",
  employer: { name: "XENO Investment", url: "https://myxeno.com/" },
  email: "nahabwebrian24@gmail.com",
  site: "https://bryannahabwe.github.io",
  summary:
    "Software engineer in Kampala with 8+ years building financial systems — mobile-money payments, investment and savings platforms, and multi-tenant SaaS — in Java, Spring Boot, Groovy/Grails and Kafka.",
  languages: ["English", "Runyankole", "Luganda"],
} as const;

export const socials = [
  { label: "GitHub", handle: "bryannahabwe", href: "https://github.com/bryannahabwe" },
  { label: "LinkedIn", handle: "nahabwe-brian", href: "https://www.linkedin.com/in/nahabwe-brian/" },
  { label: "X", handle: "@nahabwebryn", href: "https://x.com/nahabwebryn" },
] as const;

export const nav = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Insights", href: "/#insights" },
  { label: "Contact", href: "/#contact" },
] as const;

export const education = [
  {
    title: "BSc Software Engineering — Second Class Honours (Upper Division)",
    org: "Makerere University, Kampala",
    period: "2013 – 2017",
  },
] as const;

export const credentials = [
  { title: "McKinsey Forward Programme", org: "McKinsey & Company", period: "2023" },
  {
    title: "Spring Boot",
    org: "Amigoscode",
    period: "Certificate",
    href: "https://app.amigoscode.com/courses/267273/certificate",
  },
  {
    title: "Intro to SQL",
    org: "Kaggle",
    period: "Certificate",
    href: "https://www.kaggle.com/learn/certification/nahabwebrian/intro-to-sql",
  },
  {
    title: "Intro to Programming (Python)",
    org: "Kaggle",
    period: "Certificate",
    href: "https://www.kaggle.com/learn/certification/nahabwebrian/intro-to-programming",
  },
] as const;
