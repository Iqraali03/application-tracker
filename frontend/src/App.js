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

  if (checkingAuth) return <p className="text-center mt-10 text-stone-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Application Tracker</h1>

        {user ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-700">Welcome, <span className="font-semibold">{user.name}</span>!</p>
              <button
                onClick={handleLogout}
                className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
            <Dashboard />
          </div>
        ) : showSignup ? (
          <Signup onSignup={setUser} switchToLogin={() => setShowSignup(false)} />
        ) : (
          <div>
            <Login onLogin={setUser} />
            <p className="text-center mt-4 text-sm text-stone-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="text-green-800 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;