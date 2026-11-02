import { useNavigate, useParams } from 'react-router-dom'
import type { Task } from './TaskList'
import Button from './Button'

interface TaskDetailPageProps {
  tasks?: Task[]
}

function readStoredTasks(): Task[] {
  try {
    const storedTasks = window.localStorage.getItem('task-app-tasks')
    if (!storedTasks) return []

    const parsedTasks: unknown = JSON.parse(storedTasks)
    if (!Array.isArray(parsedTasks)) return []

    return parsedTasks.filter((task): task is Task =>
      typeof task === 'object' &&
      task !== null &&
      'id' in task &&
      (typeof task.id === 'number' || typeof task.id === 'string') &&
      'title' in task &&
      typeof task.title === 'string' &&
      'description' in task &&
      typeof task.description === 'string' &&
      'priority' in task &&
      typeof task.priority === 'string' &&
      'completed' in task &&
      typeof task.completed === 'boolean',
    )
  } catch {
    return []
  }
}

export default function TaskDetailPage({ tasks }: TaskDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const task = (tasks ?? readStoredTasks()).find((item) => String(item.id) === id)

  return (
    <main id="task-detail-page">
      <Button
        id="task-detail-back"
        type="button"
        variant="secondary"
        onClick={() => navigate('/challenge/21-react-router')}
      >
        Back to list
      </Button>
      {task ? (
        <article>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          {task.category && <p>Category: {task.category}</p>}
          {task.tags && <p>Tags: {task.tags.join(', ')}</p>}
          {task.dueDate && <p>Due date: {String(task.dueDate)}</p>}
          <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
        </article>
      ) : (
        <p role="status">Task not found.</p>
      )}
    </main>
  )
}
