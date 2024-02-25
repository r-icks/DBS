import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const AssignSubjectCard = () => {
  const { adminCreate } = useAppContext();
  const [departmentName, setDepartmentName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [credits, setCredits] = useState('');

  const handleAssignSubject = () => {
    adminCreate({
      endpoint: "subject",
      body: { departmentName, branchName, semester, subjectName, credits },
    });
    console.log('Department Name:', departmentName);
    console.log('Branch Name:', branchName);
    console.log('Semester:', semester);
    console.log('Subject Name:', subjectName);
    console.log('Credits:', credits);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Assign Subject</h2>
      <div className="mb-4">
        <label htmlFor="departmentName" className="block font-medium text-gray-700">
          Department Name
        </label>
        <input
          type="text"
          id="departmentName"
          name="departmentName"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="branchName" className="block font-medium text-gray-700">
          Branch Name
        </label>
        <input
          type="text"
          id="branchName"
          name="branchName"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          required
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
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subjectName" className="block font-medium text-gray-700">
          Subject Name
        </label>
        <input
          type="text"
          id="subjectName"
          name="subjectName"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="credits" className="block font-medium text-gray-700">
          Credits
        </label>
        <input
          type="text"
          id="credits"
          name="credits"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          required
        />
      </div>
      <button
        type="button"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
        onClick={handleAssignSubject}
      >
        Assign Subject
      </button>
    </div>
  );
};

export default AssignSubjectCard;
