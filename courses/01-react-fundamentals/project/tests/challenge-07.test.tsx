import { describe, it, expect } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

const getTaskTitles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

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

  it('sort control orders priority high to low, then low to high', async () => {
    const user = userEvent.setup();
    render(<TaskApp tasks={UNSORTED} showFilterBar />);
    const sortOrder = screen.getByRole('combobox', { name: /sort by/i });

    await act(async () => user.selectOptions(sortOrder, 'priority-desc'));
    expect(getTaskTitles()).toEqual(['High', 'Medium', 'Low']);

    await act(async () => user.selectOptions(sortOrder, 'priority-asc'));
    expect(getTaskTitles()).toEqual(['Low', 'Medium', 'High']);
  });

  it('sorts alphabetically without case sensitivity and preserves source order for Recently Added', async () => {
    const user = userEvent.setup();
    const tasks = [
      { ...UNSORTED[0], title: 'zebra' },
      { ...UNSORTED[1], title: 'apple' },
      { ...UNSORTED[2], title: 'Banana' },
    ];
    const originalOrder = tasks.map((task) => task.title);
    render(<TaskApp tasks={tasks} showFilterBar />);
    const sortOrder = screen.getByRole('combobox', { name: /sort by/i });

    await act(async () => user.selectOptions(sortOrder, 'alphabetical'));
    expect(getTaskTitles()).toEqual(['apple', 'Banana', 'zebra']);
    expect(tasks.map((task) => task.title)).toEqual(originalOrder);

    await act(async () => user.selectOptions(sortOrder, 'recent'));
    expect(getTaskTitles()).toEqual(originalOrder);
  });

  it('sorts only the tasks matching the selected filter', async () => {
    const user = userEvent.setup();
    const tasks = [
      { ...UNSORTED[0], title: 'Low active', completed: false },
      { ...UNSORTED[1], title: 'High completed', completed: true },
      { ...UNSORTED[2], title: 'Medium active', completed: false },
    ];
    render(<TaskApp tasks={tasks} showFilterBar />);

    await act(async () => user.click(screen.getByRole('button', { name: 'Active' })));
    await act(async () =>
      user.selectOptions(screen.getByRole('combobox', { name: /sort by/i }), 'priority-desc'),
    );
    expect(getTaskTitles()).toEqual(['Medium active', 'Low active']);
  });
});
