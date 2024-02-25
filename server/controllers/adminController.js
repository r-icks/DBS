import {BadRequestError, UnauthenticatedError, NotFoundError} from "../Errors/index.js";
import {StatusCodes} from "http-status-codes"
import db from "../db/connect.js"


export const createDepartment = async(req, res)=>{
    const role = req.user.userRole;
    const id = req.user.userId;
    const {departmentName} = req.body;
    if(role!=="admin"){
        throw new UnauthenticatedError("Admin access required!");
    }
    if(!departmentName){
        throw new BadRequestError("Please provide the Department Name");
    }
    await db.all(
        'INSERT INTO department (department_name) VALUES (?)',
        [departmentName]
    );
    res.json({msg: `New Department: ${departmentName} created`}).status(StatusCodes.OK);
}

export const createBranch = async (req, res) => {
    const role = req.user.userRole;
    const id = req.user.userId;
    const { departmentName, branchName } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!departmentName || !branchName) {
        throw new BadRequestError("Please provide both Department Name and Branch Name");
    }

    await db.all(
        'INSERT INTO branch (department_id, branch_name) VALUES ((SELECT department_id FROM department WHERE department_name = ?), ?)',
        [departmentName, branchName]
    );

    res.json({ msg: `New Branch: ${branchName} created under ${departmentName} department` }).status(StatusCodes.OK);
};


export const createSection = async (req, res) => {
    const role = req.user.userRole;
    const id = req.user.userId;
    const { departmentName, branchName, semester, sectionName } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!departmentName || !branchName || !semester || !sectionName) {
        throw new BadRequestError("Please provide Department Name, Branch Name, Semester, and Section Name");
    }

    const existingCourse = await db.get(
        'SELECT course_id FROM course WHERE branch_id = (SELECT branch_id FROM branch WHERE branch_name = ? AND department_id = (SELECT department_id FROM department WHERE department_name = ?)) AND semester = ?',
        [branchName, departmentName, semester]
    );

    let courseId;

    if (!existingCourse) {
        await db.all(
            'INSERT INTO course (semester, branch_id) VALUES (?, (SELECT branch_id FROM branch WHERE branch_name = ? AND department_id = (SELECT department_id FROM department WHERE department_name = ?)))',
            [semester, branchName, departmentName]
        );

        courseId = (await db.get('SELECT last_insert_rowid() as id')).id;
    } else {
        courseId = existingCourse.course_id;
    }

    await db.all(
        'INSERT INTO section (section_name, course_id) VALUES (?, ?)',
        [sectionName, courseId]
    );

    res.json({ msg: `New Section: ${sectionName} created for Semester ${semester} in ${branchName} branch of ${departmentName} department` }).status(StatusCodes.OK);
};


export const createSubject = async (req, res) => {
    const role = req.user.userRole;
    const id = req.user.userId;
    const { departmentName, branchName, semester, subjectName, credits } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!departmentName || !branchName || !semester || !subjectName || !credits) {
        throw new BadRequestError("Please provide Department Name, Branch Name, Semester, Subject Name, and Credits");
    }

    const existingCourse = await db.get(
        'SELECT course_id FROM course WHERE branch_id = (SELECT branch_id FROM branch WHERE branch_name = ? AND department_id = (SELECT department_id FROM department WHERE department_name = ?)) AND semester = ?',
        [branchName, departmentName, semester]
    );

    let courseId;

    if (!existingCourse) {
        await db.all(
            'INSERT INTO course (semester, branch_id) VALUES (?, (SELECT branch_id FROM branch WHERE branch_name = ? AND department_id = (SELECT department_id FROM department WHERE department_name = ?)))',
            [semester, branchName, departmentName]
        );

        courseId = (await db.get('SELECT last_insert_rowid() as id')).id;
    } else {
        courseId = existingCourse.course_id;
    }

    await db.all(
        'INSERT INTO subject (subject_name, course_id, credits) VALUES (?, ?, ?)',
        [subjectName, courseId, credits]
    );

    res.json({ msg: `New Subject: ${subjectName} created for Semester ${semester} in ${branchName} branch of ${departmentName} department with ${credits} credits` }).status(StatusCodes.OK);
};

