import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const AddTimetableCard = () => {
  const { sections, sectionsLoading, getAllSections, adminCreate } = useAppContext();
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
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

  const handleAddTimetableEntry = async () => {
    const timetableEntryData = {
      sectionId: parseInt(section),
      subjectName: subject,
      weekday: weekDay,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
    };

    await adminCreate({ endpoint: 'timeTable', body: timetableEntryData });
  };

  const formatTime = (time) => {
    const formattedTime = new Date(`2000-01-01T${time}`);
    return formattedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Add Timetable Entry</h2>
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
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          >
            <option value="">Select a Section</option>
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
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
        <label htmlFor="weekDay" className="block font-medium text-gray-700">
          WeekDay
        </label>
        <select
          id="weekDay"
          name="weekDay"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={weekDay}
          onChange={(e) => setWeekDay(e.target.value)}
          required
        >
          <option value="">Select a WeekDay</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block font-medium text-gray-700">
          End Time
        </label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <button
        type="button"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
        onClick={handleAddTimetableEntry}
      >
        Add Timetable Entry
      </button>
    </div>
  );
};

export default AddTimetableCard;
