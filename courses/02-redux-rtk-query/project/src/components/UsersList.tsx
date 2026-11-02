import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const useQueryHook = useGetUsersQuery()
  const { data: users, isLoading, isError, error, refetch } = useQueryHook

  if (isLoading) {
    return <p id="users-loading" data-testid="users-loading" role="status">Loading users...</p>
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <ul id="users-list" data-testid="users-list">
      {users?.map((user) => (
        <li key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </li>
      ))}
    </ul>
  )
}
