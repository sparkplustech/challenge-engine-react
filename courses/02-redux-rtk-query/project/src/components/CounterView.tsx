/**
 * Challenge 03: Reading and Dispatching.
 * Stub: implement per challenges/03-reading-dispatching/README.md
 */
export default function CounterView() {
  return (
    <div id="counter-view" data-testid="counter-view">
      <span data-testid="counter-value">0</span>
      <button type="button" data-testid="increment-btn">
        Increment
      </button>
      <button type="button" data-testid="decrement-btn">
        Decrement
      </button>
    </div>
  )
}
