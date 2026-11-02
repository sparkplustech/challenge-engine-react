import type { Task } from './TaskList'

interface StatsPanelProps {
  tasks?: Task[]
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({
  tasks,
  total,
  completed,
  active,
  overdue,
  completedPercentage,
}: StatsPanelProps) {
  const taskTotal = total ?? tasks?.length ?? 0
  const taskCompleted = completed ?? tasks?.filter((task) => task.completed).length ?? 0
  const taskActive = active ?? taskTotal - taskCompleted
  const taskOverdue = overdue ?? tasks?.filter((task) => {
    if (task.completed || !task.dueDate) return false
    const due = new Date(task.dueDate)
    if (Number.isNaN(due.getTime())) return false
    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }).length ?? 0
  const percentage = completedPercentage ?? (
    taskTotal === 0 ? 0 : Math.round((taskCompleted / taskTotal) * 100)
  )

  return (
    <section id="stats-panel" aria-label="Task statistics">
      <p>Total: {taskTotal}</p>
      <p>Completed: {taskCompleted} ({percentage}%)</p>
      <div
        role="progressbar"
        aria-label="Task completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        style={{ height: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '999px' }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            borderRadius: 'inherit',
          }}
        />
      </div>
      <p>Active: {taskActive}</p>
      <p>Overdue: {taskOverdue}</p>
    </section>
  )
}
