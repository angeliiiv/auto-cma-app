import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './Header.css';

const Header = () => {
  const { signOut, user } = useAuthenticator((context) => [context.user]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          Estimate.AI
        </div>
        <nav className="nav-links">
          <button onClick={signOut} className="header-button">Sign Out</button>
          <button className="header-button">Account</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
