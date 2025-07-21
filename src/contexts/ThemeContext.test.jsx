import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeContextProvider, ThemeContext } from './ThemeContext';

describe('ThemeContext', () => {
  it('provides theme context value', () => {
    let contextValue;
    function Consumer() {
      contextValue = React.useContext(ThemeContext);
      return <div>Consumer</div>;
    }
    render(
      <ThemeContextProvider>
        <Consumer />
      </ThemeContextProvider>
    );
    expect(contextValue).toBeDefined();
    expect(screen.getByText('Consumer')).toBeInTheDocument();
  });
});
