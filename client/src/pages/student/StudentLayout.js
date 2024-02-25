import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useOutlet } from 'react-router';
import { FaUser, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import { useAppContext } from '../../context/appContext';
import Alert from '../Alert';

const navLinks = [
  { to: '/student', label: 'Attendance' },
  { to: '/student/timetable', label: 'Time Table' },
  { to: '/student/leave_request', label: 'Request Leave' },
  { to: '/student/notifications', label: 'Notifications' },
];

const StudentLayout = ({ children }) => {
  const outlet = useOutlet();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logoutUser, user } = useAppContext();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogoutFunction = () => {
    logoutUser();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
    <Alert />
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <nav className="flex space-x-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              activeClassName="font-semibold"
              className="hover:text-secondary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="relative group">
          <button
            className="p-2 hover:bg-red-500 rounded-full flex items-center"
            onClick={toggleUserMenu}
          >
            <FaUser className="text-xl text-white" />
            <span className="ml-2 text-white hover:text-white">
              {user.userName}
            </span>
            <FaCaretDown className="ml-2" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md ${
              isUserMenuOpen ? 'block' : 'hidden'
            }`}
          >
            <ul className="py-2">
              <li>
                <button
                  className="w-full px-4 py-2 text-gray-800 hover:bg-primary"
                  onClick={handleLogoutFunction}
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="text-xl" />
                    <span className="ml-2">Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4">
        {outlet}
      </main>
    </div>
  );
};

export default StudentLayout;
