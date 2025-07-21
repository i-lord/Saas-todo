import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectSelect from './ProjectSelect';

describe('ProjectSelect', () => {
  const projects = [
    { projectId: 'p1', name: 'Project 1' },
    { projectId: 'p2', name: 'Project 2' },
  ];
  const mockOnChange = jest.fn();

  it('renders project dropdown and options', () => {
    render(
      <ProjectSelect
        projects={projects}
        value={'p1'}
        onChange={mockOnChange}
        loading={false}
      />
    );
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('calls onChange when a project is selected', () => {
    render(
      <ProjectSelect
        projects={projects}
        value={'p1'}
        onChange={mockOnChange}
        loading={false}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Project 2'));
    expect(mockOnChange).toHaveBeenCalledWith('p2');
  });

  it('shows loading state', () => {
    render(
      <ProjectSelect
        projects={[]}
        value={''}
        onChange={mockOnChange}
        loading={true}
      />
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <ProjectSelect
        projects={[]}
        value={''}
        onChange={mockOnChange}
        loading={false}
      />
    );
    expect(screen.getByText(/No projects/i)).toBeInTheDocument();
  });
});
