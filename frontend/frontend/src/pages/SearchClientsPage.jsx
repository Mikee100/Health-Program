// src/pages/SearchClientsPage.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchClientsPage = () => {
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState([]);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`/api/clients/search?query=${query}`);
      setClients(data);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Search Clients</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or contact"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/3"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-indigo-600 text-white rounded"
        >
          Search
        </button>
      </div>
      <div>
        {clients.length > 0 ? (
          <ul>
            {clients.map(client => (
              <li key={client.id} className="py-2">{client.first_name} {client.last_name}</li>
            ))}
          </ul>
        ) : (
          <p>No clients found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchClientsPage;
