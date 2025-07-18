import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getCalenderLogsApiAction,
  postApplyCompOffLeaveAction,
  postApplyRegularizationAction,
  postVendorMeetingAction,
} from "../store/action/userDataAction";
import { Bounce, ToastContainer, toast } from "react-toastify";

function Calendar({ employeeId, userRole }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectDuration, setSelectDuration] = useState("");
  const [totalDayss, setTotalDayss] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [reason, setReason] = useState("");
  const [selectType, setSelectType] = useState("");
  const [activeTab, setActiveTab] = useState("leave");

  const dispatch = useDispatch();

  const { data: dataaa } = useSelector((state) => state.calenderLogsData);
  const dayLogs = dataaa?.data;
  const { data, error } = useSelector((state) => state.compoffReducer);
  const { data: data1, error: error1 } = useSelector(
    (state) => state.regularizeReducer
  );

  useEffect(() => {
    const monthYear = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}`;
    dispatch(getCalenderLogsApiAction(monthYear, employeeId));
  }, [currentMonth, currentYear, dispatch, employeeId]);

  useEffect(() => {
    if (data?.message || data1?.message) {
      toast.success(data?.message || data1?.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setTimeout(() => window.location.reload(), 1500);
    }
  }, [data?.message, data1?.message]);

  useEffect(() => {
    if (error1) {
      toast.error(error1, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [error1]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const today = new Date();
    const selectedDate = new Date(currentYear, currentMonth, day);

    if (
      selectedDate <= today &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    ) {
      setSelectedDay(day);
      setModalOpen(true);
    } else {
      toast.error("Only current or past dates in this month can be selected.", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const compOffDate = `${selectedDay} ${months[currentMonth]} ${currentYear}`;

    if (activeTab === "compoff") {
      if (!totalDayss) {
        alert("Please select duration for Comp-Off");
        return;
      }
      dispatch(
        postApplyCompOffLeaveAction({ compOffDate, reason, totalDayss })
      );
      setModalOpen(false);
      return;
    }

    if (!selectType) {
      alert("Select leave type");
      return;
    }
    if (!reason) {
      alert("Provide a reason for leave");
      return;
    }

    if (selectType === "vendor-meeting") {
      if (!selectDuration) {
        alert("Please select vendor meeting duration");
        return;
      }
      const leaveStartDate = new Date(compOffDate)
        .toISOString()
        .slice(0, 10);
      dispatch(
        postVendorMeetingAction({
          leaveType: selectType,
          leaveStartDate,
          reason,
          duration: selectDuration,
        })
      );
    } else {
      const date = new Date(compOffDate + " 00:00:00");
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      dispatch(
        postApplyRegularizationAction(selectType, formattedDate, reason)
      );
    }

    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
    setSelectType("");
    setSelectDuration("");
    setReason("");
    setTotalDayss("");
  };

  const getDayType = (day) => {
    const formattedDate = `${day} ${months[currentMonth]} ${currentYear}`;
    const dayOff = dayLogs?.find((off) => off.AttendanceDate === formattedDate);
    const inTimeData = dayOff?.InTime?.split(" ")[1]?.slice(0, 5) || null;

    return {
      AttendanceStatus: dayOff?.AttendanceStatus || null,
      inTimeData,
      isLeaveTaken: dayOff?.isLeaveTaken || null,
      Status: dayOff?.Status || null,
      leaveType: dayOff?.leaveType || null,
    };
  };

  const getDayClass = (day) => {
    if (!day) return "bg-transparent";
    const today = new Date();
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    const { AttendanceStatus, inTimeData, isLeaveTaken, Status } =
      getDayType(day);

    if (isToday) return "bg-blue-400 text-white";
    if (AttendanceStatus === "Absent" && Status === "Present")
      return "text-red-800 border-2 border-red-300";
    if (AttendanceStatus === "Present" || isLeaveTaken)
      return "bg-white text-black border-2 border-black";
    if (AttendanceStatus === "Absent" && Status === "Absent")
      return "text-red-800 border-2 border-red-300";
    if (AttendanceStatus === "Absent" || Status === "WeeklyOff")
      return "bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-white";
    if (AttendanceStatus === "Full Day")
      return "text-green-800 border-2 border-lime-300 hover:bg-green-500";
    if (AttendanceStatus === "Half Day")
      return "text-yellow-800 border-2 border-amber-200";
    if (AttendanceStatus === "Holiday")
      return "text-blue-800 border-2 border-blue-300";
    if (inTimeData) return "text-blue-800 border-2 border-blue-300";
    return "bg-gray-100 text-gray-800 hover:bg-gray-300";
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array(totalDays).keys()].map((d, i) =>
    typeof d === "number" ? d + 1 : d
  );

  const handleInputChange = (e) => setSelectType(e.target.value);

  const handelChangeDuration = (e) => {
    const value = e.target.value;
    if (value === "first-half" || value === "second-half") {
      setTotalDayss("0.5");
    } else {
      setTotalDayss("1");
    }
  };

  return (
    <>
      <div className="mb-2 text-xs sm:text-sm md:text-base">
        <h3>Leave Define:</h3>
        <p>
          EL: Earned Leave / CL: Casual Leave / OL: Optional Leave / ML: Medical Leave / Reg-L: Regularized / SL: Short Leave / UnInf-L: Uninformed Leave
        </p>
        <p>Total Working Days: {dataaa?.data2?.totalWorkingDays}</p>
      </div>

      <div className="flex justify-center items-center bg-gray-100">
        <ToastContainer />
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between bg-gray-200 p-4">
            <button onClick={handlePrevMonth} className="text-xl text-gray-600 hover:text-gray-900">
              <MdChevronLeft />
            </button>
            <h2 className="font-semibold text-gray-800">
              {months[currentMonth]} {currentYear}
            </h2>
            <button onClick={handleNextMonth} className="text-xl text-gray-600 hover:text-gray-900">
              <MdChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 p-4">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) =>
              day ? (
                <div
                  key={index}
                  className={`h-12 flex items-center justify-center rounded-lg font-medium cursor-pointer ${getDayClass(day)}`}
                  onClick={() => userRole !== "Super-Admin" && handleDayClick(day)}
                >
                  {day}
                  {getDayType(day)?.leaveType &&
                    ` ${
                      {
                        "shortLeave": "SL",
                        "medicalLeave": "ML",
                        "casualLeave": "CL",
                        "earnedLeave": "EL",
                        "compOffLeave": "Comp-L",
                        "optionalLeave": "OL",
                        "vendor-meeting": "Vendor-M",
                        "regularized": "Reg-L",
                        "uninformedLeave": "UnInf-L",
                      }[getDayType(day).leaveType]
                    }`}
                </div>
              ) : (
                <div key={index} className="h-12"></div>
              )
            )}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">
                  Selected Date: {selectedDay} {months[currentMonth]} {currentYear}
                </h2>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded ${activeTab === "leave" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("leave")}
                  >
                    Apply Leave
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${activeTab === "compoff" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("compoff")}
                  >
                    Raise Comp-Off
                  </button>
                </div>
              </div>

              {activeTab === "leave" ? (
                <>
                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">Leave Type *</label>
                    <select
                      onChange={handleInputChange}
                      value={selectType}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="shortLeave">Short Leave</option>
                      {/* <option value="casualLeave">Casual Leave</option> */}
                      {/* <option value="medicalLeave">Medical Leave</option> */}
                      {/* <option value="earnedLeave">Earned Leave</option> */}
                      {/* <option value="optionalLeave">Optional Leave</option> */}
                      {/* <option value="uninformedLeave">Uninformed Leave</option> */}
                      <option value="vendor-meeting">Vendor Meeting</option>
                      <option value="regularized">Regularization</option>
                    </select>
                  </div>

                  {selectType === "vendor-meeting" && (
                    <div className="mb-4">
                      <label className="block font-medium text-gray-700">Vendor Meeting Duration</label>
                      <select
                        value={selectDuration}
                        onChange={(e) => setSelectDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select Duration</option>
                        <option value="first-half">First Half</option>
                        <option value="second-half">Second Half</option>
                        <option value="1">Full Day</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Comp-Off Duration</label>
                  <select
                    onChange={handelChangeDuration}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Duration</option>
                    <option value="first-half">Half Day</option>
                    {/* <option value="second-half">Second Half</option> */}
                    <option value="1">Full Day</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  placeholder="Enter your reason"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-black"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Calendar;
