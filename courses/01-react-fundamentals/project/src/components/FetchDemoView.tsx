import { useEffect, useState } from 'react'

interface Todo {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [items, setItems] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTodos() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/todos.json', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every((item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'number' &&
          typeof item.title === 'string',
        )) {
          throw new Error('The server returned invalid todo data.')
        }

        setItems(data)
      } catch (fetchError) {
        if (controller.signal.aborted) return
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load todos.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadTodos()
    return () => controller.abort()
  }, [])

  if (loading) return <p id="fetch-loading" role="status">Loading...</p>
  if (error) return <p id="fetch-error" role="alert">{error}</p>

  return (
    <ul id="fetch-list">
      {items.map((item) => <li key={item.id}>{item.title}</li>)}
    </ul>
  )
}
