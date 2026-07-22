import { useState } from 'react';
import axios from 'axios';

function AddApplication({ onApplicationAdded }) {
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/applications',
        { company_name: companyName, role_title: roleTitle, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear the form
      setCompanyName('');
      setRoleTitle('');
      setNotes('');

      // Tell the parent (Dashboard) a new application was added
      onApplicationAdded(res.data.application);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add application');
    }
  };

  return (
    <div>
      <h3>Add New Application</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role Title</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Add Application</button>
      </form>
    </div>
  );
}

export default AddApplication;