import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClientProfilePage = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch client profile and programs
    axios.get(`http://localhost:3000/api/clients/${clientId}`)
      .then(res => {
        setClient(res.data); // Set client data with programs
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch client profile:', err);
        setLoading(false);
      });
  }, [clientId]);

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (!client) return <div className="p-10">Client not found.</div>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-4">Client Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div><strong>Name:</strong> {client.first_name} {client.last_name}</div>
        <div><strong>Email:</strong> {client.email}</div>
        <div><strong>Contact:</strong> {client.contact_number}</div>
        <div><strong>Gender:</strong> {client.gender}</div>
        <div><strong>DOB:</strong> {client.date_of_birth}</div>
        <div><strong>Address:</strong> {client.address}</div>

        {/* Programs section */}
        {client.programs && client.programs.length > 0 ? (
          <div className="pt-4">
            <strong className="block mb-2">Enrolled Programs:</strong>
            <ul className="list-disc list-inside space-y-1">
              {client.programs.map(program => (
                <li key={program.id}>
                  <span className="font-medium">{program.name}</span>
                  {program.description && (
                    <span className="text-sm text-gray-600 ml-2">({program.description})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="pt-4">
            <strong className="block mb-2">No programs enrolled</strong>
            <p>This client is not enrolled in any programs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfilePage;
