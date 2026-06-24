import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2021',
  external: ['react', 'react-dom', 'recharts', '@prediction-kit/core', '@prediction-kit/react'],
  banner: { js: "'use client';" },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
