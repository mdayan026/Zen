// postcss.config.js
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
});
