import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';

const Notify = () => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('informational'); // Default status: info

  const { pushTeacherNotification } = useAppContext();

  const handleRecipientChange = (e) => {
    setSelectedRecipient(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleStatusChange = (e) => {
    setNotificationStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      message: message,
      status: notificationStatus,
      studentId: selectedRecipient,
    };
    await pushTeacherNotification(body);
    console.log('Notification sent successfully');
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Notify</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="recipient" className="block font-medium text-gray-700">Student ID:</label>
            <input
              type="text"
              id="recipient"
              name="recipient"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={selectedRecipient}
              onChange={handleRecipientChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block font-medium text-gray-700">Notification Status:</label>
            <select
              id="status"
              name="status"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={notificationStatus}
              onChange={handleStatusChange}
            >
              <option value="informational">Informational</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block font-medium text-gray-700">Message/Notification:</label>
            <textarea
              id="message"
              name="message"
              className="border border-gray-300 rounded-md p-2 w-full"
              rows="4"
              value={message}
              onChange={handleMessageChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notify;
