import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Importing React-Select

const EnrollmentsPage = () => {
  const [client, setClient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);  // Storing selected programs

  const [message, setMessage] = useState('');

  // Fetch programs
  useEffect(() => {
    axios.get('http://localhost:3000/api/programs')
      .then(res => {
        const data = res.data;
        setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to fetch programs:', err.message);
        setPrograms([]);
      });
  }, []);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleProgramChange = (selectedOptions) => {
    setSelectedPrograms(selectedOptions);  // Set selected programs as an array of objects
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new client
      const res = await axios.post('http://localhost:3000/api/clients', client);
      const newClient = res.data;
      console.log('Client created:', newClient);

      // Now, enroll the client in the selected programs
      for (let program of selectedPrograms) {
        await axios.post('http://localhost:3000/api/enroll', {
          clientId: newClient.id,
          programId: program.value,  // Send the program ID
        });
      }

      setMessage(`Client ${newClient.first_name} enrolled successfully in the selected programs.`);
      setClient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        address: '',
      });
      setSelectedPrograms([]);
    } catch (err) {
      console.error(err);
      setMessage('Failed to enroll client.');
    }
  };

  // Mapping programs for React-Select
  const programOptions = programs.map(program => ({
    value: program.id,
    label: program.name,
  }));

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Enroll Client</h2>

      {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
        <input name="firstName" type="text" placeholder="First Name" value={client.firstName} onChange={handleChange} className="p-2 border rounded" required />
        <input name="lastName" type="text" placeholder="Last Name" value={client.lastName} onChange={handleChange} className="p-2 border rounded" required />
        <input name="dateOfBirth" type="date" value={client.dateOfBirth} onChange={handleChange} className="p-2 border rounded" />
        <select name="gender" value={client.gender} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input name="contactNumber" type="text" placeholder="Contact Number" value={client.contactNumber} onChange={handleChange} className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={client.email} onChange={handleChange} className="p-2 border rounded" />
        <input name="address" type="text" placeholder="Address" value={client.address} onChange={handleChange} className="p-2 border rounded" />

        <div className="col-span-2">
          <label className="block mb-1 font-medium">Select Programs</label>
          <Select
            isMulti
            options={programOptions}
            value={selectedPrograms}
            onChange={handleProgramChange}
            placeholder="Select Programs"
            className="w-full"
            classNamePrefix="react-select"
            getOptionLabel={(e) => <div>{e.label}</div>}
            getOptionValue={(e) => e.value}
          />
          <div className="mt-2 text-sm text-gray-600">
            {selectedPrograms.length === 0 ? 'No programs selected' : `${selectedPrograms.length} program(s) selected`}
          </div>
        </div>

        <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Register Client
        </button>
      </form>
    </div>
  );
};

export default EnrollmentsPage;
