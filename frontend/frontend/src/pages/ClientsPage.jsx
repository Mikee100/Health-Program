import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: 'all',
    ageGroup: 'all',
    sortBy: 'name-asc'
  });
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, programsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/clients'),
          axios.get('http://localhost:3000/api/programs')
        ]);
        
        setClients(clientsRes.data);
        setAvailablePrograms(programsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      gender: 'all',
      ageGroup: 'all',
      sortBy: 'name-asc'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = 
      (client.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (client.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (client.contact_number?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    // Gender filter
    const matchesGender = 
      filters.gender === 'all' || 
      (client.gender && client.gender.toLowerCase() === filters.gender.toLowerCase());

    // Age group filter
    const age = calculateAge(client.date_of_birth);
    const matchesAgeGroup = 
      filters.ageGroup === 'all' ||
      (filters.ageGroup === 'child' && age && age < 13) ||
      (filters.ageGroup === 'teen' && age && age >= 13 && age < 20) ||
      (filters.ageGroup === 'adult' && age && age >= 20 && age < 60) ||
      (filters.ageGroup === 'senior' && age && age >= 60);

    return matchesSearch && matchesGender && matchesAgeGroup;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name-asc':
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      case 'name-desc':
        return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
      case 'recent':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'oldest':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case 'age-asc':
        return (calculateAge(a.date_of_birth) || 0 - (calculateAge(b.date_of_birth) || 0));
      case 'age-desc':
        return (calculateAge(b.date_of_birth) || 0 - (calculateAge(a.date_of_birth) || 0));
      default:
        return 0;
    }
  });

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Client Management</h2>
          <button 
            onClick={() => navigate('/clients/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Client
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search clients by name, email or phone..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg 
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              onClick={toggleFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Advanced Filters - Collapsible */}
          {isFiltersOpen && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select
                    name="ageGroup"
                    value={filters.ageGroup}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Ages</option>
                    <option value="child">Child (0-12)</option>
                    <option value="teen">Teen (13-19)</option>
                    <option value="adult">Adult (20-59)</option>
                    <option value="senior">Senior (60+)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="age-asc">Age (Youngest first)</option>
                    <option value="age-desc">Age (Oldest first)</option>
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{sortedClients.length}</span> of <span className="font-medium">{clients.length}</span> clients
          </p>
        </div>

        {/* Client List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {sortedClients.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No clients found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sortedClients.map(client => {
                  const age = calculateAge(client.date_of_birth);
                  return (
                    <li
                      key={client.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleClientClick(client.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {client.first_name} {client.last_name}
                              {age && <span className="ml-2 text-sm font-normal text-gray-500">({age} years)</span>}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {client.email}
                              </p>
                              {client.contact_number && (
                                <p className="text-sm text-gray-600 flex items-center">
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {client.contact_number}
                                </p>
                              )}
                              {client.gender && (
                                <p className="text-sm text-gray-600 flex items-center capitalize">
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {client.gender.toLowerCase()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      {/* Programs */}
                      {client.programs?.length > 0 && (
                        <div className="mt-3 ml-16">
                          <div className="flex flex-wrap gap-2">
                            {client.programs.map(program => (
                              <span 
                                key={program.id} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {program.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;