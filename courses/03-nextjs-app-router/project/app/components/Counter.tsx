'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <section aria-labelledby="counter-heading">
      <h2 id="counter-heading">Interactive counter</h2>
      <p aria-live="polite">Count: {count}</p>
      <button type="button" onClick={() => setCount((currentCount) => currentCount + 1)}>
        Increment
      </button>
    </section>
  )
}
