import React from 'react';

const StudentDetails = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4">Student Details</h1>
        <ul className="text-lg">
          <li><strong>Name:</strong> John Doe</li>
          <li><strong>Student ID:</strong> ABC12345</li>
          <li><strong>Subjects:</strong>
            <ul className="list-disc pl-6">
              <li>Mathematics</li>
              <li>Physics</li>
              <li>Chemistry</li>
              {/* Add more subjects as needed */}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDetails;
