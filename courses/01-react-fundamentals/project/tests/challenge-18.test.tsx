import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import TaskList from '../src/components/TaskList';
import taskReducer, {
  ADD_TASK,
  DELETE_TASK,
  SET_TASKS,
  TOGGLE_TASK,
  UPDATE_TASK,
} from '../src/reducers/taskReducer';

describe('Challenge 18: useReducer - Complex State Management', () => {
  const TASKS = [{ id: 1, title: 'T', description: 'D', priority: 'High', completed: false }];

  it('handles every task action immutably', () => {
    const original = TASKS;
    const added = { id: 2, title: 'Added', description: 'D', priority: 'Low', completed: false };

    const afterAdd = taskReducer(original, { type: ADD_TASK, payload: added });
    expect(afterAdd).toEqual([...original, added]);
    expect(afterAdd).not.toBe(original);
    expect(original).toEqual(TASKS);

    const afterUpdate = taskReducer(afterAdd, {
      type: UPDATE_TASK,
      payload: { id: 1, title: 'Updated' },
    });
    expect(afterUpdate[0]).toMatchObject({ title: 'Updated', description: 'D' });
    expect(afterUpdate[1]).toBe(added);

    const afterToggle = taskReducer(afterUpdate, { type: TOGGLE_TASK, payload: 1 });
    expect(afterToggle[0].completed).toBe(true);
    expect(afterUpdate[0].completed).toBe(false);

    const afterDelete = taskReducer(afterToggle, { type: DELETE_TASK, payload: 2 });
    expect(afterDelete).toHaveLength(1);
    expect(afterDelete[0].id).toBe(1);

    const replacement = [added];
    expect(taskReducer(afterDelete, { type: SET_TASKS, payload: replacement })).toBe(replacement);
  });

  it('App should render', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    render(<TaskList tasks={TASKS} countText="1 Tasks" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
