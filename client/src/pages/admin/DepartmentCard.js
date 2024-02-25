import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const CreateDepartmentCard = () => {
  const {adminCreate} = useAppContext();
  const [departmentName, setDepartmentName] = useState('');

  const handleCreateDepartment = () => {
    adminCreate({endpoint:'department',body:{departmentName}})
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Create Department</h2>
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
        onClick={handleCreateDepartment}
      >
        Create Department
      </button>
    </div>
  );
};

export default CreateDepartmentCard;
