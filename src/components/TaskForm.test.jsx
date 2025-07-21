import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    loading: false,
    task: null,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('renders dialog and fields', () => {
    render(<TaskForm {...defaultProps} />);
    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assigned To/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
  });

  it('shows error if title is empty on submit', () => {
    render(<TaskForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText(/Task title is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data', () => {
    render(<TaskForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'My Task', name: 'title' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Desc', name: 'description' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'In Progress', name: 'status' } });
    fireEvent.change(screen.getByLabelText(/Assigned To/i), { target: { value: 'User', name: 'assignedTo' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2025-07-22', name: 'dueDate' } });
    fireEvent.click(screen.getByText('Create'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'My Task',
      description: 'Desc',
      status: 'In Progress',
      assignedTo: 'User',
      dueDate: '2025-07-22',
    });
  });

  it('calls onClose and resets form on cancel', () => {
    render(<TaskForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'My Task', name: 'title' } });
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    // The form should reset, so title should be empty
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('');
  });

  it('disables buttons when loading', () => {
    render(<TaskForm {...defaultProps} loading={true} />);
    expect(screen.getByText(/Creating.../i)).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('renders in edit mode with task prop', () => {
    const task = {
      title: 'Edit Task',
      description: 'Edit Desc',
      status: 'Done',
      assignedTo: 'Editor',
      dueDate: '2025-07-23',
    };
    render(<TaskForm {...defaultProps} task={task} />);
    expect(screen.getByDisplayValue('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Desc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Done')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Editor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-07-23')).toBeInTheDocument();
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
