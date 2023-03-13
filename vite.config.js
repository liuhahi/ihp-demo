import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
// import mkcert from "vite-plugin-mkcert";
import esbuild from "rollup-plugin-esbuild";
import { resolve } from "path";

// not generate any newer JavaScript or CSS that Chrome version 100 can't handle.
const esbuildPlugin = () => ({
  ...esbuild({
    target: "chrome100",
    include: /\.vue$/,
    loaders: {
      ".vue": "js",
    },
  }),
  enforce: "post",
  apply: "build",
});

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        fonts: resolve(__dirname, "src/assets/fonts"),
      },
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      vue(),
      esbuildPlugin(),
      splitVendorChunkPlugin(),
    ],
    build: {
      minify: "terser",
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            // const fileName = assetInfo.name.split("/").pop();
            let extType = assetInfo.name.split(".").at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/img/[name][extname]`;
            } else if (/css|scss|less/i.test(extType)) {
              return `assets/css/[hash][extname]`;
            } else if (/otf|ttf/i.test(extType)) {
              return `assets/fonts/[name][extname]`;
            }
            return `assets/${extType}/[name][extname]`;
          },
          chunkFileNames: "assets/js/[hash].js",
          entryFileNames: "assets/js/[hash].js",
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    optimizeDeps: {
      include: ["vue"],
    },
    esbuild: {
      target: "chrome100",
    },
    mode,
  };
});

