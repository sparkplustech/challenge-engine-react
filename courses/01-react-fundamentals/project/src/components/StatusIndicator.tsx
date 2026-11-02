export type TaskStatus = 'overdue' | 'due-today' | 'due-soon' | 'completed'

interface StatusIndicatorProps {
  status: TaskStatus
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  overdue: 'Overdue',
  'due-today': 'Due Today',
  'due-soon': 'Due Soon',
  completed: 'Completed',
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const colors: Record<TaskStatus, string> = {
    overdue: '#b91c1c',
    'due-today': '#a16207',
    'due-soon': '#1d4ed8',
    completed: '#15803d',
  }

  return (
    <span role="status" data-status={status} style={{ color: colors[status], fontWeight: 600 }}>
      {STATUS_LABELS[status]}
    </span>
  )
}
