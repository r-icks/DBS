import React from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';
import { NavLink } from 'react-router-dom';

const FacultyDashboard = () => {
  const { classes, classesLoading, getClasses } = useAppContext();
  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!classes) {
    if (!classesLoading) {
      getClasses();
    }
    return <Loading />;
  }

  console.log(classes);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{todayDate}</h2>
      
      {classes.map((classData, index) => (
        <NavLink
          key={index}
          to={`/faculty/${classData.timetableId}`}
          className="mb-4 block no-underline focus:outline-none"
        >
          <div
            className={`border rounded-lg p-4 hover:border-secondary cursor-pointer ${
              classData.isOngoing ? 'bg-primary-light' : ''
            }`}
          >
            <p className="text-xl font-bold">{classData.subjectName}</p>
            <p>Section: {classData.sectionName}</p>
            <p>
              Timings: {classData.startTime} - {classData.endTime}
            </p>
          </div>
        </NavLink>
      ))}

      {classes.length === 0 && <p>No classes available</p>}
    </div>
  );
};

export default FacultyDashboard;
