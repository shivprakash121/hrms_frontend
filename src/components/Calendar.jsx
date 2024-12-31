import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { postApplyCompOffLeaveAction, postApplyRegularizationAction } from "../store/action/userDataAction";
import { Bounce, ToastContainer, toast } from "react-toastify";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [selectedDay, setSelectedDay] = useState(null); // Selected day state
  const [reason, setReason] = useState("");
  const [selectType, setSelectType] = useState("");
  const { data, error } = useSelector((state) => state.compoffReducer)
  const { loading, data: dataa } = useSelector((state) => state.userData);
  const userDataList = dataa?.data || [];
  console.log('userDataList', userDataList)

  useEffect(() => {
    toast.success(data?.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, [data])
  const dispatch = useDispatch();
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

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysOff = [
    {
      date: "21 December 2024",
      type: "offDay",
    },
    {
      date: "22 December 2024",
      type: "offDay",
    },
    {
      date: "23 December 2024",
      type: "fullday",
    },
    {
      date: "24 December 2024",
      type: "halfDay",
    },
    {
      date: "25 December 2024",
      type: "offDay",
    },
    {
      date: "26 December 2024",
      type: "fullday",
    },
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

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
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const selectedDate = new Date(currentYear, currentMonth, day);

    // Allow clicks only on dates from yesterday up to seven days ago
    if (selectedDate <= yesterday && selectedDate >= sevenDaysAgo) {
      setSelectedDay(day); // Set the selected day
      setModalOpen(true); // Open the modal
    } else {
      toast.error(
        "You can only select dates from yesterday up to the past seven days.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectType) {
      alert("Select leave type");
      return;
    }
    if (!reason) {
      alert("Provide a reason for leave");
      return;
    }

    const leaveStartDate = `${selectedDay} ${months[currentMonth]} ${currentYear}`;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const selectedDate = new Date(currentYear, currentMonth, selectedDay);

    // Restrict leave application for today
    if (selectedDate >= today) {
      alert("Leave cannot be applied for today.");
      return;
    }

    if (selectType === "compOffLeave") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      if (selectedDate < sevenDaysAgo || selectedDate > yesterday) {
        alert("CompOff leave can only be applied for dates from yesterday up to the past seven days.");
        return;
      }
      dispatch(postApplyCompOffLeaveAction(leaveStartDate, reason));
      setModalOpen(false);
      return;
    }

    if (selectType === "regularization") {
      dispatch(postApplyRegularizationAction(leaveStartDate, reason));
      setModalOpen(false);
      return;
    }
  };


  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay(null); // Reset the selected day
  };

  const getDayType = (day) => {
    const formattedDate = `${day} ${months[currentMonth]} ${currentYear}`;
    const dayOff = daysOff.find((off) => off.date === formattedDate);
    return dayOff?.type || null; // Return the type or null if not found
  };

  const getDayClass = (day) => {
    if (!day) return "bg-transparent"; // Empty day

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const selectedDate = new Date(currentYear, currentMonth, day);

    const isWithinSevenDays =
      selectedDate <= today && selectedDate >= sevenDaysAgo;

    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    const formattedDate = `${day} ${months[currentMonth]} ${currentYear}`;
    const dayType = getDayType(day);

    if (isToday) {
      return "bg-blue-400 text-white"; // Highlight current date
    }

    if (dayType === "offDay") {
      return "border-2 border-red-500 text-red-600"; // Red border for leave within the previous 7 days
    }
    return "bg-gray-100 text-gray-800 hover:bg-gray-300"; // Default style for selectable days
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = daysInMonth(currentMonth, currentYear);

  // Create a grid for the calendar
  const calendarDays = [];
  for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
    calendarDays.push("");
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const handleInputChange = (e) => {
    setSelectType(e.target.value);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-200 p-4">
          <button
            className="text-gray-600 hover:text-gray-900 text-xl"
            onClick={handlePrevMonth}
          >
            <MdChevronLeft />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {months[currentMonth]} {currentYear}
          </h2>
          <button
            className="text-gray-600 hover:text-gray-900 text-xl"
            onClick={handleNextMonth}
          >
            <MdChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 p-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day)} // Add onClick to open modal
              className={`h-12 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer ${getDayClass(
                day
              )}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              Selected Date: {selectedDay} {months[currentMonth]} {currentYear}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="leaveType"
                className="block text-sm font-medium text-gray-700"
              >
                Leave Type<span className="text-red-500">*</span>
              </label>
              <select
                id="leaveType"
                name="leaveType"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select Leave Type</option>
                {userDataList?.maxRegularization === '0' ?
                  <option disabled>Regularization {userDataList?.maxRegularization}</option>
                  :
                  <option value="regularization">Regularization {userDataList?.maxRegularization} </option>
                }
                {userDataList?.leaveBalance?.compOffLeave === '0' ?
                  <option disabled>CompOff {userDataList?.leaveBalance?.compOffLeave}</option>
                  :
                  <option value="compOffLeave">CompOff {userDataList?.leaveBalance?.compOffLeave} </option>
                }
              </select>
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for regularize :
              </label>
              <textarea
                id="reason"
                name="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide your reason for regularize..."
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-black"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Calendar;