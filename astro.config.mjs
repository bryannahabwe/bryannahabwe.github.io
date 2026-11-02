import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// User site served from the root of bryannahabwe.github.io (gh-pages branch).
export default defineConfig({
  site: "https://bryannahabwe.github.io",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap()],
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
