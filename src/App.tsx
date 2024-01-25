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

// TODO: implement as transform plugin
if (import.meta.env.SSR && import.meta.hot) {
  const $$hmr = await import("./hmr");
  const $$registry = $$hmr.createRegistry();

  $$registry.exports["App"] = {
    value: App,
    update: ($$next) => {
      // @ts-ignore
      App = $$next;
    }
  };

  $$hmr.setupHot(import.meta.hot, $$registry);
}
