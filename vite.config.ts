import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  let origin = "";
  if (mode === "development") {
    origin = `http://${env.VITE_APP_HOST}:${env.VITE_APP_PORT}`;
  }

  return {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    css: {
      modules: {
        generateScopedName: "[path][name]__[local]--[hash:base64:5]",
      },
    },
    plugins: [
      react(),
      // createHtmlPlugin({
      //   minify: true,
      //   /**
      //    * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
      //    * @default src/main.ts
      //    */
      //   entry: "/src/main.tsx",
      //   /**
      //    * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
      //    * @default index.html
      //    */
      //   template: "public/index.html",
      //
      //   /**
      //    * Data that needs to be injected into the index.html ejs template
      //    */
      //   inject: {
      //     data: {
      //       title: env.VITE_APP_CNAME,
      //       mountRoot: env.VITE_APP_NAME,
      //     },
      //   },
      // }),
    ],
    server: {
      cors: true,
      port: Number(env.VITE_APP_PORT) ?? 8888,
      origin: origin,
    },
  };
});
