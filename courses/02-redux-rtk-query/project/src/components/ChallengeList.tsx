import './ChallengeList.css'
import { Link } from 'react-router-dom'

const CHALLENGES = [
  { id: '01-store-setup', name: 'Store Setup with configureStore', difficulty: 'Beginner', description: 'Set up Redux store and Provider', route: '/challenge/01-store-setup' },
  { id: '02-first-slice', name: 'First Slice with createSlice', difficulty: 'Beginner', description: 'Create counter slice and add to store', route: '/challenge/02-first-slice' },
  { id: '03-reading-dispatching', name: 'Reading and Dispatching', difficulty: 'Beginner', description: 'Use useSelector and useDispatch in components', route: '/challenge/03-reading-dispatching' },
  { id: '04-multiple-slices', name: 'Multiple Slices', difficulty: 'Beginner', description: 'Add second slice (UI) to store', route: '/challenge/04-multiple-slices' },
  { id: '05-async-thunks', name: 'Async Logic with createAsyncThunk', difficulty: 'Intermediate', description: 'Fetch users with thunk and extraReducers', route: '/challenge/05-async-thunks' },
  { id: '06-rtk-query-setup', name: 'RTK Query Setup', difficulty: 'Intermediate', description: 'Create API slice and add to store', route: '/challenge/06-rtk-query-setup' },
  { id: '07-queries', name: 'Query Endpoints and useQuery', difficulty: 'Intermediate', description: 'Use useGetUsersQuery and display users', route: '/challenge/07-queries' },
  { id: '08-caching-refetch', name: 'Caching and Cache Tags', difficulty: 'Intermediate', description: 'providesTags and invalidatesTags', route: '/challenge/08-caching-refetch' },
  { id: '09-mutations', name: 'Mutations with useMutation', difficulty: 'Intermediate', description: 'Add mutation and form with useMutation', route: '/challenge/09-mutations' },
  { id: '10-optimistic-updates', name: 'Optimistic Updates', difficulty: 'Intermediate', description: 'Optimistic cache update and rollback', route: '/challenge/10-optimistic-updates' },
  { id: '11-api-local-state', name: 'API and Local State Together', difficulty: 'Intermediate', description: 'Filter/sort slice + RTK Query list', route: '/challenge/11-api-local-state' },
  { id: '12-error-loading-ux', name: 'Error and Loading UX', difficulty: 'Intermediate', description: 'ErrorDisplay, refetch, loading indicators', route: '/challenge/12-error-loading-ux' },
]

export default function ChallengeList() {
  return (
    <div className="challenge-list">
      <h2>Redux & RTK Query Challenges</h2>
      <p>Complete challenges 01–12 in sequence.</p>
      <div className="challenges-grid">
        {CHALLENGES.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <h3>{challenge.name}</h3>
              <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-actions">
              <Link to={challenge.route} className="btn btn-primary">View Challenge UI</Link>
              <a href={`./challenges/${challenge.id}/README.md`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Read Instructions</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
