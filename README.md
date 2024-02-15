Testing [`ViteRuntime`](https://github.com/vitejs/vite/discussions/15774) for React SSR app.

```sh
pnpm i
pnpm dev
```

_notes_

- hydration mismatch after editing `src/App.tsx` and reload browser
  - client HMR works same as before
  - server module is not invalidated so next SSR and hydration don't match
