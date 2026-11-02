interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    if ('error' in error && typeof error.error === 'string') return error.error
    if ('message' in error && typeof error.message === 'string') return error.message
  }

  return 'Something went wrong. Please try again.'
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display" role="alert">
      <p>{getErrorMessage(error)}</p>
      {onRetry && (
        <button type="button" data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
