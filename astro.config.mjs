import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    site: 'https://macascore.com',
    integrations: [
        tailwind(),
        sitemap({
            filter: (page) => !page.includes('/api/'),
        }),
    ],
    output: 'hybrid',
    adapter: vercel(),

    server: {
        host: true
    },
    vite: {
        server: {
            allowedHosts: true
        }
    }
});
