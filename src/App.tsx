import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

// quick-and-dirty HMR for SSR?
if (import.meta.env.SSR && import.meta.hot) {
  // setup proxy to latest module via globalThis
  (globalThis as any).__ssrHmrApp = App;
  // @ts-ignore
  App = function(...args: any[]) {
    return (globalThis as any).__ssrHmrApp(...args)
  }
  import.meta.hot.accept();
}
