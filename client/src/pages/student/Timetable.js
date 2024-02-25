import React from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const TimetableToday = () => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { timetable, timetableLoading, getTimetable } = useAppContext();

  if (!timetable) {
    if (!timetableLoading) {
      getTimetable();
    }
    return <Loading />;
  }

  console.log(timetable);

  return (
    <div className="w-full h-screen flex items-start justify-center">
      <div className="mt-8 p-4 bg-background border border-primary rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-4">{today}</h1>
        <table className="w-full table-auto border border-primary">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 border border-primary">#</th>
              <th className="p-3 border border-primary">Subject</th>
              <th className="p-3 border border-primary text-center">Start Time</th>
              <th className="p-3 border border-primary text-center">End Time</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((classData, index) => (
              <tr key={index} className={classData.isOngoing ? "bg-primary-light cursor-pointer" : ""}>
                <td className={`p-3 border border-primary text-sm ${classData.isOngoing ? "text-red-500" : ""}`}>{index + 1}</td>
                <td className={`p-3 border border-primary ${classData.isOngoing ? "text-secondary" : ""}`}>
                  {classData.isOngoing ? "(Ongoing) " : ""}{classData.subjectName}
                </td>
                <td className={`p-3 border border-primary text-center ${classData.isOngoing ? "text-secondary" : ""}`}>
                  {classData.startTime}
                </td>
                <td className={`p-3 border border-primary text-center ${classData.isOngoing ? "text-secondary" : ""}`}>
                  {classData.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableToday;
