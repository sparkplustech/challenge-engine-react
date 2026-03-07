import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskList from '../src/components/TaskList';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIVE_TASKS = [
  { id: 1, title: 'A', description: 'D1', priority: 'High', completed: false },
  { id: 2, title: 'B', description: 'D2', priority: 'Medium', completed: false },
  { id: 3, title: 'C', description: 'D3', priority: 'Low', completed: false },
  { id: 4, title: 'D', description: 'D4', priority: 'High', completed: false },
  { id: 5, title: 'E', description: 'D5', priority: 'Medium', completed: false },
];

describe('Challenge 02: Dynamic Task Rendering', () => {
  it('should render tasks from tasks prop', () => {
    render(<TaskList tasks={FIVE_TASKS} countText="5 Tasks" />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('should display task count with id task-count', () => {
    render(<TaskList tasks={FIVE_TASKS} countText="5 Tasks" />);
    const countEl = screen.getByText('5 Tasks');
    expect(countEl).toBeInTheDocument();
    expect(countEl).toHaveAttribute('id', 'task-count');
  });

  it('should use unique keys when mapping (no duplicate keys)', () => {
    const { container } = render(<TaskList tasks={FIVE_TASKS} countText="5 Tasks" />);
    const cards = container.querySelectorAll('#task-card');
    expect(cards.length).toBe(5);
  });

  it('should use map in TaskList', () => {
    const taskListContent = readFileSync(
      join(__dirname, '../src/components/TaskList.tsx'),
      'utf-8'
    );
    expect(taskListContent).toContain('.map(');
  });
});
