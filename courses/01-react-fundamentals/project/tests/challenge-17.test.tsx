import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import useLocalStorage from '../src/hooks/useLocalStorage';

function StorageProbe({ initialValue }: { initialValue: string[] }) {
  const [value, setValue] = useLocalStorage('probe-value', initialValue);
  return (
    <div>
      <output>{value.join(',')}</output>
      <button type="button" onClick={() => setValue((previous) => [...previous, 'next'])}>
        Update stored value
      </button>
    </div>
  );
}

describe('Challenge 17: Custom Hook - useLocalStorage', () => {
  it('App should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('hook returns its initial value and persists functional updates', async () => {
    const user = userEvent.setup();
    render(<StorageProbe initialValue={['first']} />);
    expect(screen.getByText('first')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update stored value' }));

    await waitFor(() => {
      expect(screen.getByText('first,next')).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem('probe-value') ?? 'null')).toEqual(['first', 'next']);
    });
  });

  it('uses the initial value for malformed stored JSON', () => {
    localStorage.setItem('probe-value', '{bad json');
    render(<StorageProbe initialValue={['fallback']} />);
    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('keeps task and theme persistence on the app routes', async () => {
    window.history.pushState({}, '', '/challenge/17-custom-hook-uselocalstorage');
    render(<App />);
    await waitFor(() => {
      expect(localStorage.getItem('task-app-tasks')).not.toBeNull();
      expect(JSON.parse(localStorage.getItem('task-app-theme') ?? 'null')).toBe('light');
    });
  });
});
