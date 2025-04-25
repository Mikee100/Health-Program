import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import ClientsPage from './pages/ClientsPage';
import ProgramsPage from './pages/ProgramsPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import SearchClientsPage from './pages/SearchClientsPage';
import ClientProfilePage from './pages/ClientProfilePage';


const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 p-6 w-full">
          <Routes>
            <Route path="/" element={<ClientsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/enrollments" element={<EnrollmentsPage />} />
            <Route path="/search" element={<SearchClientsPage />} />
            <Route path="/clients/:clientId" element={<ClientProfilePage />} />
  
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
