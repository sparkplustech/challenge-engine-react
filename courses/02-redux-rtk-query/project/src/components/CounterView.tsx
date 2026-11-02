import { decrement, increment } from '../store/slices/counterSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function CounterView() {
  const count = useAppSelector((state) => state.counter)
  const dispatch = useAppDispatch()

  return (
    <div id="counter-view" data-testid="counter-view">
      <p data-testid="counter-value">{count}</p>
      <button
        type="button"
        data-testid="increment-btn"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button
        type="button"
        data-testid="decrement-btn"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
    </div>
  )
}
