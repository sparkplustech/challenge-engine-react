import { useCallback } from 'react'
import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First hardcoded task',
    priority: 'High',
    completed: false,
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second hardcoded task',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Third hardcoded task',
    priority: 'Low',
    completed: false,
  },
]

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category?: string
      tags?: string[]
      dueDate?: string | number
    },
  ) => void
  categories?: string[]
  editingId?: string | number | null
  onEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  showCategories?: boolean
  showDueDate?: boolean
  linkToTaskDetail?: boolean
}

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onEdit,
  onCancelEdit,
  showCategories,
  categories,
  showDueDate,
  linkToTaskDetail = false,
}: TaskListProps) {
  const displayedTasks = tasks ?? HARDCODED_TASKS
  const handleToggle = useCallback((id: string | number | undefined) => {
    if (id !== undefined) onToggle?.(id)
  }, [onToggle])

  return (
    <section id="task-list" tabIndex={-1}>
      {countText && <p id="task-count">{countText}</p>}
      {displayedTasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          category={task.category}
          tags={task.tags}
          dueDate={task.dueDate}
          showCategories={showCategories}
          showDueDate={showDueDate}
          categories={categories}
          completed={task.completed}
          onToggle={onToggle ? handleToggle : undefined}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editing={editingId === undefined ? undefined : editingId === task.id}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          linkToTaskDetail={linkToTaskDetail}
        />
      ))}
    </section>
  )
}
