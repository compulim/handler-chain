import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'handler-chain': './src/index.ts',
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'esnext'
  }
]);
