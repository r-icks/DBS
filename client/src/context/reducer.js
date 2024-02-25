import { CLEAR_ALERT, CREATE_REQUEST_BEGIN, CREATE_REQUEST_ERROR, CREATE_REQUEST_SUCCESS, GET_ALL_SECTIONS, GET_ATTENDANCE_BEGIN, GET_ATTENDANCE_SUCCESS, GET_CLASSES_BEGIN, GET_CLASSES_SUCCESS, GET_CURRENT_USER_BEGIN, GET_CURRENT_USER_SUCCESS, GET_LEAVES_SUCCESS, GET_NOTIFICATION_BEGIN, GET_NOTIFICATION_SUCCESS, GET_PENDING_LEAVES, GET_SECTIONS_SUCCESS, GET_STUDENTS_BEGIN, GET_STUDENTS_SUCCESS, GET_TIMETABLE_BEGIN, GET_TIMETABLE_SUCCESS, LOGOUT_USER, SETUP_USER_BEGIN, SETUP_USER_ERROR, SETUP_USER_SUCCESS } from "./action";
import { initialState } from "./appContext.js";
const reducer = (state, action) => {
    if(action.type === GET_CURRENT_USER_BEGIN){
        return {...state, userLoading: true, showAlert: false}
    }
    if(action.type === GET_CURRENT_USER_SUCCESS){
        return{
            ...state,
            userLoading : false,
            user: action.payload.user,
        }
    }
    if(action.type === CLEAR_ALERT){
        return {
            ...state,
            showAlert:false,
            alertType:'',
            alertText:'',
        }
    }
    if(action.type === SETUP_USER_BEGIN){
        return {
            ...state,
            isLoading: true
        }
    }
    if(action.type === SETUP_USER_SUCCESS){
        return {
            ...state,
            isLoading: false,
            user: action.payload.user,
            showAlert: true,
            alertType: "success",
            alertText: action.payload.alertText
        }
    }
    if(action.type === SETUP_USER_ERROR){
        return{
            ...state,
            isLoading:false,
            showAlert: true,
            alertType: "danger",
            alertText: action.payload.msg
        }
    }
    if(action.type === LOGOUT_USER){
        return{
            ...initialState,
            userLoading: false,
            user: null,
            team: null,
            teamLoading: false
        }
    }
    if(action.type === CREATE_REQUEST_BEGIN){
        return{
            ...state,
            isLoading: true
        }
    }
    if(action.type === CREATE_REQUEST_SUCCESS){
        return{
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: "success",
            alertText: action.payload.msg
        }
    }
    if(action.type === CREATE_REQUEST_ERROR){
        return{
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: "danger",
            alertText: action.payload.msg
        }
    }
    if(action.type === GET_PENDING_LEAVES){
        return{
            ...state,
            leavesLoading: true
        }
    }
    if(action.type === GET_LEAVES_SUCCESS){
        return{
            ...state,
            leaves: action.payload.leaves,
            leavesLoading: false,
        }
    }
    if(action.type === GET_ALL_SECTIONS){
        return{
            ...state,
            sectionsLoading: true
        }
    }
    if(action.type === GET_SECTIONS_SUCCESS){
        return{
            ...state,
            sections: action.payload.sections,
            sectionsLoading: false
        }
    }
    if(action.type === GET_ATTENDANCE_BEGIN){
        return{
            ...state,
            attendanceLoading: true
        }
    }
    if(action.type === GET_ATTENDANCE_SUCCESS){
        return{
            ...state,
            attendance: action.payload.attendance,
            attendanceLoading: false
        }
    }
    if(action.type === GET_NOTIFICATION_BEGIN){
        return{
            ...state,
            notificationsLoading: true
        }
    }
    if(action.type === GET_NOTIFICATION_SUCCESS){
        return{
            ...state,
            notifications: action.payload.notifications,
            notificationsLoading: false
        }
    }
    if(action.type === GET_TIMETABLE_BEGIN){
        return{
            ...state,
            timetableLoading: true
        }
    }
    if(action.type === GET_TIMETABLE_SUCCESS){
        return{
            ...state,
            timetable: action.payload.timetable,
            timetableLoading: false
        }
    }
    if(action.type === GET_CLASSES_BEGIN){
        return{
            ...state,
            classesLoading: true
        }
    }
    if(action.type === GET_CLASSES_SUCCESS){
        return{
            ...state,
            classes: action.payload.classes,
            classesLoading: false
        }
    }
    if(action.type === GET_STUDENTS_BEGIN){
        return{
            ...state,
            studentsLoading: true
        }
    }
    if(action.type === GET_STUDENTS_SUCCESS){
        return{
            ...state,
            students: action.payload.students,
            studentsLoading: false
        }
    }
    throw new Error(`No such action ${action.type}`)
}

export default reducer;