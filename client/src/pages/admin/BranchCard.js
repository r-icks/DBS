import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const CreateBranchCard = () => {
  const [branchName, setBranchName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const {adminCreate} = useAppContext();

  const handleCreateBranch = () => {
    adminCreate({endpoint:"branch", body:{departmentName, branchName}});
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Create Branch</h2>
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
      <button
        type="button"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
        onClick={handleCreateBranch}
      >
        Create Branch
      </button>
    </div>
  );
};

export default CreateBranchCard;
