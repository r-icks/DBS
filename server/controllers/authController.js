import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../Errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import jwt from "jsonwebtoken";
import db from "../db/connect.js"
import bcrypt from "bcrypt"

const adminLogin = async (req, res) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const { password } = req.body;
    if (!password) {
        throw new BadRequestError("Please provide password!");
    }
    const admin = await db.get('SELECT * FROM admin');
    if (!admin) {
        throw new UnauthenticatedError("Invalid admin data");
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
        throw new UnauthenticatedError("Invalid password");
    }

    const token = jwt.sign({ userId: admin.id, userRole: 'admin' }, JWT_SECRET, { expiresIn: JWT_LIFETIME });

    attachCookie({ token, res });
    const user = { userId: admin.id, userRole: 'admin' };
    res.json({ user }).status(StatusCodes.OK);
}

const studentRegistration = async (req, res) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const { studentId, studentEmail, studentName, password } = req.body;

    if (!studentId || !studentName || !studentEmail || !password) {
        throw new BadRequestError("Please provide Student ID, Student Name, Email, and Password");
    }

    const existingStudent = await db.get('SELECT * FROM student WHERE student_id = ?', [studentId]);

    if (!existingStudent) {
        throw new NotFoundError("Student not found");
    }

    if (existingStudent.email === null && existingStudent.password === null) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run('UPDATE student SET name = ?, email = ?, password = ? WHERE student_id = ?', [studentName, studentEmail, hashedPassword, studentId]);

        const token = jwt.sign({ userId: existingStudent.student_id, userRole: 'student' }, JWT_SECRET, { expiresIn: JWT_LIFETIME });

        attachCookie({ token, res });

        const user = { userId: existingStudent.student_id, userRole: 'student' };
        res.json({ user }).status(StatusCodes.OK);
    } else {
        throw new BadRequestError("Student account is already registered");
    }
};

const teacherRegistration = async (req, res) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const { teacherId, teacherName, teacherEmail, password } = req.body;

    if (!teacherId || !teacherName || !teacherEmail || !password) {
        throw new BadRequestError("Please provide Teacher ID, Teacher Name, Email, and Password");
    }

    const existingTeacher = await db.get('SELECT * FROM teacher WHERE teacher_id = ?', [teacherId]);

    if (!existingTeacher) {
        throw new NotFoundError("Teacher not found");
    }

    if (existingTeacher.email === null && existingTeacher.password === null) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run('UPDATE teacher SET name = ?, email = ?, password = ? WHERE teacher_id = ?', [teacherName, teacherEmail, hashedPassword, teacherId]);

        const token = jwt.sign({ userId: existingTeacher.teacher_id, userRole: 'teacher' }, JWT_SECRET, { expiresIn: JWT_LIFETIME });

        attachCookie({ token, res });

        const user = { userId: existingTeacher.teacher_id, userRole: 'teacher' };
        res.json({ user }).status(StatusCodes.OK);
    } else {
        throw new BadRequestError("Teacher account is already registered");
    }
};

const teacherLogin = async (req, res) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
        throw new BadRequestError("Please provide Teacher ID and Password");
    }

    const teacher = await db.get('SELECT * FROM teacher WHERE teacher_id = ?', [teacherId]);

    if (!teacher) {
        throw new NotFoundError("Teacher not found");
    }

    if (!teacher.password) {
        throw new UnauthenticatedError("Teacher has not registered");
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
        throw new UnauthenticatedError("Invalid password");
    }

    const token = jwt.sign({ userId: teacher.teacher_id, userRole: 'teacher' }, JWT_SECRET, { expiresIn: JWT_LIFETIME });

    attachCookie({ token, res });

    const user = { userId: teacher.teacher_id, userRole: 'teacher' };
    res.json({ user }).status(StatusCodes.OK);
};

const studentLogin = async (req, res) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const { studentId, password } = req.body;

    if (!studentId || !password) {
        throw new BadRequestError("Please provide Student ID and Password");
    }

    const student = await db.get('SELECT * FROM student WHERE student_id = ?', [studentId]);

    if (!student) {
        throw new NotFoundError("Student not found");
    }

    if (student.password === null) {
        throw new UnauthenticatedError("Student hasn't registered");
    }

    const passwordMatch = await bcrypt.compare(password, student.password);

    if (!passwordMatch) {
        throw new UnauthenticatedError("Invalid password");
    }

    const token = jwt.sign({ userId: student.student_id, userRole: 'student' }, JWT_SECRET, { expiresIn: JWT_LIFETIME });

    attachCookie({ token, res });

    const user = { userId: student.student_id, userRole: 'student' };
    res.json({ user }).status(StatusCodes.OK);
};


const getCurrentUser = async (req, res) => {
    const role = req.user.userRole;
    const userId = req.user.userId;

    if (role === "admin") {
        const admin = await db.get(`SELECT * FROM admin WHERE id = ?`, [userId]);
        res.status(StatusCodes.OK).json({ user: { userId: admin.id, userRole: 'admin' } });
    } else if (role === "teacher") {
        const teacher = await db.get(`SELECT * FROM teacher WHERE teacher_id = ?`, [userId]);
        res.status(StatusCodes.OK).json({ user: { userId: teacher.teacher_id, userName: teacher.name, numLeaves:teacher.num_leaves, userRole: 'teacher' } });
    } else if (role === "student") {
        const student = await db.get(`SELECT * FROM student WHERE student_id = ?`, [userId]);
        res.status(StatusCodes.OK).json({ user: { userId: student.student_id, userName: student.name, userRole: 'student' } });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid user role" });
    }
};


const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

export { adminLogin, getCurrentUser, logout, studentLogin, studentRegistration, teacherLogin, teacherRegistration };