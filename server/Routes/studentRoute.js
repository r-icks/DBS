import express from "express"
const router=express.Router();

import { deleteNotification, getStudentNotifications, getStudentTimetable, getSubjectAttendance, postLeaveRequest } from "../controllers/studentController.js";
router.route("/attendance").get(getSubjectAttendance);
router.route("/leave").post(postLeaveRequest);
router.route("/timetable").get(getStudentTimetable);
router.route("/notifications").get(getStudentNotifications);
router.route("/notifications").patch(deleteNotification);
export default router