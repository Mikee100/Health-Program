import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useNavigate(); // Use history to navigate to profile page

  useEffect(() => {
    // Fetching the clients when the component is mounted
    axios.get('http://localhost:3000/api/clients')
      .then(res => {
        setClients(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch clients:', err);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClients = clients.filter(client =>
    (client.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (client.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );
  

  const handleClientClick = (clientId) => {
    // Navigate to the profile page of the client (can be a detailed view)
    history(`/clients/${clientId}`);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Clients</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Client List */}
      {loading ? (
        <div>Loading clients...</div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {filteredClients.length === 0 ? (
            <p>No clients found</p>
          ) : (
            <ul>
              {filteredClients.map(client => (
                <li
                  key={client.id}
                  className="p-4 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleClientClick(client.id)}
                >
                  <h3 className="font-semibold">{client.firstName} {client.lastName}</h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
