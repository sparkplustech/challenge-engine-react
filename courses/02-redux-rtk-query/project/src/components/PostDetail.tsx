import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId?: number
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { postId: routePostId } = useParams<{ postId: string }>()
  const parsedPostId = routePostId ? Number(routePostId) : undefined
  const id = postId ?? (parsedPostId && Number.isInteger(parsedPostId) && parsedPostId > 0
    ? parsedPostId
    : undefined)
  const useQueryHook = useGetPostByIdQuery(id ?? 0, { skip: id === undefined })
  const { data: post, isLoading, isError, error } = useQueryHook

  if (isLoading) {
    return <p data-testid="post-detail-loading" role="status">Loading post...</p>
  }

  if (isError) {
    const message = 'error' in error ? error.error : 'Unable to load post.'
    return <p data-testid="post-detail-error" role="alert">{message}</p>
  }

  if (!post) return null

  return (
    <article data-testid="post-detail">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p>Post ID: {post.id}</p>
      <p>User ID: {post.userId}</p>
    </article>
  )
}
