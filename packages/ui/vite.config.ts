import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    // One stylesheet for the whole library. With code splitting on, every entry
    // would emit its own file and consumers would have to know which to import.
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        'theme/index': 'src/theme/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // `@vanilla-extract/recipes` stays external: its runtime is tiny, but the
      // emitted .d.ts reference its types, so consumers need it resolvable
      // anyway. Bundling it would ship the same code twice.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@vanilla-extract\/recipes($|\/)/],
      output: {
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith('.css')) ? 'styles.css' : '[name][extname]',
      },
    },
  },
});
