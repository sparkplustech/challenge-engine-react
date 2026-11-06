interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard(_props: TaskCardProps) {
  return (
    <article id="task-card">
      <p>Implement: display title, description, and priority from props</p>
    </article>
  )
}
