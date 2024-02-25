import db from './db/connect.js';

const initializeDatabase = async () => {
    try {
        await db.init();

        const adminInit = [
            {
                query: 'DROP TABLE IF EXISTS admin',
                params: []
            },
            {
                query: `CREATE TABLE admin (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    password TEXT
                )`,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER IF NOT EXISTS enforce_single_admin_row 
                    BEFORE INSERT ON admin 
                    WHEN (
                        (SELECT COUNT(*) FROM admin) >= 1
                    )
                    BEGIN
                        SELECT RAISE(ABORT, 'Only one admin row allowed');
                    END
                `,
                params: []
            }
        ];
        const adminNotifInit = [
            {
                query: 'DROP TABLE IF EXISTS admin_notif',
                params: []
            },
            {
                query: `
                    CREATE TABLE admin_notif (
                        notif_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        admin_id INTEGER,
                        message TEXT,
                        status TEXT CHECK (status IN ('critical', 'warning', 'informational')),
                        FOREIGN KEY (admin_id) REFERENCES admin(id)
                    )
                `,
                params: []
            }
        ];
        const departmentInit = [
            {
                query: 'DROP TABLE IF EXISTS department',
                params: []
            },
            {
                query: `
                    CREATE TABLE department (
                        department_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        department_name TEXT unique
                    )
                `,
                params: []
            }
        ];
        const branchInit = [
            {
                query: 'DROP TABLE IF EXISTS branch',
                params: []
            },
            {
                query: `
                    CREATE TABLE branch (
                        branch_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        department_id INTEGER,
                        branch_name TEXT,
                        unique(branch_name, department_id)
                        FOREIGN KEY (department_id) REFERENCES department(department_id)
                    )
                `,
                params: []
            }
        ];
        const courseInit = [
            {
                query: 'DROP TABLE IF EXISTS course',
                params: []
            },
            {
                query: `
                    CREATE TABLE course (
                        course_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        semester INTEGER CHECK (semester BETWEEN 1 AND 8),
                        branch_id INTEGER,
                        UNIQUE (semester, branch_id),
                        FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
                    )
                `,
                params: []
            }
        ];        
        const sectionInit = [
            {
                query: 'DROP TABLE IF EXISTS section',
                params: []
            },
            {
                query: `
                    CREATE TABLE section (
                        section_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        section_name TEXT CHECK (section_name IN ('A', 'B', 'C', 'D', 'E', 'F')),
                        course_id INTEGER,
                        UNIQUE (section_name, course_id),
                        FOREIGN KEY (course_id) REFERENCES course(course_id)
                    )
                `,
                params: []
            }
        ];                
        const studentInit = [
            {
                query: 'DROP TABLE IF EXISTS student',
                params: []
            },
            {
                query: `
                    CREATE TABLE student (
                        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        password TEXT,
                        email TEXT,
                        section_id INTEGER,
                        FOREIGN KEY (section_id) REFERENCES section(section_id)
                    )
                `,
                params: []
            }
        ];        
        const adminStudentNotificationInit = [
            {
                query: 'DROP TABLE IF EXISTS admin_student_notification',
                params: []
            },
            {
                query: `
                    CREATE TABLE admin_student_notification (
                        student_id INTEGER,
                        notification_id INTEGER,
                        PRIMARY KEY (student_id, notification_id),
                        FOREIGN KEY (student_id) REFERENCES student(student_id),
                        FOREIGN KEY (notification_id) REFERENCES admin_notif(notif_id)
                    )
                `,
                params: []
            }
        ];
        const studentLeaveInit = [
            {
                query: 'DROP TABLE IF EXISTS student_leave',
                params: []
            },
            {
                query: `
                    CREATE TABLE student_leave (
                        leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        student_id INTEGER,
                        reason TEXT,
                        leaveStatus BOOLEAN,
                        date DATE,
                        FOREIGN KEY (student_id) REFERENCES student(student_id)
                    )
                `,
                params: []
            }
        ];        
        const teacherInit = [
            {
                query: 'DROP TABLE IF EXISTS teacher',
                params: []
            },
            {
                query: `
                    CREATE TABLE teacher (
                        teacher_id INTEGER PRIMARY KEY,
                        password TEXT,
                        name TEXT,
                        email TEXT,
                        num_leaves INTEGER,
                        department_id INTEGER,
                        FOREIGN KEY (department_id) REFERENCES department(department_id)
                    )
                `,
                params: []
            }
        ];
        const teacherLeavesInit = [
            {
                query: 'DROP TABLE IF EXISTS teacher_leaves',
                params: []
            },
            {
                query: `
                    CREATE TABLE teacher_leaves (
                        leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        teacher_id INTEGER,
                        reason TEXT,
                        date DATE,
                        FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
                    )
                `,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER decrement_leaves
                    AFTER INSERT ON teacher_leaves
                    FOR EACH ROW
                    BEGIN
                        UPDATE teacher
                        SET num_leaves = num_leaves - 1
                        WHERE teacher_id = NEW.teacher_id AND num_leaves > 0;
                    END;
                `,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER check_negative_leaves
                    BEFORE INSERT ON teacher_leaves
                    FOR EACH ROW
                    WHEN NEW.teacher_id IS NOT NULL AND (
                        SELECT num_leaves FROM teacher WHERE teacher_id = NEW.teacher_id
                    ) <= 0
                    BEGIN
                        SELECT RAISE(ABORT, 'Cannot insert leave. No leaves remaining for the teacher.');
                    END;
                `,
                params: []
            }
        ];        
        const teacherNotificationInit = [
            {
                query: 'DROP TABLE IF EXISTS teacher_notification',
                params: []
            },
            {
                query: `
                    CREATE TABLE teacher_notification (
                        notif_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        message TEXT,
                        status TEXT CHECK (status IN ('critical', 'warning', 'informational')),
                        teacher_id INTEGER,
                        student_id INTEGER,
                        FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
                        FOREIGN KEY (student_id) REFERENCES student(student_id)
                    )
                `,
                params: []
            }
        ];
        const subjectInit = [
            {
                query: 'DROP TABLE IF EXISTS subject',
                params: []
            },
            {
                query: `
                    CREATE TABLE subject (
                        subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subject_name TEXT unique,
                        course_id INTEGER,
                        credits INTEGER CHECK (credits BETWEEN 1 AND 4),
                        FOREIGN KEY (course_id) REFERENCES course(course_id)
                    )
                `,
                params: []
            }
        ];
        const teachesInit = [
            {
                query: 'DROP TABLE IF EXISTS teaches',
                params: []
            },
            {
                query: `
                    CREATE TABLE teaches (
                        teacher_id INTEGER,
                        section_id INTEGER,
                        subject_id INTEGER,
                        UNIQUE (section_id, subject_id),
                        FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
                        FOREIGN KEY (section_id) REFERENCES section(section_id),
                        FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
                    )
                `,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER check_subject_course_branch_department
                    BEFORE INSERT ON teaches
                    FOR EACH ROW
                    BEGIN
                        SELECT RAISE(ABORT, 'Invalid assignment. Subject does not belong to the course of the teacher''s department.')
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM subject
                            JOIN course ON subject.course_id = course.course_id
                            JOIN branch ON course.branch_id = branch.branch_id
                            JOIN teacher ON branch.department_id = teacher.department_id
                            WHERE subject.subject_id = NEW.subject_id AND teacher.teacher_id = NEW.teacher_id
                        );
        
                        SELECT RAISE(ABORT, 'Invalid assignment. Section does not belong to the same course as the subject.')
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM section
                            WHERE section.section_id = NEW.section_id
                              AND section.course_id = (SELECT course_id FROM subject WHERE subject_id = NEW.subject_id)
                        );
                    END;
                `,
                params: []
            }
        ];        
        
        const timetableInit = [
            {
                query: 'DROP TABLE IF EXISTS timetable',
                params: []
            },
            {
                query: `
                    CREATE TABLE timetable (
                        timetable_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        section_id INTEGER,
                        weekday TEXT CHECK (weekday IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
                        start_time TIME,
                        end_time TIME,
                        subject_id INTEGER,
                        FOREIGN KEY (section_id) REFERENCES section(section_id),
                        FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
                    )
                `,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER check_course_subject_timetable
                    BEFORE INSERT ON timetable
                    FOR EACH ROW
                    BEGIN
                        SELECT RAISE(ABORT, 'The specified course does not have the subject in the subject table.')
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM subject
                            WHERE subject_id = NEW.subject_id
                              AND course_id = (
                                SELECT course_id
                                FROM section
                                WHERE section_id = NEW.section_id
                              )
                        );
                    END;
                `,
                params: []
            }
        ];
        const attendanceInit = [
            {
                query: 'DROP TABLE IF EXISTS attendance',
                params: []
            },
            {
                query: `
                    CREATE TABLE attendance (
                        student_id,
                        timetable_id INTEGER,
                        date DATE,
                        is_present BOOLEAN,
                        PRIMARY KEY (student_id, timetable_id, date),
                        FOREIGN KEY (student_id) REFERENCES student(student_id),
                        FOREIGN KEY (timetable_id) REFERENCES timetable(timetable_id)
                    )
                `,
                params: []
            },
            {
                query: `
                    CREATE TRIGGER check_unique_timetable_entry
                    BEFORE INSERT ON attendance
                    FOR EACH ROW
                    WHEN EXISTS (
                        SELECT 1
                        FROM attendance
                        WHERE timetable_id = NEW.timetable_id
                          AND strftime('%W', NEW.date) = strftime('%W', NEW.date)
                    )
                    BEGIN
                        SELECT RAISE(ABORT, 'There is already an entry for this class in the following week.');
                    END;
                `,
                params: []
            }
        ];        
        
        
        // await db.serialize(adminInit);
        // await db.serialize(adminNotifInit);
        // await db.serialize(departmentInit);
        // await db.serialize(branchInit);
        // await db.serialize(courseInit);
        // await db.serialize(sectionInit);
        // await db.serialize(studentInit);
        // await db.serialize(adminStudentNotificationInit);
        // await db.serialize(studentLeaveInit);
        // await db.serialize(teacherInit);
        // await db.serialize(teacherLeavesInit);
        // await db.serialize(teacherNotificationInit);
        // await db.serialize(subjectInit);
        // await db.serialize(teachesInit);
        // await db.serialize(timetableInit);
        // await db.serialize(attendanceInit);

        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initializeDatabase();
