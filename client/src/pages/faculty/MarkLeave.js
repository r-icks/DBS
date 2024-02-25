import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const MarkLeaveForm = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(tomorrow.getDate() + 7);

  const [selectedDate, setSelectedDate] = useState('');
  const [reason, setReason] = useState('');


  const { markLeave, user} = useAppContext();

  const availableLeaves = user.numLeaves; 

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      date: selectedDate,
      reason: reason,
    };

    await markLeave(body);

    console.log('Leave marked successfully');
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Mark Leave Form</h2>
        <p className="text-gray-700 mb-4">
          Available Leaves: {availableLeaves}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block font-medium text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="border border-gray-300 rounded-md p-2 w-full"
              min={tomorrow.toISOString().split('T')[0]}
              max={nextWeek.toISOString().split('T')[0]}
              required
              onChange={handleDateChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reason" className="block font-medium text-gray-700">
              Reason for Leave:
            </label>
            <textarea
              id="reason"
              name="reason"
              className="border border-gray-300 rounded-md p-2 w-full"
              rows="4"
              required
              onChange={handleReasonChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarkLeaveForm;
