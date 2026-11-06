import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

const challenges = [
  { id: '01-static-task-display', name: 'Static Task Display', route: '/challenge/01-static-task-display' },
  { id: '02-dynamic-task-rendering', name: 'Dynamic Task Rendering', route: '/challenge/02-dynamic-task-rendering' },
  { id: '03-adding-new-tasks', name: 'Adding New Tasks', route: '/challenge/03-adding-new-tasks' },
  { id: '04-task-completion-toggle', name: 'Task Completion Toggle', route: '/challenge/04-task-completion-toggle' },
  { id: '05-task-deletion', name: 'Task Deletion', route: '/challenge/05-task-deletion' },
  { id: '06-task-filtering', name: 'Task Filtering', route: '/challenge/06-task-filtering' },
  { id: '07-priority-based-sorting', name: 'Priority-Based Sorting', route: '/challenge/07-priority-based-sorting' },
  { id: '08-task-editing', name: 'Task Editing', route: '/challenge/08-task-editing' },
  { id: '09-search-functionality', name: 'Search Functionality', route: '/challenge/09-search-functionality' },
  { id: '10-useeffect-local-storage', name: 'useEffect - Local Storage Persistence', route: '/challenge/10-useeffect-local-storage' },
  { id: '11-useeffect-debounced-search', name: 'useEffect - Debounced Search', route: '/challenge/11-useeffect-debounced-search' },
  { id: '12-categories-and-tags', name: 'Categories and Tags', route: '/challenge/12-categories-and-tags' },
  { id: '13-due-dates-and-sorting', name: 'Due Dates and Sorting', route: '/challenge/13-due-dates-and-sorting' },
  { id: '14-task-statistics-dashboard', name: 'Task Statistics Dashboard', route: '/challenge/14-task-statistics-dashboard' },
  { id: '15-component-organization', name: 'Component Organization with Props', route: '/challenge/15-component-organization' },
  { id: '16-context-api-theme', name: 'Context API - Theme Management', route: '/challenge/16-context-api-theme' },
  { id: '17-custom-hook-uselocalstorage', name: 'Custom Hook - useLocalStorage', route: '/challenge/17-custom-hook-uselocalstorage' },
  { id: '18-usereducer-complex-state', name: 'useReducer - Complex State Management', route: '/challenge/18-usereducer-complex-state' },
  { id: '19-performance-optimization', name: 'Performance Optimization', route: '/challenge/19-performance-optimization' },
  { id: '20-error-boundaries', name: 'Error Boundaries and Error Handling', route: '/challenge/20-error-boundaries' },
  { id: '21-react-router', name: 'React Router - Routing and Navigation', route: '/challenge/21-react-router' },
  { id: '22-data-fetching', name: 'Data Fetching - Loading and Error State', route: '/challenge/22-data-fetching' },
  { id: '23-useref-focus-management', name: 'useRef - Focus Management', route: '/challenge/23-useref-focus-management' },
]

export default function ChallengeList() {
  const themeContext = useContext(ThemeContext)
  return (
    <div style={{ padding: '1rem' }} data-theme={themeContext?.theme}>
      <h2>Challenges</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
        {challenges.map((c) => (
          <li key={c.id} style={{ marginBottom: '0.75rem' }}>
            <span>{c.name}</span>
            {' — '}
            <Link to={c.route}>View Output</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
