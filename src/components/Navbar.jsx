import React, { useState } from "react";
import ddHealthcare from "../assets/Icon/ddHealthcare.png";
import { IoMdNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import Notifications from "../notification/Notification";

function Navbar({ onToggleSidebar }) {
  const { data } = useSelector((state) => state.userData);
  const userDataList = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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
        <img
          src={ddHealthcare}
          alt="Logo"
          className="w-20 h-10"
        />
      </div>

      {/* User Info */}
      <div className="hidden md:flex items-center gap-4">
        <div style={{ display: 'flex' }}>
          <IoMdNotifications
            size={25}
            className="cursor-pointer"
            onClick={toggleModal}
          />
          <span style={{ width: '12px', height: '12px', backgroundColor: 'red',borderRadius:'10px',fontSize:'12px',color:'white',textAlign:'center' }}></span>
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {userDataList?.employeeName}
        </span>
        <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
          {userDataList?.employeeName?.charAt(0)}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Notifications closeModal={closeModal} />
      )}
    </div>
  );
}
export default Navbar;