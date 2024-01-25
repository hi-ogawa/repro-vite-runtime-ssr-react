// runtime part of `ssrHmrPlugin` in `vite.config.ts`

// simple automatic HMR for SSR
// - full reload if export names changed
// - otherwise reassign all exports

// https://github.com/vitejs/vite/pull/12165
// https://github.com/hi-ogawa/js-utils/blob/main/packages/tiny-refresh/src/runtime.ts

const REGISTRY_KEY = Symbol.for("simple-hmr");

export interface ViteHot {
  data: {
    [REGISTRY_KEY]?: Registry;
  };
  accept: (onNewModule: (exports?: unknown) => void) => void;
  invalidate: (message?: string) => void;
}

interface Export {
  value: unknown;
  update: (next: unknown) => void;
}

interface Registry {
  exports: Record<string, Export>;
  // keep reference to first Registry to apply replacement against
  activeExports?: Record<string, Export>;
}

export function createRegistry(): Registry {
  return { exports: {} };
}

function patchRegistry(current: Registry, next: Registry): boolean {
  // keep reference to first replaceers
  const activeExports = current.activeExports ?? current.exports;
  next.activeExports = activeExports;

  // replace all exports or full reload
  const keys = [
    ...new Set([...Object.keys(current.exports), ...Object.keys(next.exports)]),
  ];
  const mismatches = keys.filter(
    (key) => !(key in current.exports && key in next.exports)
  );
  if (mismatches.length > 0) {
    console.log("[simple-hmr] mismatch: ", mismatches.join(", "));
    return false;
  }
  for (const key of keys) {
    console.log("[simple-hmr]", key);
    activeExports[key].update(next.exports[key].value);
  }
  return true;
}

export function setupHot(hot: ViteHot, registry: Registry) {
  hot.data[REGISTRY_KEY] = registry;

  hot.accept((newExports) => {
    const current = hot.data[REGISTRY_KEY];
    const ok = newExports && current && patchRegistry(registry, current);
    if (!ok) {
      hot.invalidate();
    }
  });
}
