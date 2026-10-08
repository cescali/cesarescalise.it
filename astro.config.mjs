// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cesarescalise.it',
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel(),
  security: {
    // Astro 5 blocca di default ogni POST il cui header Origin non combaci
    // esattamente col dominio: il nostro proxy /wordpress/* (wp-admin, login,
    // upload) viene bloccato da questo controllo su Vercel. Lo disabilitiamo
    // perché non abbiamo form pubblici sensibili al CSRF sul nostro dominio.
    checkOrigin: false,
  },
});