import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError, BadRequestError, NotFoundError } from '../Errors/index.js';
import moment from 'moment';
import db from '../db/connect.js';

const getSubjectAttendance = async (req, res) => {
    const role = req.user.userRole;
    const studentId = req.user.userId;

    if (role !== 'student') {
        throw new UnauthenticatedError('Student access required!');
    }

    const studentSection = await db.get('SELECT section_id FROM student WHERE student_id = ?', [studentId]);
    if (!studentSection) {
        throw new BadRequestError('Student section not found');
    }

    const studentCourse = await db.get('SELECT course_id FROM section WHERE section_id = ?', [studentSection.section_id]);
    if (!studentCourse) {
        throw new BadRequestError('Student course not found');
    }

    const subjects = await db.all('SELECT subject_id, subject_name FROM subject WHERE course_id = ?', [studentCourse.course_id]);

    const subjectAttendance = [];

    for (const subject of subjects) {
        const { subject_id, subject_name } = subject;

        const attendanceEntries = await db.all(
            'SELECT date, is_present FROM attendance WHERE student_id = ? AND EXISTS (SELECT 1 FROM timetable t WHERE t.timetable_id = attendance.timetable_id AND t.section_id = ? AND t.subject_id = ?)',
            [studentId, studentSection.section_id, subject_id]
        );

        const approvedLeaves = await db.all('SELECT date FROM student_leave WHERE student_id = ? AND leaveStatus = true', [studentId]);
        const approvedLeavesDates = approvedLeaves.map((leave) => leave.date);

        let attendedClasses = 0;
        let totalClasses = attendanceEntries.length;

        for (const entry of attendanceEntries) {
            if (entry.is_present === 1 || approvedLeavesDates.includes(entry.date)) {
                attendedClasses++;
            }
        }

        subjectAttendance.push({
            subjectName: subject_name,
            attendedClasses: attendedClasses,
            totalClasses: totalClasses,
        });
    }

    res.json({ subjectAttendance }).status(StatusCodes.OK);
};



const postLeaveRequest = async (req, res) => {
    const role = req.user.userRole;
    const studentId = req.user.userId;
    const { date, reason } = req.body;

    if (role !== 'student') {
        throw new UnauthenticatedError('Student access required!');
    }

    if (!date || !reason) {
        throw new BadRequestError('Please provide both date and reason');
    }

    const existingLeave = await db.get('SELECT * FROM student_leave WHERE student_id = ? AND date = ?', [studentId, date]);

    if (existingLeave) {
        throw new BadRequestError('Leave request for this date already exists');
    }

    await db.run('INSERT INTO student_leave (student_id, date, reason) VALUES (?, ?, ?)', [studentId, date, reason]);

    res.json({ msg: 'Leave request submitted successfully' }).status(StatusCodes.OK);
};

const getStudentTimetable = async (req, res) => {
    const role = req.user.userRole;
    const studentId = req.user.userId;

    if (role !== 'student') {
        throw new UnauthenticatedError('Student access required!');
    }

    const currentWeekday = moment().format('dddd');

    const timetable = await db.all(`
        SELECT s.subject_name, t.start_time, t.end_time, tea.teacher_id
        FROM timetable t
        JOIN subject s ON t.subject_id = s.subject_id
        JOIN section sec ON t.section_id = sec.section_id
        JOIN student st ON sec.section_id = st.section_id
        LEFT JOIN teaches tea ON t.subject_id = tea.subject_id AND t.section_id = tea.section_id
        WHERE st.student_id = ? AND t.weekday = ?
    `, [studentId, currentWeekday]);

    const currentDate = moment().format('YYYY-MM-DD');

    const timetableWithOngoingFlag = await Promise.all(timetable.map(async entry => {
        if (entry.teacher_id) {
            const teacherOnLeave = await db.get('SELECT 1 FROM teacher_leaves WHERE teacher_id = ? AND date = ?', [entry.teacher_id, currentDate]);

            if (teacherOnLeave) {
                return null; 
            }
        }

        const startTime = moment(entry.start_time, 'hh:mm A');
        const endTime = moment(entry.end_time, 'hh:mm A');
        const currentTime = moment();

        return {
            subjectName: entry.subject_name,
            startTime: entry.start_time,
            endTime: entry.end_time,
            isOngoing: currentTime.isBetween(startTime, endTime)
        };
    }));

    const filteredTimetable = timetableWithOngoingFlag.filter(entry => entry !== null);

    res.json({ timetable: filteredTimetable }).status(StatusCodes.OK);
};


const getStudentNotifications = async (req, res) => {
    const role = req.user.userRole;
    const studentId = req.user.userId;

    if (role !== 'student') {
        throw new UnauthenticatedError('Student access required!');
    }

    const notifications = await getUpdatedNotifications(studentId);

    res.status(StatusCodes.OK).json({ notifications });
};

const getUpdatedNotifications = async (studentId) => {
    const notifications = [];

    const adminNotifications = await db.all(`
        SELECT an.notif_id, an.message, an.status
        FROM admin_notif an
        JOIN admin_student_notification asn ON an.notif_id = asn.notification_id
        WHERE asn.student_id = ?
    `, [studentId]);

    adminNotifications.forEach((adminNotification) => {
        notifications.push({
            name: 'admin',
            message: adminNotification.message,
            status: adminNotification.status,
            notif_id: adminNotification.notif_id,
            role: 'admin'
        });
    });

    const teacherNotifications = await db.all(`
        SELECT tn.notif_id, tn.message, tn.status, t.name
        FROM teacher_notification tn
        JOIN teacher t ON tn.teacher_id = t.teacher_id
        WHERE tn.student_id = ?
    `, [studentId]);

    teacherNotifications.forEach((teacherNotification) => {
        notifications.push({
            name: teacherNotification.name,
            message: teacherNotification.message,
            status: teacherNotification.status,
            notif_id: teacherNotification.notif_id,
            role: 'teacher'
        });
    });

    return notifications;
};

const deleteNotification = async (req, res) => {
    const role = req.user.userRole;
    const studentId = req.user.userId;
    const { notificationRole, notification_id } = req.body;

    if (role !== 'student') {
        throw new UnauthenticatedError('Student access required!');
    }

    if (!notificationRole || !notification_id) {
        throw new BadRequestError('Please provide both notificationRole and notification_id');
    }

    if (notificationRole === 'admin') {
        await db.run('DELETE FROM admin_student_notification WHERE student_id = ? AND notification_id = ?', [studentId, notification_id]);

        const remainingEntries = await db.get('SELECT COUNT(*) AS count FROM admin_student_notification WHERE notification_id = ?', [notification_id]);

        if (remainingEntries.count === 0) {
            await db.run('DELETE FROM admin_notif WHERE notif_id = ?', [notification_id]);
        }
    } else if (notificationRole === 'teacher') {
        await db.run('DELETE FROM teacher_notification WHERE student_id = ? AND notif_id = ?', [studentId, notification_id]);
    }

    const updatedNotifications = await getUpdatedNotifications(studentId);

    res.status(StatusCodes.OK).json({ notifications: updatedNotifications });
};

export { getSubjectAttendance, postLeaveRequest, getStudentTimetable, getStudentNotifications, deleteNotification};