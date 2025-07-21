import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContextProvider, AuthContext } from './AuthContext';

describe('AuthContext', () => {
  it('provides context value', () => {
    let contextValue;
    function Consumer() {
      contextValue = React.useContext(AuthContext);
      return <div>Consumer</div>;
    }
    render(
      <AuthContextProvider>
        <Consumer />
      </AuthContextProvider>
    );
    expect(contextValue).toBeDefined();
    expect(screen.getByText('Consumer')).toBeInTheDocument();
  });
});
