import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsPanel from '../src/components/StatsPanel';
import TaskList from '../src/components/TaskList';
import TaskApp from '../src/components/TaskApp';

describe('Challenge 14: Task Statistics Dashboard', () => {
  const TASKS = [
    { id: 1, title: 'A', description: 'D', priority: 'High', completed: true },
    { id: 2, title: 'B', description: 'D', priority: 'Medium', completed: false },
  ];

  it('StatsPanel should have id="stats-panel"', () => {
    const { container } = render(<StatsPanel total={2} completed={1} active={1} overdue={0} />);
    expect(container.querySelector('#stats-panel')).toBeInTheDocument();
  });

  it('StatsPanel should display total and completed', () => {
    render(<StatsPanel total={2} completed={1} active={1} overdue={0} />);
    expect(screen.getByText(/total:\s*2/i)).toBeInTheDocument();
    expect(screen.getByText(/completed:\s*1\s*\(50%\)/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText(/active:\s*1/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue:\s*0/i)).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    render(<TaskList tasks={TASKS} countText="2 Tasks" />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('computes overdue tasks and updates statistics when tasks change', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dueDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const { rerender } = render(
      <TaskApp
        tasks={[
          { ...TASKS[0], completed: false, dueDate },
          TASKS[1],
        ]}
        showStatsPanel
      />,
    );

    expect(screen.getByText(/total:\s*2/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue:\s*1/i)).toBeInTheDocument();

    rerender(<TaskApp tasks={[TASKS[0]]} showStatsPanel />);
    expect(screen.getByText(/total:\s*1/i)).toBeInTheDocument();
    expect(screen.getByText(/completed:\s*1\s*\(100%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/active:\s*0/i)).toBeInTheDocument();
  });
});
