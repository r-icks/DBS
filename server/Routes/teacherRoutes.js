import express from "express"
const router=express.Router();

import { getClasses, getStudentList, markAttendance, markTeacherLeave, pushTeacherNotification } from "../controllers/teacherController.js";

router.route("/classes").get(getClasses);
router.route("/students").post(getStudentList);
router.route("/leave").post(markTeacherLeave);
router.route("/attendance").post(markAttendance);
router.route("/notification").post(pushTeacherNotification);
export default router