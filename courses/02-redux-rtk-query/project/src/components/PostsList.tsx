import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery()

  if (isLoading) {
    return <p data-testid="posts-loading" role="status">Loading posts...</p>
  }

  if (isError) {
    const message = 'error' in error ? error.error : 'Unable to load posts.'
    return <p data-testid="posts-error" role="alert">{message}</p>
  }

  return (
    <ul id="posts-list" data-testid="posts-list">
      {posts?.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
