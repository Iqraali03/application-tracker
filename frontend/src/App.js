import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (checkingAuth) return <p>Loading...</p>;

  return (
    <div>
      <h1>Application Tracker</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
          <Dashboard />
        </div>
      ) : showSignup ? (
        <Signup onSignup={setUser} switchToLogin={() => setShowSignup(false)} />
      ) : (
        <>
          <Login onLogin={setUser} />
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => setShowSignup(true)}>
              Sign Up
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;