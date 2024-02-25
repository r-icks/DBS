import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Attendance, Notifications, RequestLeave, StudentDetails, StudentLayout, Timetable } from './pages/student';
import { FacultyLayout,  MarkAttendance, MarkLeave, SendNotification, ClassAttendance} from "./pages/faculty";
import { AdminLogin, LandingPage, StudentLogin, TeacherLogin, AdminProtect, StudentProtect, TeacherProtect} from "./pages";
import { AdminLayout, ApproveLeave, AssignTeacherCard, CreateUserCard, ManageComponent, Notify } from "./pages/admin";
import AddTimetableCard from "./pages/admin/AddTimetable";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/student" element={<StudentProtect><StudentLayout /></StudentProtect>}>
          <Route index element={<Attendance />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="leave_request" element={<RequestLeave />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="/faculty" element={<TeacherProtect><FacultyLayout /></TeacherProtect>}>
          <Route index element={<MarkAttendance />} />
          <Route path="mark_leave" element={<MarkLeave />} />
          <Route path="notify" element={<SendNotification />} />
          <Route
            path=":tid"
            element={<ClassAttendance />}
          />
        </Route>

        <Route path="/admin" element={<AdminProtect><AdminLayout /></AdminProtect>}>
          <Route index element={<CreateUserCard />} />
          <Route path="approve_leave" element={<ApproveLeave />} />
          <Route path="mark_leave" element={<MarkLeave />} />
          <Route path="notify" element={<Notify />} />
          <Route path="assign_teacher" element={<AssignTeacherCard />} />
          <Route path="timetable" element={<AddTimetableCard />} />
          <Route path="manage" element={<ManageComponent />} />
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