export const createTeacherAccount = async (req, res) => {
    const role = req.user.userRole;
    const { departmentName, teacherId, numLeaves } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!departmentName || !teacherId || numLeaves === undefined || numLeaves === null) {
        throw new BadRequestError("Please provide Department Name, Teacher ID, and Number of Leaves");
    }

    await db.all(
        'INSERT INTO teacher (teacher_id, num_leaves, department_id) VALUES (?, ?, (SELECT department_id FROM department WHERE department_name = ?))',
        [teacherId, numLeaves, departmentName]
    );

    res.json({ msg: `Teacher account created for Teacher ID: ${teacherId}` }).status(StatusCodes.OK);
};

export const createStudentAccount = async (req, res) => {
    const role = req.user.userRole;
    const { studentId, departmentName, branchName, semester, sectionName } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!studentId || !departmentName || !branchName || !semester || !sectionName) {
        throw new BadRequestError("Please provide Student ID, Department Name, Branch Name, Semester, and Section Name");
    }

    const existingSection = await db.get(
        'SELECT section_id FROM section WHERE section_name = ? AND course_id = (SELECT course_id FROM course WHERE branch_id = (SELECT branch_id FROM branch WHERE branch_name = ? AND department_id = (SELECT department_id FROM department WHERE department_name = ?)) AND semester = ?)',
        [sectionName, branchName, departmentName, semester]
    );

    if (!existingSection) {
        throw new NotFoundError(`Section ${sectionName} for Semester ${semester} in ${branchName} branch of ${departmentName} department does not exist`);
    }

    await db.all(
        'INSERT INTO student (student_id, section_id) VALUES (?, ?)',
        [studentId, existingSection.section_id]
    );

    res.json({ msg: `Student account created for Student ID: ${studentId}` }).status(StatusCodes.OK);
};

export const getPendingLeaves = async (req, res) => {
    const role = req.user.userRole;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    const pendingLeaves = await db.all(`
        SELECT sl.leave_id, s.student_id, s.name AS student_name, sl.reason, sl.date
        FROM student_leave sl
        JOIN student s ON sl.student_id = s.student_id
        WHERE sl.leaveStatus IS NULL
    `);

    res.json({ leaves: pendingLeaves }).status(StatusCodes.OK);
};

export const updateLeaveStatus = async (req, res) => {
    const role = req.user.userRole;
    const { leave_id, leaveStatus } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!leave_id || leaveStatus === undefined || leaveStatus === null) {
        throw new BadRequestError("Please provide leave_id and leaveStatus");
    }

    const leaveExists = await db.get(
        'SELECT * FROM student_leave WHERE leave_id = ?',
        [leave_id]
    );

    if (!leaveExists) {
        throw new NotFoundError(`Leave ID: ${leave_id} not found`);
    }

    await db.run(
        'UPDATE student_leave SET leaveStatus = ? WHERE leave_id = ?',
        [leaveStatus, leave_id]
    );

    res.json({ msg: `Leave ID: ${leave_id} status updated to ${leaveStatus}` }).status(StatusCodes.OK);
};

export const getAllSections = async (req, res) => {
    const role = req.user.userRole;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    const allSections = await db.all(`
        SELECT 
            s.section_id, 
            s.section_name, 
            d.department_name, 
            b.branch_name, 
            c.semester
        FROM 
            section s
            JOIN course c ON s.course_id = c.course_id
            JOIN branch b ON c.branch_id = b.branch_id
            JOIN department d ON b.department_id = d.department_id
    `);

    res.json({sections:allSections}).status(StatusCodes.OK);
};


