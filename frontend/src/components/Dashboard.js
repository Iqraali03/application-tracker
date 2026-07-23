import { useState, useEffect } from 'react';
import axios from 'axios';
import AddApplication from './AddApplication';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAdded = (newApp) => {
    setApplications([newApp, ...applications]);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err) {
      alert('Failed to delete application');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:5000/api/applications/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(
        applications.map((app) => (app.id === id ? res.data.application : app))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <AddApplication onApplicationAdded={handleApplicationAdded} />

      <h2>Your Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet. Add one to get started!</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>{app.company_name}</strong> — {app.role_title}{' '}
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => handleDelete(app.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;