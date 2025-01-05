import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import EmployeeTable from "./EmployeeTabel";
import EmployeesAttendanceData from "./EmployeesAttendenceData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmployessLeave from "./EmployessLeave";
import EmployeeHolidays from "./EmployeeHolidays";
import ManagerApproval from "./ManagerComponent/ManagerApproval";
import TaskRecords from "./TaskRecords";
import MainDocuent from "./Documents/MainDocuent";
import TeammatesProfile from "./TeamatesProfile/TeamatesProfile";
import { FaGripLines } from "react-icons/fa6";
const Sidebar = () => {
  const navigate = useNavigate();
  const { loading, data } = useSelector((state) => state.userData);
  const userType = data?.data?.role;

  const [selectedTag, setSelectedTag] = useState(
    localStorage.getItem("selectedTag") || "dashboard"
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (tag) => {
    setSelectedTag(tag);
    localStorage.setItem("selectedTag", tag);
    setIsSidebarOpen(false); // Close the sidebar on mobile after selecting an option
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("selectedTag");
    navigate("/");
  };

  return (
    <>
      {/* {loading ? (
        <div className="min-h-screen flex bg-gray-100">Loading...</div>
      ) : (
      )} */}
        <div className="min-h-screen flex bg-gray-100">
          {/* Sidebar */}
          <aside
            className={`fixed z-20 top-0 left-0 h-full bg-white shadow-lg transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}
          >
            <nav className="space-y-2 p-4">
              <SidebarLink
                label="Dashboard"
                icon="📊"
                isSelected={selectedTag === "dashboard"}
                onClick={() => handleNavigation("dashboard")}
              />
              <SidebarLink
                label="Profile"
                icon="👤"
                isSelected={selectedTag === "profile"}
                onClick={() => handleNavigation("profile")}
              />
              {userType === "HR-Admin" && (
                <SidebarLink
                  label="All Employees"
                  icon="👥"
                  isSelected={selectedTag === "allEmployees"}
                  onClick={() => handleNavigation("allEmployees")}
                />
              )}
              {userType === "Manager" && (
                <SidebarLink
                  label="Teammate's Profile"
                  icon="👥"
                  isSelected={selectedTag === "viewByEmployee"}
                  onClick={() => handleNavigation("viewByEmployee")}
                />
              )}
              <SidebarLink
                label="Attendance"
                icon="📅"
                isSelected={selectedTag === "attendance"}
                onClick={() => handleNavigation("attendance")}
              />
              <SidebarLink
                label="Manage Leaves"
                icon="📩"
                isSelected={selectedTag === "leaves"}
                onClick={() => handleNavigation("leaves")}
              />
              {userType === "Manager" && (
                <SidebarLink
                  label="Leave Approvals"
                  icon="📋"
                  isSelected={selectedTag === "managerApproval"}
                  onClick={() => handleNavigation("managerApproval")}
                />
              )}
              <SidebarLink
                label="Holidays"
                icon="⌛️"
                isSelected={selectedTag === "employeeHolidays"}
                onClick={() => handleNavigation("employeeHolidays")}
              />
              <SidebarLink
                label="Payroll and Payslip"
                icon="🧾"
                isSelected={selectedTag === "payrole"}
                onClick={() => handleNavigation("payrole")}
              />
              <SidebarLink
                label="Task Records"
                icon="⌛️"
                isSelected={selectedTag === "taskRecords"}
                onClick={() => handleNavigation("taskRecords")}
              />
              <SidebarLink
                label="HR Manual"
                icon="⚙️"
                isSelected={selectedTag === "hrmanual"}
                onClick={() => handleNavigation("hrmanual")}
              />
              <SidebarLink
                label="Code Of Conduct"
                icon="🗂️"
                isSelected={selectedTag === "coc"}
                onClick={() => handleNavigation("coc")}
              />
              <SidebarLink
                label="Issued Documents"
                icon="📑"
                isSelected={selectedTag === "issuedDoc"}
                onClick={() => handleNavigation("issuedDoc")}
              />
            </nav>
            <div className="mt-6 p-4">
              <button
                onClick={handleLogout}
                type="button"
                className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <button
              className="block md:hidden mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >

              {isSidebarOpen ?  <FaGripLines /> : <FaGripLines />}
            </button>

            {selectedTag === "dashboard" && <Dashboard />}
            {selectedTag === "profile" && <Profile />}
            {selectedTag === "allEmployees" && <EmployeeTable />}
            {selectedTag === "attendance" && <EmployeesAttendanceData />}
            {selectedTag === "employeeHolidays" && <EmployeeHolidays />}
            {selectedTag === "viewByEmployee" && <TeammatesProfile />}
            {selectedTag === "payrole" && <ComingSoon />}
            {selectedTag === "leaves" && <EmployessLeave />}
            {selectedTag === "managerApproval" && <ManagerApproval />}
            {selectedTag === "taskRecords" && <ComingSoon />}
            {selectedTag === "hrmanual" && <ComingSoon />}
            {selectedTag === "coc" && <ComingSoon />}
            {selectedTag === "issuedDoc" && <MainDocuent />}
          </div>
        </div>
    </>
  );
};

const SidebarLink = ({ label, icon, isSelected, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className={`flex items-center p-2 rounded ${
      isSelected ? "bg-blue-100 text-blue-700" : "text-gray-700"
    }`}
  >
    <span className="mr-2">{icon}</span> {label}
  </a>
);

const ComingSoon = () => <p className="text-gray-800">Coming soon...</p>;

export default Sidebar;
