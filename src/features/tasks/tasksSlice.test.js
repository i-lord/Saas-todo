import tasksReducer, { fetchTasks } from "./tasksSlice";

const initialState = {
  tasks: [],
  status: "idle",
  error: null,
};

describe("tasksSlice reducer", () => {
  it("should return the initial state", () => {
    expect(tasksReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle fetchTasks.pending", () => {
    const action = { type: fetchTasks.pending.type };
    const state = tasksReducer(initialState, action);
    expect(state.status).toBe("loading");
  });

  it("should handle fetchTasks.fulfilled", () => {
    const action = {
      type: fetchTasks.fulfilled.type,
      payload: [{ id: "1", title: "Test Task" }],
    };
    const state = tasksReducer(initialState, action);
    expect(state.status).toBe("succeeded");
    expect(state.tasks).toEqual([{ id: "1", title: "Test Task" }]);
  });

  it("should handle fetchTasks.rejected", () => {
    const action = {
      type: fetchTasks.rejected.type,
      payload: "Error message",
    };
    const state = tasksReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Error message");
  });
});
