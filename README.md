Testing [`ViteRuntime`](https://github.com/vitejs/vite/discussions/15774) for React SSR app.

```sh
pnpm i
pnpm dev
```

_Notes_

- With the official React plugin, hydration mismatch occurs on next SSR after editing `src/App.tsx`:
  - client HMR works same as before
  - server module is not invalidated so next SSR and hydration don't match
- I created `[@hiogawa/vite-plugin-simple-hmr]`(https://github.com/hi-ogawa/vite-plugins/tree/main/packages/vite-plugin-simple-hmr)
  to update server modules and it seems to solve hydration issue of `.tsx` files.
