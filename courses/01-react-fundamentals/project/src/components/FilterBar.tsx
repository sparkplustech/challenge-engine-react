export type TaskFilter = 'all' | 'active' | 'completed'
export type TaskSortOrder =
  | 'recent'
  | 'priority-desc'
  | 'priority-asc'
  | 'alphabetical'
  | 'due-date'

interface FilterBarProps {
  filter: TaskFilter
  onFilterChange?: (filter: TaskFilter) => void
  sortOrder?: TaskSortOrder
  onSortChange?: (sortOrder: TaskSortOrder) => void
  searchText?: string
  onSearchChange?: (searchText: string) => void
  onClearSearch?: () => void
  showSearch?: boolean
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  showCategoryFilter?: boolean
  showDueDateSort?: boolean
}

const FILTERS: TaskFilter[] = ['all', 'active', 'completed']

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder = 'recent',
  onSortChange,
  searchText = '',
  onSearchChange,
  onClearSearch,
  showSearch = false,
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  showCategoryFilter = false,
  showDueDateSort = false,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <div id="filter-bar">
      {FILTERS.map((filterOption) => (
        <Button
          key={filterOption}
          type="button"
          data-active={filter === filterOption ? 'true' : 'false'}
          aria-pressed={filter === filterOption}
          onClick={() => onFilterChange?.(filterOption)}
        >
          {filterOption[0].toUpperCase() + filterOption.slice(1)}
        </Button>
      ))}
      {showCategoryFilter && (
        <>
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onCategoryChange?.(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </>
      )}
      <label htmlFor="sort-order">Sort by</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) => onSortChange?.(event.target.value as TaskSortOrder)}
      >
        <option value="recent">Recently Added</option>
        <option value="priority-desc">Priority: High to Low</option>
        <option value="priority-asc">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
        {showDueDateSort && <option value="due-date">Due Date (Soonest First)</option>}
      </select>
      {showSearch && (
        <>
          <FormInput
            id="search-input"
            label="Search tasks"
            value={searchText}
            onChange={(event) => onSearchChange?.(event.target.value)}
            inputRef={searchInputRef}
          />
          {searchText && (
            <Button id="clear-search" type="button" variant="secondary" onClick={onClearSearch}>
              Clear search
            </Button>
          )}
        </>
      )}
    </div>
  )
}
import { useEffect, useRef } from 'react'
import Button from './Button'
import FormInput from './FormInput'
