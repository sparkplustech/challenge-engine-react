import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';

describe('Challenge 07: Priority-Based Sorting', () => {
  const UNSORTED = [
    { id: 1, title: 'Low', description: 'D', priority: 'Low', completed: false },
    { id: 2, title: 'High', description: 'D', priority: 'High', completed: false },
    { id: 3, title: 'Medium', description: 'D', priority: 'Medium', completed: false },
  ];

  it('FilterBar or sort control should exist', () => {
    const { container } = render(<FilterBar filter="all" />);
    expect(container.querySelector('#filter-bar')).toBeInTheDocument();
  });

  it('TaskList should render tasks in order provided', () => {
    render(<TaskList tasks={UNSORTED} countText="3 Tasks" />);
    const cards = screen.getAllByRole('heading', { level: 2 });
    expect(cards[0]).toHaveTextContent('Low');
    expect(cards[1]).toHaveTextContent('High');
    expect(cards[2]).toHaveTextContent('Medium');
  });

  it('When tasks sorted High to Low, High appears first', () => {
    const highToLow = [...UNSORTED].sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return (order[a.priority as keyof typeof order] ?? 0) - (order[b.priority as keyof typeof order] ?? 0);
    });
    render(<TaskList tasks={highToLow} countText="3 Tasks" />);
    const cards = screen.getAllByRole('heading', { level: 2 });
    expect(cards[0]).toHaveTextContent('High');
  });
});
