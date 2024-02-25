import React, { useState } from 'react';
import { RiLockPasswordFill, RiArrowRightSFill } from 'react-icons/ri';
import { useAppContext } from '../context/appContext';
import { Link, useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { useEffect } from 'react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const {setupUser, isLoading, user} = useAppContext();

  const handleLogin = () => {
    setupUser({currentUser: {password}, endpoint: 'admin'});
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/admin')
      }, 3000)
    }
  }, [user, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <Alert />
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <div className="mb-4 relative rounded-full border border-gray-300 py-2 px-3">
          <input
            type="password"
            placeholder="Admin Password"
            className="w-full bg-transparent outline-none pl-8 pr-4 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <RiLockPasswordFill className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Login <RiArrowRightSFill className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
