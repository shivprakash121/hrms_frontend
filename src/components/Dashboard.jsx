import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./Calendar";
import AddEmployee from "./AddEmployee";
import { getAnnouncementDataAction, getAttendenceLogsOfEmploye, getOnLeaveStatusAction, getUserDataAction } from "../store/action/userDataAction";
import { getAttendanceLogsDayWise } from "../store/action/userAdminAction";
import {
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { FaUsers, FaUserPlus, FaUserTimes, FaBriefcase, FaClock } from "react-icons/fa";
import HrAdminDashboard from "./HrAdminDashboard";
// Memoized SkeletonCard component
const SkeletonCard = React.memo(({ height = "h-20", width = "w-full" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${height} ${width}`} aria-hidden="true"></div>
));

const LeaveCard = React.memo(({ title, value, bgColor }) => (
  <div className={`p-6 rounded-lg shadow ${bgColor}`} role="region" aria-label={`${title} Leave`}>
    <h3 className="text-lg">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
));

const Dashboard = ({ reloadHandel }) => {
  const dispatch = useDispatch();
  console.log('reload', reloadHandel)
  const { loading, data } = useSelector((state) => state.userData);
  // Announcemnet
  const { data: announcementData } = useSelector((state) => state.announcementData);
  const pieData = [
    { name: "Salary", value: 15, color: "#f43f5e" },
    { name: "Bonus", value: 8, color: "#10b981" },
    { name: "Commission", value: 20, color: "#3b82f6" },
    { name: "Overtime", value: 11, color: "#f97316" },
    { name: "Reimbursement", value: 28, color: "#6366f1" },
    { name: "Benefits", value: 18, color: "#facc15" },
];

  const userDataList = data?.data || [];
  const { data: attendanceData, loading: attendanceLoading } = useSelector((state) => state.attendanceLogs);
  const { data: attendanceLogs } = useSelector((state) => state.attendanceLogsDayWise);

  const employeeId = useMemo(() => localStorage.getItem("employeId"), []);
  const latestData = attendanceData?.data?.map((item) => item.PunchRecords) || [];
  const punchDate = attendanceData?.data?.[0]?.AttendanceDate?.split("T")[0] || "No Date Available";

  // State to manage fetching flags
  const [attendanceLogsFetched, setAttendanceLogsFetched] = useState(false);
  const [onLeaveStatusFetched, setOnLeaveStatusFetched] = useState(false);

  useEffect(() => {
    // Check if we need to fetch attendance logs for HR-Admin
    if (!attendanceLogsFetched) {
      dispatch(getAttendanceLogsDayWise());
      setAttendanceLogsFetched(true); // Prevent re-fetching
    }

    // Fetch leave status only once
    if (!onLeaveStatusFetched) {
      dispatch(getOnLeaveStatusAction());
      setOnLeaveStatusFetched(true); // Prevent re-fetching
    }

    // Fetch attendance logs of the employee if not fetched already
    if (!attendanceLogsFetched) {
      dispatch(getAttendenceLogsOfEmploye(employeeId));
      setAttendanceLogsFetched(true); // Prevent re-fetching
    }
  }, [reloadHandel]);
  const onClick = () => {
    toast.dismiss()
  }
  useEffect(() => {
    dispatch(getUserDataAction());
    dispatch(getAnnouncementDataAction())
  }, []);

  return (
    <div className="w-full">
      <main>
        {loading || attendanceLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-4 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-base sm:text-lg text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {userDataList?.role !== "Super-Admin" && userDataList?.role !== "HR-Admin" ? (
              <>
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Leave Balance</h3>
                  {userDataList?.employmentType === "Contractual" ? "" : <AddEmployee tittleBtn="Apply Leave" onClick={onClick} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                  {loading
                    ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                    : (
                      <>
                        <LeaveCard title="Casual Leave" value={userDataList?.leaveBalance?.casualLeave || 0} bgColor="bg-yellow-50" />
                        <LeaveCard title="Earned Leave" value={userDataList?.leaveBalance?.earnedLeave || 0} bgColor="bg-blue-50" />
                        <LeaveCard title="Medical Leave" value={userDataList?.leaveBalance?.medicalLeave || 0} bgColor="bg-purple-50" />
                        <LeaveCard title="Comp Off" value={userDataList?.leaveBalance?.compOffLeave || 0} bgColor="bg-red-50" />
                      </>
                    )}
                </div>
              </>
            ) : userDataList?.role !== "HR-Admin" ? (
              <>
                <div className="mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">Employee's</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Total Employees</h2>
                      <p className="text-lg sm:text-xl md:text-2xl font-semibold">{attendanceLogs?.totalEmployees}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Present Employees</h2>
                      <p className="text-lg sm:text-xl md:text-2xl font-semibold">{attendanceLogs?.totalPresent}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : ''}

            {userDataList?.role !== "HR-Admin" && (
              <>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 mt-6">Monthly Attendance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded shadow col-span-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Calendar</h3>
                    <div className="flex gap-4 mb-4 flex-wrap text-sm">
                      {[
                        ['bg-lime-400', 'Full Day'],
                        ['bg-amber-300', 'Half Day'],
                        ['bg-red-400', 'Absent'],
                        ['bg-blue-400', 'Holiday'],
                        ['bg-black', 'Leave Applied']
                      ].map(([bg, label], i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className={`${bg} w-2 h-2 rounded-full`}></span>
                          <p>{label}</p>
                        </div>
                      ))}
                    </div>
                    {attendanceLoading ? <SkeletonCard height="h-40" /> : <Calendar />}
                  </div>
                  <div>
                    {/* <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Company Pay</h3>
                      </div>
                      <div className="flex items-center justify-center mt-4">
                        <PieChart width={200} height={200}>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="text-center -mt-24 font-bold text-2xl text-gray-700">1,206</div>
                      <div className="text-center text-sm text-gray-500 mb-4">Salary</div>
                      <div className="space-y-2 text-sm">
                        {pieData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                            <span className="text-gray-600">
                              {item.value}% {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-1">2024 Download Report</p>
                        <p className="text-xs text-gray-500 mb-3">Company Trends and Insights</p>
                        <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
                          <i className="ri-download-line mr-1"></i> Download Report
                        </button>
                      </div>
                    </div> */}
                    <div className="p-2 overflow-y-auto" style={{ height: "80%" }}>
                      <div className="bg-white p-6 rounded shadow" style={{ height: "100%" }}>
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-4">Check In - Check Out</h3>
                            <h3 className="text-sm font-bold mb-4">Total Hrs: ---</h3>
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-4">{punchDate}</h3>
                          </div>
                        </div>
                        <div className="p-2 overflow-y-auto" style={{ height: "80%" }}>
                          {attendanceLoading ? (
                            <SkeletonCard height="h-60" />
                          ) : latestData?.length > 0 ? (
                            <ol className="relative border-l border-gray-200">
                              {latestData?.slice(0, 1).map((entry, index) =>
                                entry.split(",").map((item, subIndex) => {
                                  const checkType = item.includes("(IN 1)") ? "Check In" : "Check Out";
                                  return (
                                    <li key={`${index}-${subIndex}`} className="mb-10 ms-4">
                                      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                      <p className="mb-1 text-xs sm:text-sm font-normal text-gray-400">{checkType}</p>
                                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{item}</h3>
                                    </li>
                                  );
                                })
                              )}
                            </ol>
                          ) : (
                            <div className="flex justify-center items-center h-full">
                              <p className="text-sm sm:text-base md:text-lg text-gray-500 font-semibold">No Data Available</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </>
            )}

            {userDataList?.role === "HR-Admin" && (
              <>
                <HrAdminDashboard />
                {/* <ManagerApproval /> */}
              </>
            )}
            {userDataList?.role !== "HR-Admin" && (
              <>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 mt-6">Announcement's</h3>
                <div>
                  {announcementData?.data.length > 0 ? (
                    announcementData?.data.map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
                      >
                        <h5 className="mb-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                          {item?.description}
                        </h5>
                        <p className="text-sm sm:text-base font-normal text-gray-700">{item?.dateTime}</p>
                      </a>
                    ))
                  ) : (
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
                      <h5 className="mb-2 text-base sm:text-lg md:text-2xl font-semibold tracking-tight text-gray-700">
                        No Announcements yet
                      </h5>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>

  );
};

export default Dashboard;
