import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import svgLoader from "vite-svg-loader";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const { VITE_BASE_API } = loadEnv(configEnv.mode, process.cwd());
  return {
    plugins: [
      vue(),
      // eslint(),
      svgLoader(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/icons/svg")],
        symbolId: "[name]",
      }),

      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/styles/main.scss';",
        },
      },
    },
    resolve: {
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".scss",
        ".css",
      ],
      alias: {
        "@": resolve(__dirname, "./src"),
        "@public": resolve(__dirname, "./public"),
      },
    },
    base: "./",
    server: {
      host: true,
      port: 8888,
      open: true,
      cors: true,
      proxy: {
        "/api": {
          target: VITE_BASE_API, // 测试地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      warmup: {
        clientFiles: ["./src/layouts/**/*.vue"],
      },
    },
  };
});
