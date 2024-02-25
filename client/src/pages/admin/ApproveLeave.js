import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../../context/appContext';
import Loading from "../Loading";

const LeaveRequestCard = ({ leaveId, studentName, studentID, reason, date, onAction }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
      <p>
        <strong>Student Name:</strong> {studentName}
      </p>
      <p>
        <strong>Student ID:</strong> {studentID}
      </p>
      <p>
        <strong>Reason:</strong> {reason}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600"
          onClick={() => onAction(true, leaveId)}
        >
          <FaCheck className="mr-2" /> Approve
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-red-600"
          onClick={() => onAction(false, leaveId)}
        >
          <FaTimes className="mr-2" /> Deny
        </button>
      </div>
    </div>
  );
};

const ApproveLeave = () => {
  const { leaves, leavesLoading, getPendingLeaves, leaveUpdate } = useAppContext();

  if(!leaves){
    if(!leavesLoading){
      getPendingLeaves();
    }
    return <Loading />
  }

  if (leaves.length === 0) {
    return <p className="text-center text-gray-500">No pending leaves</p>;
  }

  const handleAction = (leaveStatus, leave_id) => {
    leaveUpdate({leaveStatus, leave_id})
  };

  return (
    <div className="p-4">
      {leaves.map((leave) => (
        <LeaveRequestCard
          key={leave.leave_id}
          leaveId={leave.leave_id}
          studentName={leave.student_name}
          studentID={leave.student_id}
          reason={leave.reason}
          date={leave.date}
          onAction={(status, leaveId) => handleAction(status, leaveId)}
        />
      ))}
    </div>
  );
};

export default ApproveLeave;
