import { useState } from 'react'
import { AppDep1, AppDep2 } from './AppDep'

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
      <div>
        <AppDep1 />
        <AppDep2 />
      </div>
    </>
  )
}
