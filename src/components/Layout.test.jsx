import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';

function renderWithStore(children) {
  const store = configureStore({
    reducer: { projects: projectsReducer, tasks: tasksReducer },
    preloadedState: {
      projects: {
        projects: [
          { projectId: 'p1', name: 'Project 1' },
          { projectId: 'p2', name: 'Project 2' }
        ],
        currentProjectId: 'p1',
        status: 'succeeded',
        error: null,
      },
      tasks: {
        tasks: [],
        status: 'succeeded',
        error: null,
      },
    },
  });
  return render(<Provider store={store}>{children}</Provider>);
}

describe('Layout', () => {
  it('renders children and sidebar', () => {
    renderWithStore(<Layout><div>Test Content</div></Layout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows project name in sidebar', () => {
    renderWithStore(<Layout><div>Test</div></Layout>);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });

  // More interaction/navigation tests can be added as needed
});
