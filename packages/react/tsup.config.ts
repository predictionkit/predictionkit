import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2021',
  external: ['react', 'react-dom', '@prediction-kit/core'],
  // Mark the whole entry as a client module so it can be imported into React
  // Server Components (e.g. Next.js App Router). No-op for other bundlers.
  banner: { js: "'use client';" },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
