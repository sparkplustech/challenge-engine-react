import { useMemo } from 'react'
import { useGetPostsQuery } from '../api/apiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilterUserId, setSortBy } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery()
  const dispatch = useAppDispatch()
  const { filterUserId, sortBy } = useAppSelector((state) => state.filters)

  const visiblePosts = useMemo(() => {
    const filteredPosts = (posts ?? []).filter((post) =>
      filterUserId === null || post.userId === filterUserId,
    )

    return filteredPosts.sort((first, second) =>
      sortBy === 'newest'
        ? second.id - first.id
        : first.id - second.id,
    )
  }, [filterUserId, posts, sortBy])

  const userIds = [...new Set((posts ?? []).map((post) => post.userId))].sort((a, b) => a - b)

  return (
    <section id="posts-with-filters" data-testid="posts-with-filters">
      <div id="filter-controls" data-testid="filter-controls">
        <label htmlFor="post-user-filter">Filter by user</label>
        <select
          id="post-user-filter"
          value={filterUserId ?? ''}
          onChange={(event) => {
            const value = event.target.value
            dispatch(setFilterUserId(value ? Number(value) : null))
          }}
        >
          <option value="">All users</option>
          {userIds.map((userId) => (
            <option key={userId} value={userId}>User {userId}</option>
          ))}
        </select>

        <label htmlFor="post-sort-order">Sort posts</label>
        <select
          id="post-sort-order"
          value={sortBy}
          onChange={(event) => dispatch(setSortBy(
            event.target.value === 'oldest' ? 'oldest' : 'newest',
          ))}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {isLoading && <p role="status">Loading posts...</p>}
      {isError && (
        <p role="alert">
          {'error' in error ? error.error : 'Unable to load posts.'}
        </p>
      )}
      {!isLoading && !isError && (
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id} data-testid="filtered-post">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
