import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task } from './TaskList'
import { addTask, toggleTask, updateTask, type TaskAction } from '../reducers/taskReducer'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import StatsPanel from './StatsPanel'
import FilterBar, { type TaskFilter, type TaskSortOrder } from './FilterBar'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import { useTheme } from '../contexts/ThemeContext'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: Dispatch<TaskAction>
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showSearch?: boolean
  showDebouncedSearch?: boolean
  enableCategories?: boolean
  enableDueDate?: boolean
  enableTaskEditing?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
  errorBoundary?: boolean
}

export default function TaskApp({
  tasks,
  setTasks,
  dispatch,
  showForm = false,
  countFormat = 'tasks',
  showFilterBar = false,
  showSearch = false,
  showDebouncedSearch = false,
  enableCategories = false,
  enableDueDate = false,
  enableTaskEditing = false,
  showStatsPanel = false,
  onDelete,
  linkToTaskDetail = false,
  errorBoundary = false,
}: TaskAppProps) {
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>('recent')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { theme, toggleTheme } = useTheme()

  const { categories, categoryOptions } = useMemo(() => {
    const taskCategories = [...new Set(
      (tasks ?? [])
        .map((task) => task.category || 'General')
        .filter(Boolean),
    )]
    if (!taskCategories.includes('General')) taskCategories.unshift('General')

    return {
      categories: taskCategories,
      categoryOptions: [...new Set(['General', 'Work', 'Personal', ...taskCategories])],
    }
  }, [tasks])

  useEffect(() => {
    if (!showDebouncedSearch) return

    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchText, showDebouncedSearch])

  useEffect(() => {
    if (!enableCategories || !setTasks) return

    setTasks((previousTasks) => {
      const normalizedTasks = previousTasks.map((task) => ({
        ...task,
        category: task.category || 'General',
        tags: Array.isArray(task.tags) ? task.tags : [],
      }))
      const needsNormalization = previousTasks.some(
        (task, index) =>
          task.category !== normalizedTasks[index].category ||
          !Array.isArray(task.tags),
      )
      return needsNormalization ? normalizedTasks : previousTasks
    })
  }, [enableCategories, setTasks])

  const completedCount = tasks?.filter((task) => task.completed).length ?? 0
  const totalCount = tasks?.length ?? 0
  const taskStats = useMemo(() => {
    const currentTasks = tasks ?? []
    const completed = currentTasks.filter((task) => task.completed).length
    const overdue = currentTasks.filter((task) => {
      if (task.completed || !task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      if (Number.isNaN(dueDate.getTime())) return false
      const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return dueDay < today
    }).length

    return {
      total: currentTasks.length,
      completed,
      active: currentTasks.length - completed,
      overdue,
      completedPercentage: currentTasks.length === 0
        ? 0
        : Math.round((completed / currentTasks.length) * 100),
    }
  }, [tasks])
  const effectiveSearchText = showDebouncedSearch ? debouncedSearchText : searchText
  const query = showSearch ? effectiveSearchText.trim().toLocaleLowerCase() : ''
  const visibleTasks = useMemo(() => {
    if (!tasks) return undefined

    return tasks
      .filter((task) => {
        if (filter === 'active' && task.completed) return false
        if (filter === 'completed' && !task.completed) return false
        if (enableCategories && selectedCategory && (task.category || 'General') !== selectedCategory) {
          return false
        }
        return (
          task.title.toLocaleLowerCase().includes(query) ||
          task.description.toLocaleLowerCase().includes(query)
        )
      })
      .slice()
      .sort((first, second) => {
        if (sortOrder === 'due-date') {
          if (!first.dueDate && !second.dueDate) return 0
          if (!first.dueDate) return 1
          if (!second.dueDate) return -1
          return new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime()
        }

        if (sortOrder === 'priority-desc' || sortOrder === 'priority-asc') {
          const priorityRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
          const direction = sortOrder === 'priority-desc' ? -1 : 1
          return direction * (
            (priorityRank[first.priority] ?? 0) - (priorityRank[second.priority] ?? 0)
          )
        }

        if (sortOrder === 'alphabetical') {
          return first.title.localeCompare(second.title, undefined, { sensitivity: 'base' })
        }

        return 0
      })
  }, [tasks, filter, enableCategories, selectedCategory, query, sortOrder])

  const countText = showFilterBar
    ? tasks
      ? `Showing ${visibleTasks?.length ?? 0} of ${totalCount} tasks`
      : undefined
    : countFormat === 'completed'
      ? tasks
        ? `${completedCount} of ${totalCount} completed`
        : undefined
      : tasks
        ? `${totalCount} Tasks`
        : undefined

  const handleAddTask = useCallback((task: Task) => {
    if (setTasks) {
      setTasks((previousTasks) => [...previousTasks, task])
      return
    }

    if (dispatch) {
      dispatch(addTask(task))
      return
    }

    throw new Error('TaskApp requires setTasks or dispatch to add a task')
  }, [dispatch, setTasks])

  const handleToggleTask = useCallback((taskId: string | number) => {
    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      )
      return
    }

    if (dispatch) {
      dispatch(toggleTask(taskId))
      return
    }

    throw new Error('TaskApp requires setTasks or dispatch to toggle a task')
  }, [dispatch, setTasks])

  const handleUpdateTask = useCallback((
    taskId: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category?: string
      tags?: string[]
      dueDate?: string | number
    },
  ) => {
    if (!updates.title.trim()) return

    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates, title: updates.title.trim() } : task,
        ),
      )
      return
    }

    if (dispatch) {
      dispatch(updateTask(taskId, { ...updates, title: updates.title.trim() }))
      return
    }

    throw new Error('TaskApp requires setTasks or dispatch to update a task')
  }, [dispatch, setTasks])
  const handleClearSearch = useCallback(() => {
    setSearchText('')
    document.getElementById('task-list')?.focus()
  }, [])
  const handleCancelEdit = useCallback(() => setEditingId(null), [])

  return (
    <>
      <Button
        id="theme-toggle"
        type="button"
        variant="secondary"
        onClick={toggleTheme}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </Button>
      {showStatsPanel && <StatsPanel {...taskStats} />}
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
          categories={categoryOptions}
          showCategories={enableCategories}
          showDueDate={enableDueDate}
        />
      )}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showCategoryFilter={enableCategories}
          showDueDateSort={enableDueDate}
          searchText={searchText}
          onSearchChange={setSearchText}
          showSearch={showSearch}
          onClearSearch={handleClearSearch}
        />
      )}
      {showDebouncedSearch && searchText !== debouncedSearchText && (
        <p id="searching-indicator" role="status">Searching...</p>
      )}
      {showFilterBar && visibleTasks?.length === 0 && (
        <p id="filter-empty-message">
          {showSearch && searchText.trim()
            ? `No tasks found for "${searchText.trim()}"`
            : 'No tasks match this filter'}
        </p>
      )}
      {errorBoundary ? (
        <ErrorBoundary>
          <TaskList
            tasks={showFilterBar ? visibleTasks : tasks}
            countText={countText}
            onToggle={handleToggleTask}
            onDelete={onDelete}
            onUpdateTask={enableTaskEditing ? handleUpdateTask : undefined}
            editingId={editingId}
            onEdit={setEditingId}
            onCancelEdit={handleCancelEdit}
            showCategories={enableCategories}
            categories={categories}
            showDueDate={enableDueDate}
            linkToTaskDetail={linkToTaskDetail}
          />
        </ErrorBoundary>
      ) : (
        <TaskList
          tasks={showFilterBar ? visibleTasks : tasks}
          countText={countText}
          onToggle={handleToggleTask}
          onDelete={onDelete}
          onUpdateTask={enableTaskEditing ? handleUpdateTask : undefined}
          editingId={editingId}
          onEdit={setEditingId}
          onCancelEdit={handleCancelEdit}
          showCategories={enableCategories}
          categories={categories}
          showDueDate={enableDueDate}
          linkToTaskDetail={linkToTaskDetail}
        />
      )}
    </>
  )
}
