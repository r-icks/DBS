import React from 'react';
import { motion } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { FaUserGraduate, FaChalkboardTeacher, FaUserLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <ParticlesBg type="cobweb" bg={true} />
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-center p-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-extrabold mb-4"
          >
            Welcome to the Student Teacher Management System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg mb-8"
          >
            Efficiently track and manage attendance records
          </motion.p>
          <div className="flex justify-center space-x-4">
            <Link to="/student-login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                <FaUserGraduate className="inline-block mr-2" /> Login as Student
              </motion.button>
            </Link>
            <Link to="/teacher-login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              >
                <FaChalkboardTeacher className="inline-block mr-2" /> Login as Teacher
              </motion.button>
            </Link>
            <Link to="/admin-login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
              >
                <FaUserLock className="inline-block mr-2" /> Login as Admin
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
