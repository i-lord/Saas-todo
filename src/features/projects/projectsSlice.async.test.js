import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import projectsReducer, { fetchProjects } from './projectsSlice';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('projectsSlice async thunks', () => {
  let mock;
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });
  afterAll(() => {
    mock.restore();
  });

  it('dispatches fulfilled when fetchProjects succeeds', async () => {
    const projects = [
      { projectId: 'p1', name: 'Project 1' },
      { projectId: 'p2', name: 'Project 2' }
    ];
    mock.onGet('/projects').reply(200, { projects });

    const store = mockStore({ projects: { projects: [], currentProjectId: null, status: 'idle', error: null } });
    await store.dispatch(fetchProjects('user123'));
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchProjects.pending.type);
    expect(actions[1].type).toBe(fetchProjects.fulfilled.type);
    expect(actions[1].payload).toEqual(projects);
  });

  it('dispatches rejected when fetchProjects fails', async () => {
    mock.onGet('/projects').reply(500, { message: 'Server error' });
    const store = mockStore({ projects: { projects: [], currentProjectId: null, status: 'idle', error: null } });
    await store.dispatch(fetchProjects('user123'));
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchProjects.pending.type);
    expect(actions[1].type).toBe(fetchProjects.rejected.type);
    expect(actions[1].payload).toBe('Server error');
  });

  it('dispatches rejected when userId is missing', async () => {
    const store = mockStore({ projects: { projects: [], currentProjectId: null, status: 'idle', error: null } });
    await store.dispatch(fetchProjects());
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchProjects.pending.type);
    expect(actions[1].type).toBe(fetchProjects.rejected.type);
    expect(actions[1].payload).toBe('No userId provided');
  });
});
