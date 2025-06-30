import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployeeAtendenceAction, getAttendenceLogsOfEmploye, getUserDataAction } from "../store/action/userDataAction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const EmployeesAttendanceData = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState({ startDate: null, endDate: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [count, setCount] = useState(1); // Pagination count
  const { data: dataa } = useSelector((state) => state.userData);
  const userDataList = dataa?.data
  const { loading, data } = useSelector((state) => state.attendanceLogs);
  const { data: allAttendancedata } = useSelector((state) => state.allEmployeeAttencance);
  const employees = data?.data? data?.data:allAttendancedata?.data || [];
  console.log('allAttendancedata', allAttendancedata)

  const employeeId = localStorage.getItem("employeId");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDataAction());
  }, [dispatch])

  useEffect(() => {
    const dateFrom = date.startDate?.format("YYYY-MM-DD");
    const dateTo = date.endDate?.format("YYYY-MM-DD");
    if (userDataList?.role === "HR-Admin") {
      dispatch(getAllEmployeeAtendenceAction(dateFrom, dateTo, count))
      return;
    }
    else {
      dispatch(getAttendenceLogsOfEmploye(employeeId, dateFrom, dateTo, count));
      return;
    }

  }, [employeeId, date, count, dispatch]);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handlePrevious = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleNext = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const SkeletonLoader = () => (
    <tr className="animate-pulse">
      {Array(6)
        .fill(0)
        .map((_, idx) => (
          <td key={idx} className="p-5 text-center">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </td>
        ))}
    </tr>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row items-center justify-end mb-4 gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={date.startDate}
              onChange={(newDate) => setDate({ ...date, startDate: newDate })}
            />
            <DatePicker
              label="End Date"
              value={date.endDate}
              onChange={(newDate) => setDate({ ...date, endDate: newDate })}
            />
          </LocalizationProvider>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Employee Name",
                  "Status",
                  "Date",
                  "Check In",
                  "Check Out",
                  "Effective Hours",
                  "Days",
                  "Leave type",
                  "Records",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="p-3 text-center font-semibold hidden sm:table-cell"
                  >
                    {header}
                  </th>
                ))}
                <th className="p-3 text-center font-semibold sm:hidden">
                  Date
                </th>
                <th className="p-3 text-center font-semibold sm:hidden">
                  Check In
                </th>
                <th className="p-3 text-center font-semibold sm:hidden">
                  Check Out
                </th>
                <th className="p-3 text-center font-semibold sm:hidden">
                  Days
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(10)
                  .fill(0)
                  .map((_, idx) => <SkeletonLoader key={idx} />)
                : employees
                  ?.filter((employee) =>
                    employee.EmployeeName.toLowerCase().includes(
                      search.toLowerCase()
                    )
                  )
                  ?.map((employee) => {
                    const hours = Math.floor(employee.Duration / 60);
                    const minutes = employee.Duration % 60;
                    let dayType = "Off Day";
                    if (
                      employee.Duration >= 4 * 60 + 30 &&
                      employee.Duration < 8 * 60 + 30
                    )
                      dayType = "Half Day";
                    else if (employee.Duration >= 8 * 60 + 30)
                      dayType = "Full Day";

                    return (
                      <tr
                        key={employee.id}
                        className="border-t hover:bg-gray-100"
                      >
                        <td className="p-5 text-center hidden sm:table-cell">
                          {employee.EmployeeName}
                        </td>
                        <td className="p-5 text-center hidden sm:table-cell">
                          {employee.Status}
                        </td>
                        <td className="p-5 text-center">
                          {employee.AttendanceDate?.split("T")[0]}
                        </td>
                        <td className="p-5 text-center">
                          {employee.InTime.split(" ")[1] === "00:00:00"
                            ? "--"
                            : employee.InTime.split(" ")[1]}
                        </td>
                        <td className="p-5 text-center">
                          {employee.OutTime.split(" ")[1] === "00:00:00"
                            ? "--"
                            : employee.OutTime.split(" ")[1]}
                        </td>

                        <td className="p-5 text-center hidden sm:table-cell">
                          {hours} Hrs {minutes} Min
                        </td>
                        <td
                          className="p-5 text-center"
                          style={{
                            color:
                              dayType === "Full Day"
                                ? "green"
                                : dayType === "Half Day"
                                  ? "#FF7E01"
                                  : employee.Status === "Absent"
                                    ? "red"
                                    : "blue",
                          }}
                        >
                          {dayType}
                        </td>
                        <td className="p-5 text-center hidden sm:table-cell">
                          {employee.LeaveType?employee.LeaveType:'---'}
                        </td>
                        <td className="p-5 text-center hidden sm:table-cell">
                          <button
                            className="bg-blue-600 text-white p-2 rounded"
                            onClick={() => handleOpenModal(employee)}
                          >
                            Punch Records
                          </button>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center sm:justify-end mt-4 gap-4">
        {count === 1?"":
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-lg ${count === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          disabled={count === 1}
        >
          Previous
        </button>}
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className="bg-white rounded p-6 mx-auto my-10 max-w-xl">
          <h2 className="text-lg font-semibold">Punch Records Logs</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {selectedEmployee?.PunchRecords
              ?.trim()
              ?.replace(/,$/, "")
              ?.split(",")
              ?.map((item, index) => {
                const bgColor = item.includes("in(IN 1)") ? "#DEF7EC" : "#FDE8E8";
                const textColor = item.includes("in(IN 1)") ? "#014737" : "#C81E1E";
                return (
                  <div
                    key={index}
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      backgroundColor: bgColor,
                      color: textColor,
                      borderRadius: "8px",
                      width: "9rem",
                    }}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EmployeesAttendanceData;
