import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2021',
  external: ['react', 'react-dom', '@prediction-kit/core'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