export const createAdminNotification = async (req, res) => {
    const role = req.user.userRole;
    const { sectionId, status, message } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!sectionId || !status || !message) {
        throw new BadRequestError("Please provide Section ID, Status, and Message");
    }

    const studentsInSection = await db.all(
        'SELECT student_id FROM student WHERE section_id = ?',
        [sectionId]
    );

    if (!studentsInSection || studentsInSection.length === 0) {
        throw new NotFoundError(`No students found in Section ID: ${sectionId}`);
    }

    const adminNotifResult = await db.run(
        'INSERT INTO admin_notif (message, status) VALUES (?, ?)',
        [message, status]
    );

    const notificationId = adminNotifResult.lastID;
    if(!notificationId){
        console.log("problem");
        return;
    }

    const adminStudentNotifications = studentsInSection.map((student) => {
        return {
            student_id: student.student_id,
            notification_id: notificationId
        };
    });

    await db.serialize(
        adminStudentNotifications.map((notification) => {
            return {
                query: 'INSERT INTO admin_student_notification (student_id, notification_id) VALUES (?, ?)',
                params: [notification.student_id, notification.notification_id]
            };
        })
    );

    res.json({ msg: `Admin notification created for Section ID: ${sectionId}` }).status(StatusCodes.OK);
};

export const createTimetableEntry = async (req, res) => {
    const role = req.user.userRole;
    const { sectionId, subjectName, weekday, startTime, endTime } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!sectionId || !subjectName || !weekday || !startTime || !endTime) {
        throw new BadRequestError("Please provide Section ID, Subject Name, Weekday, Start Time, and End Time");
    }

    const sectionExists = await db.get(
        'SELECT section_id FROM section WHERE section_id = ?',
        [sectionId]
    );

    if (!sectionExists) {
        throw new NotFoundError(`Section ID: ${sectionId} not found`);
    }

    const subjectExists = await db.get(
        'SELECT subject_id FROM subject WHERE subject_name = ?',
        [subjectName]
    );

    if (!subjectExists) {
        throw new NotFoundError(`Subject: ${subjectName} not found`);
    }

    const timeRegex = /^([0-9]{1,2}):([0-9]{2})\s([APMapm]{2})$/;
    const validStartTime = startTime.match(timeRegex);
    const validEndTime = endTime.match(timeRegex);

    if (!validStartTime || !validEndTime) {
        throw new BadRequestError("Invalid time format. Please use 'HH:MM AM/PM'");
    }

    await db.run(
        'INSERT INTO timetable (section_id, subject_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [sectionId, subjectExists.subject_id, weekday, startTime, endTime]
    );

    res.json({ msg: `Timetable entry created for Section ID: ${sectionId}, Subject: ${subjectName}, Weekday: ${weekday}, Start Time: ${startTime}, End Time: ${endTime}` }).status(StatusCodes.OK);
};

export const assignTeacherToSection = async (req, res) => {
    const role = req.user.userRole;
    const { teacherId, sectionId, subjectName } = req.body;

    if (role !== "admin") {
        throw new UnauthenticatedError("Admin access required!");
    }

    if (!teacherId || !sectionId || !subjectName) {
        throw new BadRequestError("Please provide Teacher ID, Section ID, and Subject Name");
    }

    const teacherExists = await db.get(
        'SELECT teacher_id FROM teacher WHERE teacher_id = ?',
        [teacherId]
    );

    if (!teacherExists) {
        throw new NotFoundError(`Teacher ID: ${teacherId} not found`);
    }

    const sectionExists = await db.get(
        'SELECT section_id FROM section WHERE section_id = ?',
        [sectionId]
    );

    if (!sectionExists) {
        throw new NotFoundError(`Section ID: ${sectionId} not found`);
    }

    const subjectExists = await db.get(
        'SELECT subject_id FROM subject WHERE subject_name = ?',
        [subjectName]
    );

    if (!subjectExists) {
        throw new NotFoundError(`Subject: ${subjectName} not found`);
    }

    const existingAssignment = await db.get(
        'SELECT * FROM teaches WHERE teacher_id = ? AND section_id = ? AND subject_id = ?',
        [teacherId, sectionId, subjectExists.subject_id]
    );

    if (existingAssignment) {
        throw new BadRequestError(`Teacher ID: ${teacherId} is already assigned to Section ID: ${sectionId} for Subject: ${subjectName}`);
    }

    console.log(subjectExists.subject_id);

    await db.run(
        'INSERT INTO teaches (teacher_id, section_id, subject_id) VALUES (?, ?, ?)',
        [teacherId, sectionId, subjectExists.subject_id]
    );

    res.json({ msg: `Teacher ID: ${teacherId} assigned to Section ID: ${sectionId} for Subject: ${subjectName}` }).status(StatusCodes.OK);
};