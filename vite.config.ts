import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist/netlify/functions",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "main",
      fileName: "main",
    },
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
