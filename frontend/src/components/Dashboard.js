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
    // Add the new application to the top of the existing list, no re-fetch needed
    setApplications([newApp, ...applications]);
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
              <strong>{app.company_name}</strong> — {app.role_title} (
              {app.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;