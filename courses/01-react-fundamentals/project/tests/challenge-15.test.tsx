import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';

describe('Challenge 15: Component Organization with Props', () => {
  it('TaskCard should accept and render props', () => {
    render(<TaskCard title="T" description="D" priority="High" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('TaskList should render TaskCards with props', () => {
    const tasks = [{ id: 1, title: 'Task', description: 'Desc', priority: 'Medium', completed: false }];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('Task')).toBeInTheDocument();
  });
});
