import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const CreateSectionCard = () => {
  const { adminCreate } = useAppContext();
  const [branchName, setBranchName] = useState('');
  const [semester, setSemester] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  const handleCreateSection = () => {
    adminCreate({
      endpoint: "section",
      body: { branchName, semester, sectionName, departmentName },
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Create Section</h2>
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
        <label htmlFor="sectionName" className="block font-medium text-gray-700">
          Section Name
        </label>
        <input
          type="text"
          id="sectionName"
          name="sectionName"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          required
        />
      </div>
      <button
        type="button"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
        onClick={handleCreateSection}
      >
        Create Section
      </button>
    </div>
  );
};

export default CreateSectionCard;
