import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all clients and their programs
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
    (client.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (client.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Clients</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-3 border rounded-lg w-full shadow-sm"
        />
      </div>

      {/* Client List */}
      {loading ? (
        <div className="text-gray-600">Loading clients...</div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {filteredClients.length === 0 ? (
            <p className="text-gray-600">No clients found</p>
          ) : (
            <ul className="divide-y">
              {filteredClients.map(client => (
                <li
                  key={client.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleClientClick(client.id)}
                >
                  <h3 className="text-lg font-semibold">
                    {client.first_name} {client.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{client.email}</p>

                  {/* Programs */}
                  {client.programs?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Programs:</span>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                        {client.programs.map(program => (
                          <li key={program.id}>{program.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
