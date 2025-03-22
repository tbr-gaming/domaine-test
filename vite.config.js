import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'assets', // Output to Shopify's assets directory
    emptyOutDir: false, // Prevent Vite from clearing the assets folder
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.js'), // Entry point for JavaScript
      },
      output: {
        entryFileNames: '[name].js', // Output JavaScript as main.js
        assetFileNames: '[name].[ext]', // Output CSS and other assets
      },
    },
  },
});
