import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import TaskList from '../src/components/TaskList';

describe('Challenge 18: useReducer - Complex State Management', () => {
  const TASKS = [{ id: 1, title: 'T', description: 'D', priority: 'High', completed: false }];

  it('App should render', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    render(<TaskList tasks={TASKS} countText="1 Tasks" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
