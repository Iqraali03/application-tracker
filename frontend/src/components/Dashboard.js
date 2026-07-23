import { useState, useEffect } from 'react';
import axios from 'axios';
import AddApplication from './AddApplication';

const statusColors = {
  applied: 'bg-stone-200 text-stone-800',
  interview: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/applications`, {
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/applications/${id}`, {
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
        `${process.env.REACT_APP_API_URL}/api/applications/${id}`,
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

  if (loading) return <p className="text-stone-600">Loading applications...</p>;
  if (error) return <p className="text-red-700">{error}</p>;

  return (
    <div>
      <AddApplication onApplicationAdded={handleApplicationAdded} />

      <h2 className="text-lg font-semibold text-stone-800 mb-4">Your Applications</h2>
      {applications.length === 0 ? (
        <p className="text-stone-500">No applications yet. Add one to get started!</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="bg-white border border-stone-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-stone-800">{app.company_name}</p>
                <p className="text-sm text-stone-600">{app.role_title}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className={`text-sm rounded-md px-2 py-1 border-0 font-medium ${statusColors[app.status]}`}
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-sm text-red-700 hover:text-red-900 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;