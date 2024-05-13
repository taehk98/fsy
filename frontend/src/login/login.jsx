import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { UserContext } from '../App';

export function Login({ userName, clubName, userEmail, authState, onAuthChange }) {
  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  return (
    <main>
      <div>
        <img className="logoimage" src="/logo_transparent.png" alt="logo" width="260px" height="260px"></img>
        {authState !== AuthState.Unknown}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userEmail, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}
