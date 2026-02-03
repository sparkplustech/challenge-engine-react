import { useState, FormEvent } from 'react'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
}

export default function TaskForm(props: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required')
      return
    }
    props.onAddTask?.({
      id: String(Date.now()),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
      />
      <label htmlFor="task-description">Description</label>
      <input
        id="task-description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      {error && <p id="task-form-error">{error}</p>}
      <button type="submit">Add Task</button>
    </form>
  )
}
