import express from "express"
const router=express.Router();

import authenticateUser from "../middleware/auth.js"

import { adminLogin, getCurrentUser, logout, studentLogin, studentRegistration, teacherLogin, teacherRegistration } from "../controllers/authController.js";
router.route("/admin").post(adminLogin);
router.route("/getUser").get(authenticateUser,getCurrentUser);
router.route("/logout").get(logout);
router.route("/studentLogin").post(studentLogin);
router.route("/studentRegister").post(studentRegistration);
router.route("/teacherLogin").post(teacherLogin);
router.route("/teacherRegister").post(teacherRegistration);

export default router