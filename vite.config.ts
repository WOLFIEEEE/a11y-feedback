import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', 'tests/**/*'],
      rollupTypes: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'A11yFeedback',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'a11y-feedback.js'
        if (format === 'cjs') return 'a11y-feedback.cjs'
        return `a11y-feedback.${format}.js`
      },
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {},
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
  },
})
