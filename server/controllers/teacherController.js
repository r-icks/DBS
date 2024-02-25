import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError, NotFoundError, BadRequestError } from '../Errors/index.js';
import moment from 'moment';
import db from '../db/connect.js';

const getClasses = async (req, res) => {
    const role = req.user.userRole;
    const teacherId = req.user.userId;

    if (role !== 'teacher') {
        throw new UnauthenticatedError('Teacher access required!');
    }

    const currentWeekday = moment().format('dddd');
    const currentTime = moment();

    const markedAttendance = await db.all(`
        SELECT t.timetable_id, s.subject_name, sec.section_name, c.branch_id, d.department_name, c.semester, t.start_time, t.end_time
        FROM teaches te
        JOIN timetable t ON te.teacher_id = ? AND t.weekday = ?
        JOIN subject s ON te.subject_id = s.subject_id
        JOIN section sec ON te.section_id = sec.section_id
        JOIN course c ON sec.course_id = c.course_id
        JOIN branch b ON c.branch_id = b.branch_id
        JOIN department d ON b.department_id = d.department_id
        WHERE t.subject_id = te.subject_id
    `, [teacherId, currentWeekday]);

    const formattedMarkedAttendance = markedAttendance.map(entry => {
        const sectionDetails = `${entry.section_name}, Semester: ${entry.semester}, Branch: ${entry.branch_id}, Department: ${entry.department_name}`;
        const startTime = moment(entry.start_time, 'hh:mm A');
        const endTime = moment(entry.end_time, 'hh:mm A');

        return {
            timetableId: entry.timetable_id,
            subjectName: entry.subject_name,
            sectionName: sectionDetails,
            startTime: entry.start_time,
            endTime: entry.end_time,
            isOngoing: currentTime.isBetween(startTime, endTime)
        };
    });

    res.json({ classes: formattedMarkedAttendance }).status(StatusCodes.OK);
};

const getStudentList = async (req, res) => {
    const role = req.user.userRole;
    const teacherId = req.user.userId;
    const { timetableId } = req.body;

    if (role !== 'teacher') {
        throw new UnauthenticatedError('Teacher access required!');
    }

    if (!timetableId) {
        throw new BadRequestError('Please provide a timetableId');
    }

    const sectionDetails = await db.get(`
        SELECT sec.section_id
        FROM timetable t
        JOIN teaches te ON t.timetable_id = ? AND t.subject_id = te.subject_id AND te.teacher_id = ?
        JOIN section sec ON te.section_id = sec.section_id
    `, [timetableId, teacherId]);

    if (!sectionDetails) {
        throw new NotFoundError('Section not found for the given timetableId and teacherId');
    }

    const studentsList = await db.all(`
        SELECT student_id, name as student_name
        FROM student
        WHERE section_id = ? AND name IS NOT NULL
    `, [sectionDetails.section_id]);

    res.json({ students: studentsList }).status(StatusCodes.OK);
};

const markTeacherLeave = async (req, res) => {
    const role = req.user.userRole;
    const teacherId = req.user.userId;
    const { date, reason } = req.body;

    if (role !== 'teacher') {
        throw new UnauthenticatedError('Teacher access required!');
    }

    if (!date || !reason) {
        throw new BadRequestError('Please provide both date and reason');
    }

    const teacher = await db.get('SELECT * FROM teacher WHERE teacher_id = ?', [teacherId]);

    if (!teacher) {
        throw new NotFoundError('Teacher not found');
    }

    if (teacher.num_leaves <= 0) {
        throw new BadRequestError('No leaves available for the teacher');
    }

    await db.run('INSERT INTO teacher_leaves (teacher_id, date, reason) VALUES (?, ?, ?)', [teacherId, date, reason]);

    res.json({ msg: 'Leave marked successfully' }).status(StatusCodes.OK);
};

const pushTeacherNotification = async (req, res) => {
    const role = req.user.userRole;
    const teacherId = req.user.userId;
    const { message, status, studentId } = req.body;

    if (role !== 'teacher') {
        throw new UnauthenticatedError('Teacher access required!');
    }

    if (!message || !status || !studentId) {
        throw new BadRequestError('Please provide message, status, and studentId');
    }

    const isTeaching = await db.get('SELECT 1 FROM teaches WHERE teacher_id = ? AND section_id IN (SELECT section_id FROM student WHERE student_id = ?)', [teacherId, studentId]);

    if (!isTeaching) {
        throw new BadRequestError('Invalid assignment. Teacher does not teach the specified student.');
    }

    await db.run(
        'INSERT INTO teacher_notification (message, status, teacher_id, student_id) VALUES (?, ?, ?, ?)',
        [message, status, teacherId, studentId]
    );

    res.json({ msg: 'Teacher notification pushed successfully' }).status(StatusCodes.OK);
};

const markAttendance = async (req, res) => {
    const role = req.user.userRole;
    const { studentList, timetableId } = req.body;

    if (role !== 'teacher') {
        throw new UnauthenticatedError('Teacher access required!');
    }

    if (!timetableId || !studentList || !Array.isArray(studentList)) {
        throw new BadRequestError('Invalid input data');
    }

    const timetableEntry = await db.get('SELECT * FROM timetable WHERE timetable_id = ?', [timetableId]);

    if (!timetableEntry) {
        throw new NotFoundError('Timetable entry not found');
    }

    const currentDate = new Date().toISOString().split('T')[0];

    for (const student of studentList) {
        const { student_id, is_present } = student;

        await db.run(
            'INSERT INTO attendance (student_id, timetable_id, date, is_present) VALUES (?, ?, ?, ?)',
            [student_id, timetableId, currentDate, is_present]
        );
    }

    res.json({ msg: 'Attendance marked successfully' }).status(StatusCodes.OK);
};


export { getClasses, getStudentList, markTeacherLeave, pushTeacherNotification, markAttendance};