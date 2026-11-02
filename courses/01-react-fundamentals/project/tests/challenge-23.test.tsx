import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';

describe('Challenge 23: useRef - Focus Management', () => {
  it('FilterBar should render search input with id search-input', () => {
    render(
      <FilterBar
        filter="all"
        searchText=""
        showSearch
        onSearchChange={() => {}}
      />
    );
    const searchInput = document.getElementById('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput?.tagName).toBe('INPUT');
  });

  it('FilterBar focuses the search input on mount', async () => {
    render(
      <FilterBar
        filter="all"
        searchText=""
        showSearch
        onSearchChange={() => {}}
      />
    );
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
    await waitFor(() => {
      expect(document.activeElement).toBe(searchInput);
    });
  });
});
