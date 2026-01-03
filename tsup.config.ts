import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'], // поддержка ESM и CommonJS
    minify: true,           // минификация
    dts: true,              // генерировать .d.ts
    sourcemap: true,
    clean: true,
});
