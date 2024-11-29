// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Header from './components/Header';
import AddressInputForm from './pages/AddressInputForm';
import LoadingPage from './pages/LoadingPage'; // Updated import to LoadingPage
import Dashboard from './pages/Dashboard';
import { PropertyProvider } from './context/PropertyContext'; // Import PropertyProvider
import '@aws-amplify/ui-react/styles.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user, isLoading }) => {
          // Handle loading state
          if (isLoading) {
            return <div>Loading...</div>;
          }

          // Ensure the user is loaded before rendering the app
          if (!user) {
            return <div>Loading user information...</div>;
          }

          return (
            <PropertyProvider> {/* Wrap with PropertyProvider */}
              <Router>
                <Header signOut={signOut} user={user} />
                <Routes>
                  {/* Address Input Form */}
                  <Route
                    path="/"
                    element={<AddressInputForm />}
                  />

                  {/* Loading Page */}
                  <Route
                    path="/loading"
                    element={<LoadingPage />}
                  />

                  {/* Dashboard */}
                  <Route
                    path="/dashboard"
                    element={<Dashboard />}
                  />
                </Routes>
              </Router>
            </PropertyProvider>
          );
        }}
      </Authenticator>
    </div>
  );
}

export default App;