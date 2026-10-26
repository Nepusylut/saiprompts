import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Cloudflare Pages SSG Deployment Configuration
export default defineConfig({
  site: 'https://promptcraft-blog.pages.dev',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    react()
  ],
});
