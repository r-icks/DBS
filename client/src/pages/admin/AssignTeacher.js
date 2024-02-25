import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const AssignTeacherCard = () => {
  const { sections, sectionsLoading, getAllSections, adminCreate } = useAppContext();
  const [teacherID, setTeacherID] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionOptions, setSectionOptions] = useState([]);

  useEffect(() => {
    if (!sections) {
      if (!sectionsLoading) {
        getAllSections();
      }
    } else {
      setSectionOptions(
        sections.map((section) => ({
          value: section.section_id,
          label: `Sem-${section.semester} Sec-${section.section_name} ${section.branch_name} ${section.department_name}`,
        }))
      );
    }
  }, [sections, sectionsLoading, getAllSections]);

  const handleAssignTeacher = async () => {
    const assignTeacherData = {
      teacherId: teacherID,
      sectionId: selectedSection,
      subjectName: subject,
    };

    await adminCreate({ endpoint: 'assignTeacher', body: assignTeacherData });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Assign Teacher</h2>
      <div className="mb-4">
        <label htmlFor="teacherID" className="block font-medium text-gray-700">
          Teacher ID
        </label>
        <input
          type="text"
          id="teacherID"
          name="teacherID"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={teacherID}
          onChange={(e) => setTeacherID(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="section" className="block font-medium text-gray-700">
          Section
        </label>
        {sectionsLoading ? (
          <Loading />
        ) : (
          <select
            id="section"
            name="section"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            required
          >
            <option value="">Select a section</option>
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        type="button"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
        onClick={handleAssignTeacher}
      >
        Assign Teacher
      </button>
    </div>
  );
};

export default AssignTeacherCard;