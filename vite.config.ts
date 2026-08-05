import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/variables" as *;\n`
      }
    }
  }
})