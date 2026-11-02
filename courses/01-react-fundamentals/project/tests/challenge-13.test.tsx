import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

describe('Challenge 13: Due Dates and Sorting', () => {
  it('TaskCard should render title', () => {
    render(
      <TaskCard
        title="T"
        description="D"
        priority="High"
        dueDate="2025-12-31"
        showDueDate
      />,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(document.getElementById('task-due-date')).toBeInTheDocument();
    expect(document.getElementById('task-due-date')).not.toHaveTextContent('No due date');
  });

  it('TaskList should render tasks', () => {
    const tasks = [{ id: 1, title: 'A', description: 'D', priority: 'High', completed: false }];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('marks overdue incomplete tasks and shows the due today label', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    render(
      <>
        <TaskCard title="Late" description="D" priority="High" dueDate={yesterdayKey} showDueDate />
        <TaskCard title="Today" description="D" priority="Low" dueDate={todayKey} showDueDate />
      </>,
    );
    const overdue = screen.getByText(/Overdue/).closest('#task-due-date');
    expect(overdue).toHaveAttribute('data-overdue', 'true');
    expect(screen.getByText(/Due Today/)).toBeInTheDocument();
  });

  it('creates tasks with an optional due date', async () => {
    const user = userEvent.setup();
    const setTasks = vi.fn();
    render(<TaskApp tasks={[]} setTasks={setTasks} showForm enableDueDate />);

    await user.type(screen.getByLabelText('Title'), 'Due soon');
    await user.type(screen.getByLabelText('Due date'), '2026-11-02');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    const updateTasks = setTasks.mock.calls[0][0];
    const [createdTask] = updateTasks([]);
    expect(createdTask.dueDate).toBe('2026-11-02');
  });

  it('sorts dated tasks soonest first and leaves undated tasks at the end', async () => {
    const user = userEvent.setup();
    render(
      <TaskApp
        tasks={[
          { id: 1, title: 'No date', description: 'D', priority: 'High', completed: false },
          { id: 2, title: 'Later', description: 'D', priority: 'Low', completed: false, dueDate: '2026-11-10' },
          { id: 3, title: 'Sooner', description: 'D', priority: 'Medium', completed: false, dueDate: '2026-11-02' },
        ]}
        showFilterBar
        enableDueDate
      />,
    );

    await user.selectOptions(screen.getByLabelText('Sort by'), 'due-date');
    const titles = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(titles).toEqual(['Sooner', 'Later', 'No date']);
  });
});
