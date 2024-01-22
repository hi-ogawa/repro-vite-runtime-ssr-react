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
      <p>When using ViteRuntime, hydration error after edit 'src/App.tsx' and reload.</p>
      <p>Editing 'src/server.ts' will full reload.</p>
    </>
  )
}
