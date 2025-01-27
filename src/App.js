import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import StatusManagment from "./components/StatusManagment";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/Protected";
import Navbar from "./components/Navbar";
import ManagerApproval from "./components/ManagerComponent/ManagerApproval";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmPassword from "./pages/ComfirmPassword";
import OtpVerification from "./pages/Optverification";
import SingleTeamatesProfile from "./components/TeamatesProfile/SingleTeamatesProfile";
import ErrorPage from "./errorPage/ErrorPage"; // Import your error page
import NotFound from "./pages/NotFound";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    // Show the error page if offline
    return <ErrorPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
            </ProtectedRoute>
          }
        />
        <Route path="/statusManagment" element={<StatusManagment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/managerApproved" element={<ManagerApproval />} />
        <Route
          path="/singleTeamateProfile/:employeeId"
          element={<SingleTeamatesProfile />}
        />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="/otp_verification" element={<OtpVerification />} />
        <Route path="/confirm_password" element={<ConfirmPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
