import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';
import { ThemeProvider } from '../src/contexts/ThemeContext';

describe('Challenge 12: Categories and Tags', () => {
  it('TaskCard should render title and priority', () => {
    render(
      <TaskCard
        title="T"
        description="D"
        priority="High"
        category="Work"
        tags={['urgent', 'planning']}
        showCategories
      />,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText(/priority:\s*high/i)).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(document.querySelector('#task-category')).toBeInTheDocument();
    expect(document.querySelector('#task-tags [data-tag="urgent"]')).toBeInTheDocument();
    expect(document.querySelector('#task-tags [data-tag="planning"]')).toBeInTheDocument();
  });

  it('TaskList should render tasks with extended shape', () => {
    const tasks = [
      { id: 1, title: 'A', description: 'D', priority: 'High', completed: false },
    ];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('creates tasks with a category and parsed tags', async () => {
    const user = userEvent.setup();
    const setTasks = vi.fn();
    render(
      <ThemeProvider>
        <TaskApp
          tasks={[]}
          setTasks={setTasks}
          showForm
          showFilterBar
          showSearch
          enableCategories
        />
      </ThemeProvider>,
    );

    await user.type(screen.getByLabelText('Title'), 'Write docs');
    await user.selectOptions(document.querySelector('#task-category-input')!, 'Work');
    await user.type(screen.getByLabelText('Tags (comma-separated)'), ' urgent, planning, ');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    const addTaskUpdate = setTasks.mock.calls
      .map(([updateTasks]) => updateTasks)
      .find((updateTasks) => {
        expect(typeof updateTasks).toBe('function');
        return updateTasks([]).some((task) => task.title === 'Write docs');
      });
    const createdTask = addTaskUpdate?.([]).find((task) => task.title === 'Write docs');
    expect(createdTask).toMatchObject({
      category: 'Work',
      tags: ['urgent', 'planning'],
    });
  });

  it('filters tasks by category and exposes categories from existing tasks', async () => {
    const user = userEvent.setup();
    const tasks = [
      { id: 1, title: 'Work task', description: 'D', priority: 'High', completed: false, category: 'Work', tags: [] },
      { id: 2, title: 'Personal task', description: 'D', priority: 'Low', completed: false, category: 'Personal', tags: [] },
    ];
    render(
      <ThemeProvider>
        <TaskApp tasks={tasks} showForm showFilterBar showSearch enableCategories />
      </ThemeProvider>,
    );

    const categoryFilter = document.querySelector('#category-filter')!;
    expect(categoryFilter.querySelector('option[value="Work"]')).toBeInTheDocument();
    expect(categoryFilter.querySelector('option[value="Personal"]')).toBeInTheDocument();
    await user.selectOptions(categoryFilter, 'Work');
    expect(screen.getByText('Work task')).toBeInTheDocument();
    expect(screen.queryByText('Personal task')).not.toBeInTheDocument();
  });
});
