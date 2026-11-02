import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TaskDetailPage from '../src/components/TaskDetailPage';
import TaskCard from '../src/components/TaskCard';

describe('Challenge 21: React Router - Routing and Navigation', () => {
  it('TaskDetailPage should use useParams and render task detail or not found', () => {
    render(
      <MemoryRouter initialEntries={['/challenge/21-react-router/task/1']}>
        <Routes>
          <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    const page = document.getElementById('task-detail-page');
    expect(page).toBeInTheDocument();
  });

  it('TaskDetailPage should have back button with id task-detail-back', () => {
    render(
      <MemoryRouter initialEntries={['/challenge/21-react-router/task/999']}>
        <Routes>
          <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    const back = document.getElementById('task-detail-back');
    expect(back).toBeInTheDocument();
  });

  it('renders persisted task details and navigates back to the list', () => {
    localStorage.setItem('task-app-tasks', JSON.stringify([{
      id: 1,
      title: 'Router task',
      description: 'Route-driven details',
      priority: 'High',
      completed: false,
    }]));
    render(
      <MemoryRouter initialEntries={['/challenge/21-react-router/task/1']}>
        <Routes>
          <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
          <Route path="/challenge/21-react-router" element={<p>Task list route</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Router task' })).toBeInTheDocument();
    expect(screen.getByText('Route-driven details')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to list' }));
    expect(screen.getByText('Task list route')).toBeInTheDocument();
  });

  it('links task titles to their detail route when enabled', () => {
    render(
      <MemoryRouter>
        <TaskCard
          id="task 1"
          title="Linked task"
          description="Description"
          priority="Medium"
          linkToTaskDetail
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Linked task' }))
      .toHaveAttribute('href', '/challenge/21-react-router/task/task%201');
  });
});
