import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectForm from './ProjectForm';

describe('ProjectForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('renders dialog and fields', () => {
    render(
      <ProjectForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={false} />
    );
    expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Project/i)).toBeInTheDocument();
  });

  it('shows error if name is empty on submit', () => {
    render(
      <ProjectForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={false} />
    );
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText(/Project name is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data', () => {
    render(
      <ProjectForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={false} />
    );
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'My Project', name: 'name' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Desc', name: 'description' } });
    fireEvent.click(screen.getByText('Create'));
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'My Project', description: 'Desc' });
  });

  it('calls onClose and resets form on cancel', () => {
    render(
      <ProjectForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={false} />
    );
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'My Project', name: 'name' } });
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    // The form should reset, so name should be empty
    expect(screen.getByLabelText(/Project Name/i)).toHaveValue('');
  });

  it('disables buttons when loading', () => {
    render(
      <ProjectForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={true} />
    );
    expect(screen.getByText('Creating...')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
