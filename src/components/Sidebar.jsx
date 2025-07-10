import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaGripLines
} from "react-icons/fa6";

import Dashboard from "./Dashboard";
import Profile from "./Profile";
import EmployeeTable from "./EmployeeTabel";
import EmployeesAttendanceData from "./EmployeesAttendenceData";
import EmployessLeave from "./EmployessLeave";
import EmployeeHolidays from "./EmployeeHolidays";
import ManagerApproval from "./ManagerComponent/ManagerApproval";
import MainDocuent from "./Documents/MainDocuent";
import TeammatesProfile from "./TeamatesProfile/TeamatesProfile";
import TotalTask from "./TotalTask";
import Announcement from "./Announcement";
import EmployeePayroleTable from "./EmployeePayroleTabel";
import EmployeeLeaveStatus from "./EmployeeLeaveStatus";

const Sidebar = () => {
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.userData);
  const userType = data?.data?.role;
  const [reloadHandel, setReloadHandel] = useState(false);
  const [selectedTag, setSelectedTag] = useState(
    localStorage.getItem("selectedTag") || "dashboard"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Make sure data is fetched whenever the selectedTag changes
    localStorage.setItem("selectedTag", selectedTag);
  }, [selectedTag]);

  const handleNavigation = (tag) => {
    setSelectedTag(tag);
    setIsSidebarOpen(false);
    localStorage.setItem("selectedTag", tag);
    if (tag === 'viewByEmployee') {
      window.location.reload();  // ✅ Forces full page reload
      return;
    }
    else if(tag === 'managerApproval'){
      window.location.reload();  // ✅ Forces full page reload
      return;
    }
    else if (tag === 'allEmployees') {
      setReloadHandel(true);
      // window.location.reload();  // ✅ Forces full page reload
      return;
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("employeId");
    localStorage.removeItem("selectedTag");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-20 top-0 left-0 h-full bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}
      >
        <nav className="space-y-2 p-4">
          <SidebarLink
            label="Dashboard"
            icon="📊"
            isSelected={selectedTag === "dashboard"}
            onClick={() => {
              setReloadHandel(true);
              handleNavigation("dashboard")
            }
            }
          />
          {userType !== "HR-Admin" ? (
            <SidebarLink
              label="Profile"
              icon="👤"
              isSelected={selectedTag === "profile"}
              onClick={() =>{setReloadHandel(true);
                 handleNavigation("profile")}}
            />
          ) : (
            ""
          )}
          {/* {userType === "HR-Admin" || userType === "Super-Admin" ? (
            <SidebarLink
              label="All Employees"
              icon="🫂"
              isSelected={selectedTag === "allEmployees"}
              onClick={() =>
                 handleNavigation("allEmployees")}
            />
          ) : (
            ""
          )} */}
          {(userType === "Manager" || userType === "Super-Admin" || userType === "HR-Admin") && (
            <SidebarLink
              label="Teammate's Profile"
              icon="👥"
              isSelected={selectedTag === "viewByEmployee"}
              onClick={() => handleNavigation("viewByEmployee")}
            />
          )}
          {userType != "HR-Admin" && userType != "Super-Admin" && (
            <SidebarLink
              label="Attendance"
              icon="📅"
              isSelected={selectedTag === "attendance"}
              onClick={() => handleNavigation("attendance")}
            />
          )}
          {userType !== "HR-Admin" && userType != "Super-Admin" && (
            <SidebarLink
              label="Leave Status"
              icon="📩"
              isSelected={selectedTag === "leaves"}
              onClick={() => handleNavigation("leaves")}
            />
          )}
          {(userType === "Manager" || userType === "Super-Admin") && (
            <SidebarLink
              label="Team Approvals"
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
          {userType === "HR-Admin" && (
            <SidebarLink
              label="Announcement"
              icon="⌛️"
              isSelected={selectedTag === "anouncment"}
              onClick={() =>{
                setReloadHandel(true);
                 handleNavigation("anouncment")}}
            />
          )}
          {userType === "HR-Admin" && (
            <SidebarLink
              label="EmployeeLeaveStatus"
              icon="⌛️"
              isSelected={selectedTag === "employeeLeaveStatus"}
              onClick={() =>{
                setReloadHandel(true);
                 handleNavigation("employeeLeaveStatus")}}
            />
          )}
          <SidebarLink
            label="Payroll and Payslip"
            icon="🧾"
            isSelected={selectedTag === "payslipAndPayRole"}
            onClick={() => handleNavigation("payslipAndPayRole")}
          />
          <SidebarLink
            label="Task Records"
            icon="📝"
            isSelected={selectedTag === "taskRecords"}
            onClick={() => handleNavigation("taskRecords")}
          />
          <SidebarLink
            label="HR Manual"
            icon="⚙️"
            isSelected={selectedTag === "hrmanual"}
            disabled
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
          {isSidebarOpen ? <FaGripLines /> : <FaGripLines />}
        </button>

        {selectedTag === "dashboard" && <Dashboard reloadHandel={reloadHandel} />}
        {selectedTag === "profile" && <Profile />}
        {selectedTag === "allEmployees" && <EmployeeTable selectedTag={selectedTag} reloadHandel={reloadHandel}/>}
        {selectedTag === "attendance" && <EmployeesAttendanceData />} 
        {selectedTag === "anouncment" && <Announcement reloadHandel={reloadHandel}/>}
        {selectedTag === "employeeLeaveStatus" && <EmployeeLeaveStatus reloadHandel={reloadHandel}/>}
        {selectedTag === "employeeHolidays" && <EmployeeHolidays />}
        {selectedTag === "viewByEmployee" && <TeammatesProfile selectedTag={selectedTag} />}
        {selectedTag === "payslipAndPayRole" && <EmployeePayroleTable />}
        {selectedTag === "leaves" && <EmployessLeave />}
        {selectedTag === "managerApproval" && <ManagerApproval />}
        {selectedTag === "taskRecords" && <TotalTask />}
        {selectedTag === "hrmanual" && <ComingSoon />}
        {selectedTag === "coc" && <ComingSoon />}
        {selectedTag === "issuedDoc" && <MainDocuent />}
      </div>
    </div>
  );
};

const SidebarLink = ({ label, icon, isSelected, onClick }) => (
  <button
    // hrefLang="#"
    onClick={onClick}
    className={`flex items-center p-2 rounded ${isSelected ? "bg-blue-100 text-blue-700" : "text-gray-700"
      }`}
  >
    <span className="mr-2">{icon}</span> {label}
  </button>
);

const ComingSoon = () => <p className="text-gray-800">Coming soon...</p>;

export default Sidebar;