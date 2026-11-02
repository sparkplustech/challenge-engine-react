import { useState, type FormEvent } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading, isError, error, isSuccess }] = useAddPostMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle || !body.trim()) return

    try {
      await addPost({ userId: 1, title: trimmedTitle, body: body.trim() }).unwrap()
      setTitle('')
      setBody('')
    } catch {
      // Mutation error is rendered from RTK Query state.
    }
  }

  const errorMessage = isError && error && 'error' in error
    ? error.error
    : 'Unable to add post.'

  return (
    <form id="add-post-form" data-testid="add-post-form" onSubmit={handleSubmit}>
      <label htmlFor="post-title">Title</label>
      <input
        id="post-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <label htmlFor="post-body">Body</label>
      <textarea
        id="post-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
      />
      <button type="submit" data-testid="add-post-submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
      {isError && <p role="alert">{errorMessage}</p>}
      {isSuccess && <p role="status">Post added successfully.</p>}
    </form>
  )
}
