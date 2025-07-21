import projectsReducer, { setCurrentProject, fetchProjects } from './projectsSlice';

const initialState = {
  projects: [],
  currentProjectId: null,
  status: 'idle',
  error: null,
};

describe('projectsSlice reducer', () => {
  it('should return the initial state', () => {
    expect(projectsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setCurrentProject', () => {
    const state = projectsReducer(initialState, setCurrentProject('abc123'));
    expect(state.currentProjectId).toBe('abc123');
  });

  it('should handle fetchProjects.pending', () => {
    const action = { type: fetchProjects.pending.type };
    const state = projectsReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle fetchProjects.fulfilled and auto-select first project', () => {
    const projects = [
      { projectId: 'p1', name: 'Project 1' },
      { projectId: 'p2', name: 'Project 2' }
    ];
    const action = { type: fetchProjects.fulfilled.type, payload: projects };
    const state = projectsReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.projects).toEqual(projects);
    expect(state.currentProjectId).toBe('p1');
  });

  it('should not override currentProjectId if already set', () => {
    const projects = [
      { projectId: 'p1', name: 'Project 1' },
      { projectId: 'p2', name: 'Project 2' }
    ];
    const preState = { ...initialState, currentProjectId: 'p2' };
    const action = { type: fetchProjects.fulfilled.type, payload: projects };
    const state = projectsReducer(preState, action);
    expect(state.currentProjectId).toBe('p2');
  });

  it('should handle fetchProjects.rejected', () => {
    const action = { type: fetchProjects.rejected.type, payload: 'Error!' };
    const state = projectsReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Error!');
  });
});
