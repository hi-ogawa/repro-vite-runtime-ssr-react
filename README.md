testing vite runtime https://github.com/vitejs/vite/pull/12165 for react ssr app

```sh
pnpm i
pnpm dev
```

_notes_

- hydration mismatch after editing `src/App.tsx` and reload browser
  - client HMR works as before
  - server module tree is not invalidated so server render yields old version, thus hydration mismatch
- editing `src/server.ts` will full reload (ok)
- see https://github.com/hi-ogawa/repro-vite-runtime-ssr-react/pull/1 for quick-and-dirty ssr hmr
