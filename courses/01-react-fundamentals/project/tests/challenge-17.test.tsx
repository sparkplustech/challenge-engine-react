import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('Challenge 17: Custom Hook - useLocalStorage', () => {
  it('App should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/challenges/i)).toBeInTheDocument();
  });
});
