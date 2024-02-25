import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const CreateUserCard = () => {
  const { adminCreate } = useAppContext();
  const [isTeacher, setIsTeacher] = useState(true);
  const [userID, setUserID] = useState('');
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [numLeaves, setNumLeaves] = useState('');

  const handleCreateUser = () => {
    if (isTeacher) {
      adminCreate({
        endpoint: "teacher",
        body: { departmentName: department, teacherId: userID, numLeaves },
      });
    } else {
      adminCreate({
        endpoint: "student",
        body: { studentId: userID, departmentName: department, branchName: branch, semester, sectionName: section },
      });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`${
              isTeacher ? 'bg-secondary' : 'bg-primary'
            } text-white py-2 px-4 rounded-md cursor-pointer`}
            onClick={() => setIsTeacher(true)}
          >
            Teacher
          </button>
          <button
            className={`${
              !isTeacher ? 'bg-secondary' : 'bg-primary'
            } text-white py-2 px-4 rounded-md cursor-pointer`}
            onClick={() => setIsTeacher(false)}
          >
            Student
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">
          Create {isTeacher ? 'Teacher' : 'Student'}
        </h2>
        <div className="mb-4">
          <label htmlFor="userID" className="block font-medium text-gray-700">
            {isTeacher ? 'Teacher ID' : 'Student ID'}
          </label>
          <input
            type="text"
            id="userID"
            name="userID"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="department" className="block font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        {isTeacher && (
          <div className="mb-4">
            <label htmlFor="numLeaves" className="block font-medium text-gray-700">
              Number of Leaves
            </label>
            <input
              type="text"
              id="numLeaves"
              name="numLeaves"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={numLeaves}
              onChange={(e) => setNumLeaves(e.target.value)}
            />
          </div>
        )}
        {!isTeacher && (
          <>
            <div className="mb-4">
              <label htmlFor="branch" className="block font-medium text-gray-700">
                Branch
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="semester" className="block font-medium text-gray-700">
                Semester
              </label>
              <input
                type="text"
                id="semester"
                name="semester"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="section" className="block font-medium text-gray-700">
                Section
              </label>
              <input
                type="text"
                id="section"
                name="section"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
          </>
        )}
        <button
          type="button"
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
          onClick={handleCreateUser}
        >
          Create {isTeacher ? 'Teacher' : 'Student'}
        </button>
      </div>
    </div>
  );
};

export default CreateUserCard;
