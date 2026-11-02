import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

describe('Challenge 09: Search Functionality', () => {
  const TASKS = [
    { id: 1, title: 'React', description: 'Learn hooks', priority: 'High', completed: false },
    { id: 2, title: 'TypeScript', description: 'Types', priority: 'Medium', completed: false },
  ];

  it('FilterBar should exist for search integration', () => {
    const { container } = render(<FilterBar filter="all" />);
    expect(container.querySelector('#filter-bar')).toBeInTheDocument();
  });

  it('TaskList should filter by provided tasks (search applied upstream)', () => {
    const filtered = TASKS.filter((t) =>
      t.title.toLowerCase().includes('react') || t.description.toLowerCase().includes('react')
    );
    render(<TaskList tasks={filtered} countText="1 of 2 tasks" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  it('searches task title and description without case sensitivity', async () => {
    const user = userEvent.setup();
    render(<TaskApp tasks={TASKS} showFilterBar showSearch />);
    const search = screen.getByRole('textbox', { name: 'Search tasks' });

    await user.type(search, 'LEARN');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 2 tasks')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'tYpEsCrIpT');
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('combines search with the selected status filter and clears search', async () => {
    const user = userEvent.setup();
    render(<TaskApp tasks={TASKS} showFilterBar showSearch />);
    const search = screen.getByRole('textbox', { name: 'Search tasks' });
    await user.type(search, 'learn');
    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.getByText('No tasks found for "learn"')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(search).toHaveValue('');
    expect(screen.getByText('Learn hooks')).toBeInTheDocument();
    expect(document.activeElement).toBe(document.getElementById('task-list'));
  });
});
