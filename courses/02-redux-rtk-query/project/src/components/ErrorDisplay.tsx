/**
 * Challenge 12: Error and loading UX. Stub: implement per challenges/12-error-loading-ux/README.md
 */
interface ErrorDisplayProps {
  error?: unknown
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display" id="error-display">
      {error != null && <p>{String(error)}</p>}
      <button type="button" data-testid="retry-btn" onClick={onRetry}>Retry</button>
    </div>
  )
}
