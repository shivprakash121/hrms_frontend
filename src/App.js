import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import StatusManagment from "./components/StatusManagment";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/Protected";
import Navbar from "./components/Navbar";
import ManagerApproval from "./components/ManagerComponent/ManagerApproval";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmPassword from "./pages/ComfirmPassword";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar/>
              <Sidebar />
            </ProtectedRoute>
          }
        />
        <Route path="/statusManagment" element={<StatusManagment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/managerApproved" element={<ManagerApproval />} />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="/confirm_password" element={<ConfirmPassword />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;