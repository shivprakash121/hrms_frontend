import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";
import StatusManagment from "./StatusManagment";
import AddEmployee from "./AddEmployee";
import { getAttendenceLogsOfEmploye, getUserDataAction } from "../store/action/userDataAction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.userData);
  const userDataList = data?.data || [];
  const { data: attendanceData, loading: attendanceLoading } = useSelector((state) => state.attendanceLogs);
  const punchInLogs = attendanceData?.data || [];
  const latestData = punchInLogs?.map((item) => item.PunchRecords);
  const punchDate = punchInLogs?.map((item) => item.AttendanceDate);
  // console.log('punchdate',punchDate?.splice(0,1)[0])
  const employeeId = localStorage.getItem("employeId");

  useEffect(() => {
    dispatch(getAttendenceLogsOfEmploye(employeeId));
    dispatch(getUserDataAction(employeeId));
  }, [dispatch, employeeId]);

  const calculateTotalHours = (data) => {
    if (!data) return "00:00";

    const entries = data.split(",").filter((item) => item.trim() !== "");
    let totalMinutes = 0;

    for (let i = 0; i < entries.length; i += 2) {
      const inTime = entries[i]?.split(":")[0];
      const outTime = entries[i + 1]?.split(":")[0];
      if (!inTime || !outTime) continue;

      const [inHour, inMinute] = inTime.split(":").map(Number);
      const [outHour, outMinute] = outTime.split(":").map(Number);

      const inMinutes = inHour * 60 + inMinute;
      const outMinutes = outHour * 60 + outMinute;

      totalMinutes += outMinutes - inMinutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const SkeletonCard = ({ height = "h-20", width = "w-full" }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${height} ${width}`}></div>
  );

  const LeaveCard = ({ title, value, bgColor }) => (
    <div className={`p-6 rounded-lg shadow ${bgColor}`}>
      <h3 className="text-lg">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="w-full p-4">
      <main>
        {/* Leave Balance Section */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h3 className="text-xl font-bold mb-4 md:mb-0">Leave Balance</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            <>
              <LeaveCard
                title="Casual Leave"
                value={userDataList?.leaveBalance?.casualLeave || 0}
                bgColor="bg-yellow-50"
              />
              <LeaveCard
                title="Earned Leave"
                value={userDataList?.leaveBalance?.earnedLeave || 0}
                bgColor="bg-blue-50"
              />
              <LeaveCard
                title="Medical Leave"
                value={userDataList?.leaveBalance?.medicalLeave || 0}
                bgColor="bg-purple-50"
              />
            </>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
            <div className="flex gap-6 items-center">
              <AddEmployee tittleBtn="Apply Leave" />
              {/* <Link className="text-blue-500 font-semibold hover:underline">View all</Link> */}
            </div>
          </div>
          <StatusManagment />
        </div>

        {/* Activities Section */}
        <h3 className="text-xl font-bold mb-4">Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow col-span-2">
            <h3 className="text-xl font-bold mb-4">Calendar</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex gap-2 items-center">
                <span className="bg-lime-400 text-lime-400" style={{ width: '10px', height: '10px', borderRadius: '10px', fontSize: '5px' }}>1</span>
                <p>It represent the Full Day</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="bg-amber-300 text-amber-200" style={{ width: '10px', height: '10px', borderRadius: '10px', fontSize: '5px' }}>1</span>
                <p>It represent the Half Day</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="bg-red-400 text-red-400" style={{ width: '10px', height: '10px', borderRadius: '10px', fontSize: '5px' }}>1</span>
                <p>It represent the Absent</p>
              </div>
            </div>
            {attendanceLoading ? <SkeletonCard height="h-40" /> : <Calendar />}
          </div>
          <div className="p-2 overflow-y-auto" style={{ height: "80%" }}>
            <div className="bg-white p-6 rounded shadow" style={{ height: "100%" }}>
              <div>
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold mb-4">Check In - Check Out</h3>
                  <h3 className="text-sm font-bold mb-4">
                    Total Hrs: ---
                    {/* {latestData?.length > 0 &&
                    calculateTotalHours(latestData.slice(0, 1)[0])} */}
                  </h3>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    {punchDate?.splice(0, 1)[0]?.split('T')[0]}
                  </h3>
                </div>
              </div>
              <div className="p-2 overflow-y-auto" style={{ height: "80%" }}>
                {attendanceLoading ? (
                  <SkeletonCard height="h-60" />
                ) : latestData?.length > 0 ? (
                  <ol className="relative border-l border-gray-200">
                    {latestData.slice(0, 1).map((entry, index) =>
                      entry.split(",").map((item, subIndex) => {
                        const checkType = item.includes("(IN 1)")
                          ? "Check In"
                          : "Check Out";
                        return (
                          <li key={`${index}-${subIndex}`} className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                            <p className="mb-1 text-sm font-normal text-gray-400">
                              {checkType}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item}
                            </h3>
                          </li>
                        );
                      })
                    )}
                  </ol>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 text-lg font-semibold">
                      No Data Available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
