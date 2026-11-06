import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Canonical URL. Served at bryan.umbatech.com (cognix server) and mirrored at bryannahabwe.github.io (GitHub Pages).
export default defineConfig({
  site: "https://bryan.umbatech.com",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap()],
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
