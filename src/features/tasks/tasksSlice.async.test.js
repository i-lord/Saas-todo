import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import tasksReducer, { fetchTasks } from './tasksSlice';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('tasksSlice async thunks', () => {
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

  it('dispatches fulfilled when fetchTasks succeeds', async () => {
    const tasks = [
      { id: 't1', title: 'Task 1' },
      { id: 't2', title: 'Task 2' }
    ];
    mock.onGet('/tasks').reply(200, { tasks });

    const store = mockStore({ tasks: { tasks: [], status: 'idle', error: null } });
    await store.dispatch(fetchTasks('project123'));
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchTasks.pending.type);
    expect(actions[1].type).toBe(fetchTasks.fulfilled.type);
    expect(actions[1].payload).toEqual(tasks);
  });

  it('dispatches rejected when fetchTasks fails', async () => {
    mock.onGet('/tasks').reply(500, { message: 'Server error' });
    const store = mockStore({ tasks: { tasks: [], status: 'idle', error: null } });
    await store.dispatch(fetchTasks('project123'));
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchTasks.pending.type);
    expect(actions[1].type).toBe(fetchTasks.rejected.type);
    expect(actions[1].payload).toBe('Server error');
  });

  it('dispatches rejected when projectId is missing', async () => {
    const store = mockStore({ tasks: { tasks: [], status: 'idle', error: null } });
    await store.dispatch(fetchTasks());
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchTasks.pending.type);
    expect(actions[1].type).toBe(fetchTasks.rejected.type);
    expect(actions[1].payload).toBe('No projectId provided');
  });
});
