import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  outDir: 'dist',
  tsconfig: './tsconfig.json',
  esbuildOptions(options) {
    // 将路径别名转换为相对路径
    options.alias = {
      '@': './src',
    }
  },
})
