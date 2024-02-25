import React, { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const Notify = () => {
  const { sections, sectionsLoading, getAllSections, adminCreate } = useAppContext();

  const [selectedSection, setSelectedSection] = useState('');
  const [message, setMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('informational');

  if (!sections) {
    if (!sectionsLoading) {
      getAllSections();
    }
    return <Loading />;
  }

  const sectionOptions = sections.map((section) => ({
    value: section.section_id,
    label: `Sem-${section.semester} Sec-${section.section_name} ${section.branch_name} ${section.department_name}`,
  }));

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleStatusChange = (e) => {
    setNotificationStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedSectionInfo = sections.find(
      (section) => section.section_id === parseInt(selectedSection)
    );

    const notifyData = {
      sectionId: selectedSection,
      status: notificationStatus,
      message: message,
    };

    await adminCreate({ endpoint: 'notify', body: notifyData });
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Notify</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="section" className="block font-medium text-gray-700">
              Whom to Notify:
            </label>
            <select
              id="section"
              name="section"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={selectedSection}
              onChange={handleSectionChange}
              required
            >
              <option value="">Select a section</option>
              {sectionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block font-medium text-gray-700">
              Notification Status:
            </label>
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
            <label htmlFor="message" className="block font-medium text-gray-700">
              Message/Notification:
            </label>
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
