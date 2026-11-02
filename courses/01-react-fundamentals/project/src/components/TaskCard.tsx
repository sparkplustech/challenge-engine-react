import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator, { type TaskStatus } from './StatusIndicator'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  category?: string
  tags?: string[]
  dueDate?: string | number
  showDueDate?: boolean
  showCategories?: boolean
  completed?: boolean
  onToggle?: (id: string | number | undefined) => void
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
  editing?: boolean
  onEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  id?: string | number
  taskId?: string | number
  linkToTaskDetail?: boolean
}

function TaskCard({
  title,
  description,
  priority,
  category,
  tags = [],
  dueDate,
  showDueDate = false,
  showCategories = false,
  completed = false,
  onToggle,
  onDelete,
  onUpdateTask,
  categories = ['General', 'Work', 'Personal'],
  editing,
  onEdit,
  onCancelEdit,
  id,
  taskId,
  linkToTaskDetail = false,
}: TaskCardProps) {
  const isCompleted = Boolean(completed)
  const dueDateValue = dueDate === undefined ? undefined : new Date(dueDate)
  const dueDateKey = dueDateValue && Number.isNaN(dueDateValue.getTime())
    ? undefined
    : dueDateValue?.toISOString().slice(0, 10)
  const todayKey = new Date().toISOString().slice(0, 10)
  const daysUntilDue = dueDateKey
    ? Math.floor((Date.parse(`${dueDateKey}T00:00:00Z`) - Date.parse(`${todayKey}T00:00:00Z`)) / 86400000)
    : undefined
  const dueLabel = daysUntilDue === undefined
    ? ''
    : daysUntilDue < 0 && !isCompleted
      ? 'Overdue'
      : daysUntilDue === 0
        ? 'Due Today'
        : daysUntilDue <= 3
          ? 'Due Soon'
          : ''
  const dueStatus: TaskStatus | undefined = dueLabel === 'Overdue'
    ? 'overdue'
    : dueLabel === 'Due Today'
      ? 'due-today'
      : dueLabel === 'Due Soon'
        ? 'due-soon'
        : undefined
  const taskKey = id ?? taskId
  const [localEditing, setLocalEditing] = useState(false)
  const [draft, setDraft] = useState({
    title,
    description,
    priority,
    category: category || 'General',
    tags: tags.join(', '),
    dueDate: dueDate ? String(dueDate).slice(0, 10) : '',
  })
  const isEditing = editing ?? localEditing

  const startEditing = () => {
    setDraft({
      title,
      description,
      priority,
      category: category || 'General',
      tags: tags.join(', '),
      dueDate: dueDate ? String(dueDate).slice(0, 10) : '',
    })
    if (taskKey !== undefined && onEdit) {
      onEdit(taskKey)
    } else {
      setLocalEditing(true)
    }
  }

  const cancelEditing = () => {
    setDraft({
      title,
      description,
      priority,
      category: category || 'General',
      tags: tags.join(', '),
      dueDate: dueDate ? String(dueDate).slice(0, 10) : '',
    })
    if (onCancelEdit) {
      onCancelEdit()
    } else {
      setLocalEditing(false)
    }
  }

  const saveEditing = () => {
    if (!draft.title.trim() || taskKey === undefined) return

    onUpdateTask?.(taskKey, {
      title: draft.title.trim(),
      description: draft.description,
      priority: draft.priority,
      ...(showCategories && {
        category: draft.category,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      }),
      ...(showDueDate && { dueDate: draft.dueDate || undefined }),
    })
    if (onCancelEdit) {
      onCancelEdit()
    } else {
      setLocalEditing(false)
    }
  }

  const handleDelete = () => {
    if (taskKey !== undefined && window.confirm('Are you sure?')) {
      onDelete?.(taskKey)
    }
  }

  return (
    <article
      id="task-card"
      data-completed={isCompleted ? 'true' : 'false'}
      style={
        isCompleted
          ? {
              backgroundColor: '#f3f4f6',
              borderLeft: '4px solid #22c55e',
              paddingLeft: '12px',
            }
          : undefined
      }
    >
      {!isEditing ? (
        <>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onToggle && (
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggle(taskKey)}
              />
            )}
            {linkToTaskDetail && taskKey !== undefined ? (
              <Link to={`/challenge/21-react-router/task/${encodeURIComponent(String(taskKey))}`}>
                <h2 style={{ textDecoration: isCompleted ? 'line-through' : 'none', margin: 0 }}>
                  {title}
                </h2>
              </Link>
            ) : (
              <h2 style={{ textDecoration: isCompleted ? 'line-through' : 'none', margin: 0 }}>
                {title}
              </h2>
            )}
          </label>
          <p style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {description}
          </p>
          <p><Badge variant="priority">Priority: {priority}</Badge></p>
          {showDueDate && (
            <p
              id="task-due-date"
              data-overdue={daysUntilDue !== undefined && daysUntilDue < 0 && !isCompleted ? 'true' : 'false'}
              style={daysUntilDue !== undefined && daysUntilDue < 0 && !isCompleted
                ? { color: '#b91c1c', fontWeight: 'bold' }
                : undefined}
            >
              {dueDateValue && dueDateKey && !Number.isNaN(dueDateValue.getTime())
                ? dueDateValue.toLocaleDateString()
                : 'No due date'}
              {dueStatus && <> - <StatusIndicator status={dueStatus} /></>}
            </p>
          )}
          {showCategories && (
            <>
              <p id="task-category"><Badge variant="category">{category || 'General'}</Badge></p>
              <div id="task-tags">
                {tags.map((tag) => (
                  <Badge key={tag} variant="tag" data-tag={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
          {showDueDate && (
            <label>
              Due date
              <input
                type="date"
                aria-label="Edit due date"
                value={draft.dueDate}
                onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
              />
            </label>
          )}
        </>
      ) : (
        <div>
          <label>
            Title
            <input
              aria-label="Edit title"
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              aria-label="Edit description"
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </label>
          <label>
            Priority
            <select
              aria-label="Edit priority"
              value={draft.priority}
              onChange={(event) => setDraft({ ...draft, priority: event.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          {showCategories && (
            <>
              <label>
                Category
                <select
                  aria-label="Edit category"
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Tags
                <input
                  aria-label="Edit tags"
                  value={draft.tags}
                  onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                />
              </label>
            </>
          )}
          <Button type="button" onClick={saveEditing}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={cancelEditing}>
            Cancel
          </Button>
        </div>
      )}
      {!isEditing && onUpdateTask && taskKey !== undefined && (
        <Button type="button" onClick={startEditing}>
          Edit
        </Button>
      )}
      {onDelete && taskKey !== undefined && (
        <Button type="button" variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </article>
  )
}

export default React.memo(TaskCard)
