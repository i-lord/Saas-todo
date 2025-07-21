import React, { useEffect } from "react";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Provider, useDispatch } from "react-redux";
import store from "./app/store";
import AppRoutes from "./routes";
import { fetchProjects } from "./features/projects/projectsSlice";

// Helper component to fetch projects on login
function ProjectsFetcher() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(fetchProjects());
    }
  }, [user, dispatch]);
  return null;
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <AuthProvider>
          <ProjectsFetcher />
          <AppRoutes />
        </AuthProvider>
      </ThemeContextProvider>
    </Provider>
  );
};

export default App;