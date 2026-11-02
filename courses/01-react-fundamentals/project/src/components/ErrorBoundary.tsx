import { Component, type ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback" role="alert">
          <p>Something went wrong. Please try again.</p>
          <Button
            id="error-retry"
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
