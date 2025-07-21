import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  return stored ? stored : getSystemTheme();
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: theme === 'dark'
          ? {
              mode: 'dark',
              primary: { main: '#90caf9' },
              secondary: { main: '#f48fb1' },
              background: {
                default: '#181c24', // deep blue-grey
                paper: '#232837',
              },
              text: {
                primary: '#e3eaf7',
                secondary: '#b0b8c9',
              },
              divider: '#232837',
            }
          : {
              mode: 'light',
            },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: theme === 'dark' ? '0 2px 12px 0 rgba(20,40,80,0.25)' : undefined,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: theme === 'dark' ? 'linear-gradient(90deg, #232837 0%, #181c24 100%)' : undefined,
                boxShadow: theme === 'dark' ? '0 1px 8px 0 rgba(20,40,80,0.18)' : undefined,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                background: theme === 'dark' ? '#202432' : undefined,
                boxShadow: theme === 'dark' ? '0 2px 8px 0 rgba(20,40,80,0.18)' : undefined,
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                marginBottom: 2,
                '&:hover': {
                  background: theme === 'dark' ? '#232837' : '#f5f5f5',
                },
              },
            },
          },
        },
      }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
