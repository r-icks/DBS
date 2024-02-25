import express from "express"
const router=express.Router();

import { createDepartment, createBranch, createSection, createSubject, createTeacherAccount, createStudentAccount, getPendingLeaves, getAllSections, createAdminNotification, createTimetableEntry, assignTeacherToSection, updateLeaveStatus } from "../controllers/adminController.js";
router.route("/department").post(createDepartment);
router.route("/branch").post(createBranch);
router.route("/section").post(createSection);
router.route("/subject").post(createSubject);
router.route("/teacher").post(createTeacherAccount);
router.route("/student").post(createStudentAccount);
router.route("/pendingLeaves").get(getPendingLeaves);
router.route("/leaveStatus").patch(updateLeaveStatus);
router.route("/sections").get(getAllSections);
router.route("/notify").post(createAdminNotification);
router.route("/timetable").post(createTimetableEntry);
router.route("/assignTeacher").post(assignTeacherToSection);

export default router