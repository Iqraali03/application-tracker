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
        '${process.env.REACT_APP_API_URL}/api/applications',
        { company_name: companyName, role_title: roleTitle, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompanyName('');
      setRoleTitle('');
      setNotes('');

      onApplicationAdded(res.data.application);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add application');
    }
  };

  return (
    <div className="bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-200 mb-8">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">Add New Application</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Role Title</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-green-800 hover:bg-green-900 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Add Application
        </button>
      </form>
    </div>
  );
}

export default AddApplication;