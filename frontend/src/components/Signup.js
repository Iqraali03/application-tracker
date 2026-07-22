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

      // After successful signup, log the user in automatically
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
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <button type="button" onClick={switchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;