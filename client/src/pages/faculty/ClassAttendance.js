import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';

const ClassAttendance = () => {
  const { tid } = useParams();
  const [attendance, setAttendance] = useState([]);
  const { getStudentList, markAttendance, students } = useAppContext();
  const [getList, setList] = useState(false);

  useEffect(() => {
    if (!getList) {
      setList(true);
      getStudentList(tid);
    }
  }, [getList, getStudentList, tid]);

  const handleAttendanceChange = (studentId, isPresent) => {
    const updatedAttendance = [...attendance];
    const index = updatedAttendance.findIndex((a) => a.student_id === studentId);

    if (index !== -1) {
      updatedAttendance[index].is_present = isPresent;
    } else {
      updatedAttendance.push({ student_id: studentId, is_present: isPresent });
    }

    setAttendance(updatedAttendance);
  };

  const handleSubmit = () => {
    const body = {
      studentList: attendance,
      timetableId: tid,
    };
    markAttendance(body);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary text-white">
            <th className="py-2 px-4 border-r">Student ID</th>
            <th className="py-2 px-4">Student Name</th>
            <th className="py-2 px-4">Present</th>
            <th className="py-2 px-4">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id} className="border-t">
              <td className="py-2 px-4 border-r">{student.student_id}</td>
              <td className="py-2 px-4">{student.student_name}</td>
              <td className="py-2 px-4 text-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`attendance_${student.student_id}`}
                    value="present"
                    className="form-radio"
                    onChange={() => handleAttendanceChange(student.student_id, true)}
                    checked={attendance.some((a) => a.student_id === student.student_id && a.is_present)}
                  />
                </label>
              </td>
              <td className="py-2 px-4 text-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`attendance_${student.student_id}`}
                    value="absent"
                    className="form-radio"
                    onChange={() => handleAttendanceChange(student.student_id, false)}
                    checked={attendance.some((a) => a.student_id === student.student_id && !a.is_present)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary cursor-pointer"
          onClick={handleSubmit}
        >
          Submit Attendance
        </button>
        <Link
          to="/faculty"
          className="ml-4 text-blue-500 hover:underline cursor-pointer"
        >
          Back to Faculty
        </Link>
      </div>
    </div>
  );
};

export default ClassAttendance;
