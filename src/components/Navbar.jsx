import React, { useEffect, useState } from "react";
import ddHealthcare from "../assets/Icon/ddHealthcare.png";
import { IoMdNotifications } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "../notification/Notification";
import { getLeaveApproveRequestAction } from "../store/action/userDataAction";

function Navbar({ onToggleSidebar }) {
  const { data } = useSelector((state) => state.userData);
  const userDataList = data?.data || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Fetch leave approval requests on component mount
  useEffect(() => {
    dispatch(getLeaveApproveRequestAction());
  }, [dispatch]);

  // Handle notification data sent from the Notifications component
  const handleNotificationData = (data) => {
    console.log("Data from Notifications:",data?.length?.toString(2));
    // Perform additional actions with received data if needed
  };

  // Toggle the notifications modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Close the modal when clicking on the overlay
  const closeModal = (e) => {
    if (e.target.id === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white shadow-md">
      {/* Sidebar Toggle Button (Mobile Only) */}
      <button
        onClick={onToggleSidebar}
        className="block md:hidden p-2 text-gray-700 rounded-lg focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Logo */}
      <div className="flex-1 flex justify-center md:justify-start">
        <img src={ddHealthcare} alt="Logo" className="w-20 h-10" />
      </div>

      {/* User Info and Notifications */}
      <div className="hidden md:flex items-center gap-4">
        {/* Notifications Icon */}
        <IoMdNotifications
          size={25}
          className="cursor-pointer"
          onClick={toggleModal}
        />
          <h3 className="font-bold text-sm text-red-300">{data?.length?.toString(2)}</h3>
        {/* User Name */}
        <span className="text-gray-700 text-sm font-medium">
          {userDataList.employeeName}
        </span>

        {/* User Initials Avatar */}
        <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
          {userDataList.employeeName?.charAt(0) || ""}
        </div>
      </div>

      {/* Notifications Modal */}
      {isModalOpen && (
        <Notifications
          closeModal={closeModal}
          sendDataToParent={handleNotificationData} // Passing callback to receive data
        />
      )}
    </div>
  );
}

export default Navbar;
