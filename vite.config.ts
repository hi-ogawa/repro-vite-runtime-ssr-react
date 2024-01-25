import {
  defineConfig,
  type Plugin,
  type Connect,
  FilterPattern,
  createFilter,
} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    ssrHmrPlugin({
      include: ["**/src/**/*.tsx"],
    }),
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
        const vite: any = await import("vite");
        const runtime = await vite.createViteRuntime(server);
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

function ssrHmrPlugin(pluginOpts: {
  include?: FilterPattern;
  exclude?: FilterPattern;
}): Plugin {
  const filter = createFilter(
    pluginOpts.include,
    pluginOpts.exclude ?? ["**/node_modules/**"]
  );

  return {
    name: ssrHmrPlugin.name,

    apply: "serve",

    transform(code, id, options) {
      if (options.ssr && filter(id)) {
        return ssrHmrTransform(code);
      }
      return;
    },
  };
}

function ssrHmrTransform(code: string): string {
  // TODO: use vite/rollup parser
  // TODO: replace `export const` with `export let` for reassignment
  // TODO: magic-string + sourcemap

  // extract named exports
  const matches = code.matchAll(/export\s+(function|let)\s+(\w+)\b/g);
  const exportNames = Array.from(matches).map((m) => m[2]);

  if (exportNames.length === 0) {
    return undefined;
  }

  // append runtime in footer
  const parts = exportNames.map(
    (name) => `
  $$registry.exports["${name}"] = {
    value: ${name},
    update: ($$next) => {
      ${name} = $$next;
    }
  };
`
  );

  const footer = `
if (import.meta.env.SSR && import.meta.hot) {
  const $$hmr = await import("/src/hmr");
  const $$registry = $$hmr.createRegistry();

${parts.join("\n")}

  $$hmr.setupHot(import.meta.hot, $$registry);
}
`;
  return code + footer;
}
