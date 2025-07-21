import React from "react";
import { render, screen } from "@testing-library/react";
import TaskBoard from "./TaskBoard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

function renderWithStore(tasks) {
  const store = configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: {
      tasks: {
        tasks,
        status: "succeeded",
        error: null,
      },
    },
  });
  return render(
    <Provider store={store}>
      <TaskBoard />
    </Provider>
  );
}

describe("TaskBoard", () => {
  it("renders columns and tasks", () => {
    const mockTasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "in-progress" },
      { id: "3", title: "Task 3", status: "done" },
    ];
    renderWithStore(mockTasks);
    expect(screen.getByText("todo")).toBeInTheDocument();
    expect(screen.getByText("in-progress")).toBeInTheDocument();
    expect(screen.getByText("done")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("shows 'No tasks' if column is empty", () => {
    renderWithStore([]);
    expect(screen.getAllByText("No tasks").length).toBeGreaterThan(0);
  });
});
