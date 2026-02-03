interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard({ title, description, priority, completed, onToggle, taskId }: TaskCardProps) {
  return (
    <article id="task-card">
      {onToggle != null && taskId != null && (
        <input
          type="checkbox"
          role="checkbox"
          checked={completed ?? false}
          onChange={() => onToggle(taskId)}
          aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
        />
      )}
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Priority: {priority}</p>
    </article>
  )
}
