import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

describe('Challenge 08: Task Editing', () => {
  const TASKS = [
    { id: 1, title: 'Original', description: 'Desc', priority: 'High', completed: false },
  ];

  it('TaskCard should render title and description', () => {
    render(<TaskCard title="Original" description="Desc" priority="High" />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('TaskList should pass update behavior to TaskCard', async () => {
    const user = userEvent.setup();
    const onUpdateTask = vi.fn();
    render(
      <TaskList
        tasks={TASKS}
        countText="1 Tasks"
        onToggle={vi.fn()}
        onUpdateTask={onUpdateTask}
      />
    );
    expect(screen.getByText('Original')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Edit title' })).toHaveValue('Original');
  });

  it('TaskList should have id="task-list"', () => {
    const { container } = render(<TaskList tasks={TASKS} countText="1" />);
    expect(container.querySelector('#task-list')).toBeInTheDocument();
  });

  it('TaskCard allows editing, saves changes, and exits edit mode', async () => {
    const user = userEvent.setup();
    const onUpdateTask = vi.fn();
    render(
      <TaskCard
        id={1}
        title="Original"
        description="Desc"
        priority="High"
        onUpdateTask={onUpdateTask}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Edit title' })).toHaveValue('Original');
    expect(screen.getByRole('textbox', { name: 'Edit description' })).toHaveValue('Desc');
    expect(screen.getByRole('combobox', { name: 'Edit priority' })).toHaveValue('High');

    await user.clear(screen.getByRole('textbox', { name: 'Edit title' }));
    await user.type(screen.getByRole('textbox', { name: 'Edit title' }), 'Updated');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdateTask).toHaveBeenCalledWith(1, {
      title: 'Updated',
      description: 'Desc',
      priority: 'High',
    });
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('TaskCard cancels edits and does not save an empty title', async () => {
    const user = userEvent.setup();
    const onUpdateTask = vi.fn();
    render(
      <TaskCard
        id={1}
        title="Original"
        description="Desc"
        priority="High"
        onUpdateTask={onUpdateTask}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox', { name: 'Edit title' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onUpdateTask).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('TaskApp permits only one task to be edited at a time', async () => {
    const user = userEvent.setup();
    render(<TaskApp tasks={[...TASKS, { ...TASKS[0], id: 2, title: 'Second' }]} enableTaskEditing />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    expect(screen.getAllByRole('button', { name: 'Save' })).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[1]);
    expect(screen.getAllByRole('button', { name: 'Save' })).toHaveLength(1);
    expect(screen.getByRole('textbox', { name: 'Edit title' })).toHaveValue('Second');
  });
});
