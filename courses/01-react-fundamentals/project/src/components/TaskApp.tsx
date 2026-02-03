import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

function getCountText(tasks: Task[] = [], countFormat?: string): string {
  if (countFormat === 'completed') {
    const completed = tasks.filter((t) => t.completed).length
    return `${completed} of ${tasks.length} completed`
  }
  return `${tasks.length} Tasks`
}

export default function TaskApp(props: TaskAppProps) {
  const { tasks = [], setTasks, showForm, countFormat } = props
  const countText = getCountText(tasks, countFormat)

  const handleAddTask = (task: Record<string, unknown>) => {
    if (!setTasks) return
    const newTask: Task = {
      id: String(Date.now()),
      title: (task.title as string) ?? '',
      description: (task.description as string) ?? '',
      priority: (task.priority as string) ?? 'Medium',
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleToggle = (id: string | number) => {
    if (!setTasks) return
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      <TaskList
        tasks={tasks}
        countText={countText}
        onToggle={tasks.length ? handleToggle : undefined}
        onDelete={props.onDelete}
        linkToTaskDetail={props.linkToTaskDetail}
      />
    </>
  )
}
