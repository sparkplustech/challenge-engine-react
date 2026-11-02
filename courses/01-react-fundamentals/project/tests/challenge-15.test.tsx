import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';
import Button from '../src/components/Button';
import Badge from '../src/components/Badge';
import StatusIndicator from '../src/components/StatusIndicator';
import FormInput from '../src/components/FormInput';

describe('Challenge 15: Component Organization with Props', () => {
  it('TaskCard should accept and render props', () => {
    render(<TaskCard title="T" description="D" priority="High" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('TaskList should render TaskCards with props', () => {
    const tasks = [{ id: 1, title: 'Task', description: 'Desc', priority: 'Medium', completed: false }];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('Task')).toBeInTheDocument();
  });

  it('Button forwards props and renders children', async () => {
    const onClick = vi.fn();
    render(<Button id="test-button" variant="danger" onClick={onClick}>Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('id', 'test-button');
    expect(button).toHaveAttribute('data-variant', 'danger');
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('Badge and StatusIndicator render accessible labels', () => {
    render(
      <>
        <Badge variant="tag">urgent</Badge>
        <StatusIndicator status="overdue" />
      </>,
    );
    expect(screen.getByText('urgent')).toHaveAttribute('data-variant', 'tag');
    expect(screen.getByRole('status')).toHaveTextContent('Overdue');
  });

  it('FormInput associates its label with the input', () => {
    render(
      <FormInput
        id="title"
        label="Title"
        value=""
        onChange={vi.fn()}
        error="Required"
      />,
    );
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
