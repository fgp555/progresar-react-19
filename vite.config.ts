import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // ⬅️ importa path para usar en el alias

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../progresar-distributions/frontend",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ⬅️ alias para @
    },
  },
});
