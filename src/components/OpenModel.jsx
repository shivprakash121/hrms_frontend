import React from "react";
import { FiCamera } from "react-icons/fi"; // Icon for camera
import { IoIosArrowDown } from "react-icons/io";
const OpenModel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-lg shadow-xl p-6">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-400">
          &times;
        </button>

        {/* Camera Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-700 p-3 rounded-full">
            <FiCamera className="text-3xl text-gray-300" />
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="text-lg font-semibold text-center">
          Camera permission required
        </h2>
        <p className="text-center text-gray-400 mt-2">
          To make video calls, please turn on the camera permission in your app
          by clicking the notification.
        </p>

        {/* Notification Mock */}
        <div className="bg-gray-700 p-4 rounded-lg mt-6 relative">
          <div className="absolute -top-5 left-5 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">*</span>
          </div>
          <div className="pl-14">
            <p className="font-semibold">Allow camera access</p>
            <p className="text-sm text-gray-400">
              "Untitled" would like to access the camera.
            </p>
            <p className="text-sm text-gray-500 mt-1">2m ago</p>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="bg-gray-700 p-4 rounded-lg mt-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Step-by-step guide</p>
            <IoIosArrowDown className="text-xl text-gray-400" />
          </div>
          <ol className="mt-3 space-y-2 text-gray-400 text-sm">
            <li>1. Open the Untitled app on your mobile device</li>
            <li>2. Click the “Allow camera access” notification</li>
            <li>3. Follow the prompts on screen</li>
          </ol>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-between">
          <button className="py-2 px-4 bg-gray-700 text-sm text-gray-400 rounded-lg hover:bg-gray-600">
            Cancel
          </button>
          <button className="py-2 px-4 bg-gray-700 text-sm text-gray-400 rounded-lg hover:bg-gray-600">
            Didn’t get notification?
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenModel;
