import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import FetchDemoView from '../src/components/FetchDemoView';

describe('Challenge 22: Data Fetching - Loading and Error State', () => {
  const mockData = [{ id: 1, title: 'Test todo' }];

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('FetchDemoView should show loading state initially or fetch from API', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
    render(<FetchDemoView />);
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });
  });

  it('FetchDemoView should have fetch-list when data is loaded', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
    render(<FetchDemoView />);
    await waitFor(() => {
      const list = document.getElementById('fetch-list');
      expect(list).toBeInTheDocument();
    });
  });

  it('FetchDemoView should show fetch-error when fetch fails', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
    render(<FetchDemoView />);
    await waitFor(() => {
      const err = document.getElementById('fetch-error');
      expect(err).toBeInTheDocument();
    });
  });
});
