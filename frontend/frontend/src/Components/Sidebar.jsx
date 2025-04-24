import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaSearch, FaCog, FaHeartbeat } from 'react-icons/fa';

const navItems = [
  { label: 'Clients', path: '/clients', icon: <FaUsers /> },
  { label: 'Programs', path: '/programs', icon: <FaClipboardList /> },
  { label: 'Enrollments', path: '/enrollments', icon: <FaClipboardList /> },
  { label: 'Search Clients', path: '/search', icon: <FaSearch /> },
  { label: 'Settings', path: '/settings', icon: <FaCog /> },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#1f2937] to-[#111827] text-white fixed top-0 left-0 shadow-lg p-6">
      {/* Logo/Heading */}
      <div className="flex items-center justify-center mb-10">
        <FaHeartbeat className="text-pink-500 text-3xl mr-2 animate-pulse" />
        <h1 className="text-2xl font-bold tracking-wider">Health Admin</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-4">
        {navItems.map(({ label, path, icon }, index) => (
          <NavLink
            key={index}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
                isActive
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'hover:bg-gray-700 hover:text-pink-400'
              }`
            }
          >
            <span className="text-lg mr-4">{icon}</span>
            <span className="text-md font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
