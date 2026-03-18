import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    site: 'https://macascore.com',
    integrations: [
        tailwind(),
    ],
    output: 'server',
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
