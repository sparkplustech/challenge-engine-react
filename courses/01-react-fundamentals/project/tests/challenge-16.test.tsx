import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('Challenge 16: Context API - Theme Management', () => {
  it('App should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });

  it('App should have main content', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
