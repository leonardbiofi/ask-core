import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AskCore",
      formats: ["es", "cjs"], // both ESM and CJS
      fileName: (format) => `ask-core.${format}.js`,
    },
    rollupOptions: {
      external: ["axios"], // don't bundle axios
    },
  },
});
