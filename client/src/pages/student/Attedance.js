import React from 'react';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const getColorClass = (attendance) => {
  if (attendance < 75) {
    return 'text-red-500 border-red-500';
  } else if (attendance < 85) {
    return 'text-yellow-500 border-yellow-500';
  }
  return 'text-accent border-accent';
};

export const Attendance = () => {
  const { attendance, attendanceLoading, getAttendance } = useAppContext();

  if (!attendance) {
    if (!attendanceLoading) {
      getAttendance();
    }
    return <Loading />;
  }

  return (
    <div className="w-full bg-background p-4 overflow-x-auto">
      <div className="flex flex-wrap justify-center">
        {attendance.map((subject, index) => {
          const totalClasses = subject.totalClasses;
          const attendedClasses = subject.attendedClasses;
          const percentage = totalClasses !== 0 ? (attendedClasses / totalClasses) * 100 : 0;

          return (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className={`bg-white rounded-lg p-4 shadow-lg ${getColorClass(percentage)}`}>
                <h2 className="text-xl font-semibold text-primary">{subject.subjectName}</h2>
                <div className="p-4">
                  <div className="w-24 h-24 mx-auto">
                    <div className="relative" style={{ paddingBottom: '100%' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 relative">
                          <div className="border-2 border-primary rounded-full absolute inset-0"></div>
                          <div
                            className={`border-2 rounded-full absolute inset-0 ${getColorClass(percentage)}`}
                            style={{
                              clipPath: `polygon(0 0, 100% 0, 100% ${100 - percentage}%, 0 100%)`,
                            }}
                          ></div>
                          <div className="flex items-center justify-center h-full">
                            <span className="text-2xl font-semibold">{Math.floor(percentage)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={`text-primary text-center ${getColorClass(percentage)}`}>
                    Classes attended {attendedClasses}/{totalClasses}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
