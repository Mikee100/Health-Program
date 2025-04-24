import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing programs
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/programs');
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Program name is required');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/programs', { name, description });
      setPrograms((prev) => [res.data, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Health Programs</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label className="block font-semibold mb-1">Program Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Diabetes Management"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about the program"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Creating...' : 'Add Program'}
        </button>
      </form>

      {/* Program List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Programs</h3>
        {programs.length === 0 ? (
          <p className="text-gray-500">No programs available.</p>
        ) : (
          <ul className="space-y-4">
            {programs.map((program) => (
              <li key={program.id} className="border p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800">{program.name}</h4>
                <p className="text-gray-600">{program.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;
