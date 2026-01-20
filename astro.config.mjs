// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://saas-vitrine-antoine.vercel.app',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: true,
    imagesConfig: {
      domains: ['images.unsplash.com'],
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    }
  }),
  image: {
    domains: ['images.unsplash.com'],
  },
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom configuration for different page types
      customPages: [
        'https://saas-vitrine-antoine.vercel.app/',
        'https://saas-vitrine-antoine.vercel.app/services',
        'https://saas-vitrine-antoine.vercel.app/tarifs',
        'https://saas-vitrine-antoine.vercel.app/contact',
        'https://saas-vitrine-antoine.vercel.app/a-propos',
        'https://saas-vitrine-antoine.vercel.app/realisations',
        'https://saas-vitrine-antoine.vercel.app/blog'
      ],
      filter: (page) => {
        // Exclude pages you don't want in the sitemap
        return !page.includes('/admin') && !page.includes('/draft');
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});