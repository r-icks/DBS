import React from "react"
import { useContext, useReducer, useEffect } from "react";
import reducer from "./reducer"
import axios from "axios"
import { CLEAR_ALERT, CREATE_REQUEST_BEGIN, CREATE_REQUEST_ERROR, CREATE_REQUEST_SUCCESS, GET_ALL_SECTIONS, GET_ATTENDANCE_BEGIN, GET_ATTENDANCE_SUCCESS, GET_CLASSES_BEGIN, GET_CLASSES_SUCCESS, GET_CURRENT_USER_BEGIN, GET_CURRENT_USER_SUCCESS, GET_LEAVES_ERROR, GET_LEAVES_SUCCESS, GET_NOTIFICATION_BEGIN, GET_NOTIFICATION_SUCCESS, GET_PENDING_LEAVES, GET_SECTIONS_SUCCESS, GET_STUDENTS_BEGIN, GET_STUDENTS_SUCCESS, GET_TIMETABLE_BEGIN, GET_TIMETABLE_SUCCESS, LEAVE_REQUEST_ERROR, LEAVE_REQUEST_SUCCESS, LOGOUT_USER, SETUP_USER_BEGIN, SETUP_USER_ERROR, SETUP_USER_SUCCESS } from "./action";

export const initialState = {
    userLoading: true,
    user : null,
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    sections: null,
    sectionsLoading: false,
    leaves: null,
    leavesLoading: false,
    attendance: null,
    attendanceLoading: false,
    timetable: null,
    timetableLoading: false,
    notifications: null,
    notificationsLoading: false,
    classes: null,
    classesLoading: false,
    students: [],
    studentsLoading: false
}

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const authFetch = axios.create({
        baseURL: `/api/v1`,
        credentials: true
    })
    authFetch.interceptors.request.use(
        (config) => {
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response.status === 401) {
                logoutUser();
            }
            return Promise.reject(error)
        }
    )
    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)
    }
    const setupUser = async ({currentUser, endpoint}) => {
        dispatch({type: SETUP_USER_BEGIN});
        try{
            const {data} = await axios.post(`/api/v1/auth/${endpoint}`, currentUser);
            const {user} = data;
            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: {
                    user, alertText: "Logged In! Redirecting..."
                }
            });
        }
        catch(err){
            dispatch({type: SETUP_USER_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const logoutUser = async () => {
        await authFetch.get('/auth/logout')
        dispatch({ type: LOGOUT_USER })
    }

    const getCurrentUser = async () => {
        dispatch({type: GET_CURRENT_USER_BEGIN});
        try{
            const {data} = await authFetch('/auth/getUser');
            const {user} = data;
            console.log(user);
            dispatch({
                type: GET_CURRENT_USER_SUCCESS, payload: {user}
            })
        }catch(err){
            if(err.response.status === 401) return;
        }
    }

    const adminCreate = async ({endpoint, body}) => {
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.post(`/admin/${endpoint}`,body);
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const getPendingLeaves = async()=>{
        dispatch({type: GET_PENDING_LEAVES});
        try{
            const {data} = await authFetch.get(`/admin/pendingLeaves`);
            const {leaves} = data;
            dispatch({type: GET_LEAVES_SUCCESS, payload: {leaves}});
        }
        catch(err){
            logoutUser();
        }
    }

    const leaveUpdate = async (body) => {
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.patch('/admin/leaveStatus', body);
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }
        catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const getAllSections = async() => {
        dispatch({type: GET_ALL_SECTIONS});
        try{
            const {data} = await authFetch.get(`/admin/sections`);
            const {sections} = data;
            dispatch({type: GET_SECTIONS_SUCCESS, payload: {sections}});
        }
        catch(err){
            logoutUser();
        }
    }

    const getAttendance = async() => {
        dispatch({type: GET_ATTENDANCE_BEGIN});
        try{
            const {data} = await authFetch.get(`/student/attendance`);
            const {subjectAttendance} = data;
            dispatch({type: GET_ATTENDANCE_SUCCESS, payload:{attendance:subjectAttendance}})
        }
        catch(err){
            logoutUser();
        }
    }
    
    const getTimetable = async() => {
        dispatch({type: GET_TIMETABLE_BEGIN});
        try{
            const {data} = await authFetch.get(`/student/timetable`);
            const {timetable} = data;
            dispatch({type: GET_TIMETABLE_SUCCESS, payload:{timetable}})
        }
        catch(err){
            logoutUser();
        }
    }

    const requestLeave = async({ date, reason })=>{
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.post(`/student/leave`, {date, reason});
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const getNotifications = async()=>{
        dispatch({type : GET_NOTIFICATION_BEGIN});
        try{
            const {data} = await authFetch.get('/student/notifications');
            const {notifications} = data;
            dispatch({type: GET_NOTIFICATION_SUCCESS, payload:{notifications}});
        }
        catch(err){
            logoutUser();
        }
    }

    const deleteNotification = async({ notificationRole, notification_id })=>{
        dispatch({type: GET_NOTIFICATION_BEGIN});
        try{
            const {data} = await authFetch.patch('/student/notifications', {notificationRole, notification_id});
            const {notifications} = data;
            dispatch({type: GET_NOTIFICATION_SUCCESS, payload:{notifications}});
        }
        catch(err){
            console.log(err);
        }
    }

    const getClasses = async()=>{
        dispatch({type : GET_CLASSES_BEGIN});
        try{
            const {data} = await authFetch.get('/teacher/classes');
            const {classes} = data;
            dispatch({type: GET_CLASSES_SUCCESS, payload:{classes}});
        }
        catch(err){
            logoutUser();
        }
    }

    const getStudentList = async(tid)=>{
        dispatch({type: GET_STUDENTS_BEGIN});
        try{
            const {data} = await authFetch.post('/teacher/students',{timetableId:tid});
            const {students} = data;
            dispatch({type: GET_STUDENTS_SUCCESS,payload: {students}});
        }
        catch(err){
            logoutUser();
        }
    }

    const markAttendance = async(body)=>{
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.post(`/teacher/attendance`, body);
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const markLeave = async(body)=>{
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.post(`/teacher/leave`, body);
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    const pushTeacherNotification = async(body)=>{
        dispatch({type: CREATE_REQUEST_BEGIN});
        try{
            const {data} = await authFetch.post(`/teacher/notification`, body);
            const {msg} = data;
            dispatch({type: CREATE_REQUEST_SUCCESS, payload: {msg}});
        }catch(err){
            dispatch({type: CREATE_REQUEST_ERROR, payload: {msg: err.response.data.msg}});
        }
        clearAlert();
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return(
        <AppContext.Provider value={{
            ...state,
            setupUser,
            logoutUser,
            adminCreate,
            getPendingLeaves,
            leaveUpdate,
            getAllSections,
            getAttendance,
            getTimetable,
            requestLeave,
            getNotifications,
            deleteNotification,
            getClasses,
            getStudentList,
            markAttendance,
            markLeave,
            pushTeacherNotification
        }}>
        {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return (useContext(AppContext));
}