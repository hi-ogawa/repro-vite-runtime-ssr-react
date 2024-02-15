import {
  defineConfig,
  type Plugin,
  type Connect,
  createViteRuntime,
} from "vite";
import react from "@vitejs/plugin-react";
import { vitePluginSimpleHmr } from "@hiogawa/vite-plugin-simple-hmr";

export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    vitePluginSimpleHmr({ include: ["**/App.tsx"] }),
    devPlugin({
      entry: "/src/server.ts",
      useViteRuntime: true,
    }),
  ],
});

// vavite style dev server with ViteRuntime.executeEntrypoint
// https://github.com/hi-ogawa/vite-plugins/pull/156
function devPlugin({
  entry,
  useViteRuntime,
}: {
  entry: string;
  useViteRuntime?: boolean;
}): Plugin {
  return {
    name: devPlugin.name,

    apply: "serve",

    async configureServer(server) {
      // expose viteDevServer
      globalThis.__viteDevServer = server;

      // switch module loader
      let loadModule = server.ssrLoadModule;
      if (useViteRuntime) {
        const runtime = await createViteRuntime(server);
        loadModule = runtime.executeEntrypoint.bind(runtime);
      }

      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          const mod = await loadModule(entry);
          await mod["default"](req, res, next);
        } catch (e) {
          next(e);
        }
      };
      return () => server.middlewares.use(handler);
    },
  };
}
