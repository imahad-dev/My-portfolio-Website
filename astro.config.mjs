import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// shortcut: assumed domain; change `site` to the real one before deploying (canonical, OG and sitemap URLs use it).
export default defineConfig({
  site: 'https://imahad-dev.github.io',
  integrations: [sitemap()],
});
