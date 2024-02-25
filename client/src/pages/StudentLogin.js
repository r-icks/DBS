import React, { useState } from 'react';
import { RiLockPasswordFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Alert from './Alert';

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [isMember, setIsMember] = useState(true);
    const [studentID, setStudentID] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const {setupUser, isLoading, user} = useAppContext();

    const handleLogin = () => {
        setupUser({ currentUser: { studentId: studentID, password }, endpoint: 'studentLogin' });
    };
    
    const handleRegister = () => {
        setupUser({
            currentUser: { studentId: studentID, studentEmail: email, studentName: name, password },
            endpoint: 'studentRegister'
        });
    };

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/student');
            }, 3000);
        }
    }, [user, navigate]);
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <Alert />
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    {isMember ? 'Student Login' : 'Student Registration'}
                </h2>

                {!isMember && (
                    <div>
                        <div className="mb-4 relative rounded-full border border-gray-300 py-2">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full bg-transparent outline-none pl-4 pr-4 py-1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4 relative rounded-full border border-gray-300 py-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent outline-none pl-4 pr-4 py-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="mb-4 relative rounded-full border border-gray-300 py-2 px-3">
                    <input
                        type="text"
                        placeholder="Student ID"
                        className="w-full bg-transparent outline-none pl-8 pr-4 py-1"
                        value={studentID}
                        onChange={(e) => setStudentID(e.target.value)}
                    />
                    <FaUserAlt className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="mb-4 relative rounded-full border border-gray-300 py-2 px-3">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-transparent outline-none pl-8 pr-4 py-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <RiLockPasswordFill className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
                </div>


                    {isMember ? (
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            Login <RiArrowRightSFill className="inline ml-2" />
                        </button>
                    ) : (
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                            onClick={handleRegister}
                            disabled={isLoading}
                        >
                            Register <RiArrowRightSFill className="inline ml-2" />
                        </button>
                    )}

                <p
                    className="text-blue-500 cursor-pointer hover:underline mt-4"
                    onClick={() => setIsMember(!isMember)}
                >
                    {isMember ? 'Register' : 'Login'} Here
                </p>
            </div>
        </div>
    );
};

export default StudentRegistration;
