import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app"],
    port: 8080,
  },
  plugins: [
    react(),
    // Keep critical UI styling in the HTML, even if a cached CSS URL is unavailable.
    {
      name: "inline-app-styles",
      apply: "build",
      enforce: "post",
      generateBundle(_options, bundle) {
        const html = bundle["index.html"];
        if (!html || html.type !== "asset") return;
        html.source = String(html.source).replace(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
          const css = bundle[href.replace(/^\//, "")];
          return css?.type === "asset" ? `<style>${String(css.source).replace(/<\/style/gi, "<\\/style")}</style>` : tag;
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
