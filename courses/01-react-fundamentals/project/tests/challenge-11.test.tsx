import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

describe('Challenge 11: useEffect - Debounced Search', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('FilterBar should exist for search/debounce integration', () => {
    const { container } = render(<FilterBar filter="all" />);
    expect(container.querySelector('#filter-bar')).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    const tasks = [{ id: 1, title: 'T', description: 'D', priority: 'High', completed: false }];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows searching until the 300ms debounce completes, then filters results', () => {
    vi.useFakeTimers();
    render(
      <TaskApp
        tasks={[
          { id: 1, title: 'React guide', description: 'Learn components', priority: 'High', completed: false },
          { id: 2, title: 'Types', description: 'TypeScript basics', priority: 'Low', completed: false },
        ]}
        showFilterBar
        showSearch
        showDebouncedSearch
      />,
    );
    const searchInput = screen.getByRole('textbox', { name: 'Search tasks' });

    fireEvent.change(searchInput, { target: { value: 'React' } });
    expect(screen.getByRole('status')).toHaveTextContent('Searching...');
    expect(screen.getByText('Types')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('React guide')).toBeInTheDocument();
    expect(screen.queryByText('Types')).not.toBeInTheDocument();
  });

  it('clears the previous timeout when the search changes again', () => {
    vi.useFakeTimers();
    render(
      <TaskApp
        tasks={[
          { id: 1, title: 'React guide', description: 'Learn components', priority: 'High', completed: false },
          { id: 2, title: 'Types', description: 'TypeScript basics', priority: 'Low', completed: false },
        ]}
        showFilterBar
        showSearch
        showDebouncedSearch
      />,
    );
    const searchInput = screen.getByRole('textbox', { name: 'Search tasks' });

    fireEvent.change(searchInput, { target: { value: 'React' } });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.change(searchInput, { target: { value: 'Types' } });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('React guide')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.queryByText('React guide')).not.toBeInTheDocument();
  });
});
