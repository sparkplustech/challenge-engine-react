import { useState, type FormEvent } from 'react'
import type { Task } from './TaskList'
import Button from './Button'
import FormInput from './FormInput'

interface TaskFormProps {
  onAddTask: (task: Task) => void
  categories?: string[]
  showCategories?: boolean
  showDueDate?: boolean
}

export default function TaskForm({
  onAddTask,
  categories = ['General', 'Work', 'Personal'],
  showCategories = false,
  showDueDate = false,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('General')
  const [tagsText, setTagsText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    onAddTask({
      id: Date.now(),
      title: trimmedTitle,
      description,
      priority,
      completed: false,
      ...(showCategories && {
        category,
        tags: tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
      }),
      ...(showDueDate && dueDate && { dueDate }),
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('General')
    setTagsText('')
    setDueDate('')
    setError('')
  }

  return (
    <form id="task-form" onSubmit={handleSubmit}>
      <FormInput
        id="task-title"
        label="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)
          setError('')
        }}
        error={error}
      />

      <FormInput
        id="task-description"
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {showCategories && (
        <>
          <label htmlFor="task-category-input">Category</label>
          <select
            id="task-category-input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label htmlFor="task-tags-input">Tags (comma-separated)</label>
          <input
            id="task-tags-input"
            type="text"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
          />
        </>
      )}

      {showDueDate && (
        <>
          <label htmlFor="task-due-date-input">Due date</label>
          <input
            id="task-due-date-input"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </>
      )}

      <Button type="submit">Add Task</Button>
    </form>
  )
}
