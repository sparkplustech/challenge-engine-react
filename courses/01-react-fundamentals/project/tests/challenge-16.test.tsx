import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { useTheme, ThemeProvider } from '../src/contexts/ThemeContext';

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>{theme}</span>
      <button type="button" onClick={toggleTheme}>Toggle probe theme</button>
    </div>
  );
}

describe('Challenge 16: Context API - Theme Management', () => {
  it('App should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('App should have main content', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('ThemeProvider provides a working toggle and persists the theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText('light')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Toggle probe theme' }));
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('task-app-theme') ?? 'null')).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('loads a previously saved theme and renders the app toggle', async () => {
    localStorage.setItem('task-app-theme', JSON.stringify('dark'));
    window.history.pushState({}, '', '/challenge/16-context-api-theme');
    render(<App />);

    expect(await screen.findByRole('button', { name: /switch to light theme/i })).toBeVisible();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
