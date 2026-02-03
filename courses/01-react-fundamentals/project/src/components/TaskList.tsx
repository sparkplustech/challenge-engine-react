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

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const STATIC_TASKS = [
  { title: 'Task One', description: 'First hardcoded task', priority: 'High' },
  { title: 'Task Two', description: 'Second hardcoded task', priority: 'Medium' },
  { title: 'Task Three', description: 'Third hardcoded task', priority: 'Low' },
]

export default function TaskList(props: TaskListProps) {
  const tasksToShow = props.tasks?.length
    ? props.tasks
    : STATIC_TASKS.map((t, i) => ({
        id: i + 1,
        title: t.title,
        description: t.description,
        priority: t.priority,
        completed: false,
      }))

  return (
    <section id="task-list">
      {props.countText != null && props.countText !== '' && (
        <p id="task-count">{props.countText}</p>
      )}
      {tasksToShow.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={props.onToggle}
          taskId={task.id}
        />
      ))}
    </section>
  )
}
