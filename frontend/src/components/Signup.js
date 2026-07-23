import { useState } from 'react';
import axios from 'axios';

function Signup({ onSignup, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      onSignup(loginRes.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-200">
      <h2 className="text-xl font-semibold text-stone-800 mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-2 rounded-md transition"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-stone-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-green-800 font-medium hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;