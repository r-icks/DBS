import React, { useState } from 'react';
import CreateBranchCard from './BranchCard';
import CreateSectionCard from './SectionCard';
import AssignSubjectCard from './AssignSubject';
import CreateDepartmentCard from './DepartmentCard';

const ManageComponent = () => {
  const [selectedOption, setSelectedOption] = useState(''); // State to store the selected option

  // Render the selected card based on the selectedOption
  const renderSelectedCard = () => {
    switch (selectedOption) {
      case 'Department':
        return <CreateDepartmentCard />;
      case 'Branch':
        return <CreateBranchCard />;
      case 'Section':
        return <CreateSectionCard />;
      case 'Subject':
        return <AssignSubjectCard />;
      default:
        return null; // Render nothing if no option is selected
    }
  };

  // Handle dropdown selection change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <select
          className="border border-gray-300 rounded-md p-2 w-full"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="">Select an option</option>
          <option value="Department">Department</option>
          <option value="Branch">Branch</option>
          <option value="Section">Section</option>
          <option value="Subject">Subject</option>
        </select>
      </div>
      {renderSelectedCard()}
    </div>
  );
};

export default ManageComponent;
