import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const RequestLeave = () => {
  const { requestLeave } = useAppContext();
  const [selectedDate, setSelectedDate] = useState('');
  const [reason, setReason] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    requestLeave({ date: selectedDate, reason });
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 7);

  return (
    <div className="w-full h-screen flex items-start justify-center">
      <div className="mt-8 p-4 bg-background border border-primary rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-4">Request Leave</h1>
        <form onSubmit={handleSubmit} className="text-primary">
          <div className="mb-4">
            <label htmlFor="date" className="block font-medium mb-2">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-primary p-2 rounded-lg focus:outline-none focus:border-secondary"
              required
              max={new Date().toISOString().split('T')[0]}
              min={minDate.toISOString().split('T')[0]} 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block font-medium mb-2">Reason for Leave:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={handleReasonChange}
              className="w-full border border-primary p-2 rounded-lg focus:outline-none focus:border-secondary"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-primary text-white rounded-lg py-2 px-4 hover:bg-secondary"
          >
            Request Leave
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestLeave;
