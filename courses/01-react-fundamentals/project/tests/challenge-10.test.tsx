import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import TaskApp from '../src/components/TaskApp';
import type { Task } from '../src/components/TaskList';
import useLocalStorage from '../src/hooks/useLocalStorage';
import { ThemeProvider } from '../src/contexts/ThemeContext';

describe('Challenge 10: useEffect - Local Storage Persistence', () => {
  const TASKS: Task[] = [
    { id: 1, title: 'Persisted task', description: 'Stored description', priority: 'High', completed: false },
  ];

  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
      clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
      get length() { return Object.keys(store).length; },
      key: vi.fn(() => null),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function StatefulTaskApp({ initialTasks = TASKS }: { initialTasks?: Task[] }) {
    const [tasks, setTasks] = useLocalStorage('task-app-tasks', initialTasks);
    return (
      <ThemeProvider>
        <TaskApp tasks={tasks} setTasks={setTasks} showForm />
      </ThemeProvider>
    );
  }

  it('App should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('App should have routes for challenge 10', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('loads stored tasks and preserves additional task properties', async () => {
    const savedTasks = [
      { ...TASKS[0], category: 'Work', tags: ['urgent'], dueDate: '2026-11-01' },
    ];
    localStorage.setItem('task-app-tasks', JSON.stringify(savedTasks));
    render(<StatefulTaskApp />);

    await waitFor(() => {
      expect(screen.getByText('Persisted task')).toBeInTheDocument();
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'task-app-tasks',
        JSON.stringify(savedTasks),
      );
    });
  });

  it('falls back to initial tasks when stored JSON is invalid', async () => {
    localStorage.setItem('task-app-tasks', '{invalid');
    render(<StatefulTaskApp />);

    expect(screen.getByText('Persisted task')).toBeInTheDocument();
    await waitFor(() =>
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'task-app-tasks',
        JSON.stringify(TASKS),
      ),
    );
  });

  it('saves task completion changes to localStorage', async () => {
    const user = userEvent.setup();
    render(<StatefulTaskApp />);
    const checkbox = await screen.findByRole('checkbox');

    await user.click(checkbox);
    await waitFor(() =>
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'task-app-tasks',
        JSON.stringify([{ ...TASKS[0], completed: true }]),
      ),
    );
  });
});
