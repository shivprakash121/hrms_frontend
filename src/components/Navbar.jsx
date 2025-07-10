import React, { useEffect, useState, useRef } from "react";
import ddHealthcare from "../assets/Icon/ddHealthcare.png";
import { IoMdNotifications } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "../notification/Notification";
import {
  getPunchInDataAction,
  postPunchInDataAction,
  postPunchOutDataAction,
} from "../store/action/userAdminAction";

function Navbar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [punchInState, setPunchInState] = useState(false);

  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const [locationInfo, setLocationInfo] = useState({
    city: "",
    state: "",
    suburb: "",
  });

  const { data: punchInDataRaw } = useSelector((state) => state.punchInDataReducer);
  const punchInData = punchInDataRaw?.data;

  const { data: userDataRaw } = useSelector((state) => state.userData);
  const userData = userDataRaw?.data || {};
  const userType = userData?.role;

  useEffect(() => {
    dispatch(getPunchInDataAction());
  }, [timer, locationInfo.state]);

  const startTimer = () => {
    const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const getLocationAndDispatch = async (image) => {
    const success = async ({ coords }) => {
      const { latitude, longitude } = coords;
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d67b43154d4442638a0648615ec76cbd`
        );
        const data = await res.json();
        const components = data.results[0]?.components || {};

        const city = components.city || components.town || "Unknown city";
        const state = components.state || "Unknown state";
        const suburb = components.suburb || components.town || "Unknown suburb";

        setLocationInfo({ city, state, suburb });

        dispatch(
          postPunchInDataAction({
            location: `${city}, ${state}`,
            imageUrl: image,
          })
        );
      } catch (err) {
        console.error("Location fetch error:", err);
        setLocationInfo({ city: "Unknown", state: "Unknown", suburb: "Unknown" });
      }
    };

    const error = () => {
      setLocationInfo({ city: "Denied", state: "Unknown", suburb: "Unknown" });
    };

    navigator.geolocation?.getCurrentPosition(success, error);
  };

  const handleCapture = () => {
    const image = webcamRef.current.getScreenshot();
    setCapturedImage(image);
    setShowImageOptions(true);
  };

  const handleUploadImage = () => {
    if (capturedImage) {
      getLocationAndDispatch(capturedImage);
      setIsCameraOpen(false);
      setShowImageOptions(false);
      setPunchInState(true);
      startTimer();
    }
  };

  const handlePunchOut = () => {
    dispatch(postPunchOutDataAction({ id: punchInData?._id }));
    setPunchInState(false);
    stopTimer();
  };

  const isPunchedIn = punchInData?.InTime?.length > 0;
  const isPunchedOut = punchInData?.OutTime === "NA" || punchInState;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white shadow-md w-full">
      {/* Logo + Sidebar */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <button onClick={onToggleSidebar} className="block md:hidden p-2 text-gray-700">
          <FaBars size={20} />
        </button>
        <img src={ddHealthcare} alt="Logo" className="w-20 h-10 ml-2" />
      </div>

      {/* Punch and Info */}
      <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-start sm:items-center mt-4 sm:mt-0 w-full sm:w-auto">
        {userType !== "HR-Admin" && userType !== "Super-Admin" && (
          <>
            {isPunchedOut ? (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm flex items-center justify-center w-full sm:w-40"
                onClick={handlePunchOut}
              >
                <span className="hidden sm:inline">Punch Out</span>
                <FaRegClock className="sm:hidden text-white" />
              </button>
            ) : !isPunchedIn ? (
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm flex items-center justify-center"
                onClick={() => setIsCameraOpen(true)}
              >
                <span className="hidden sm:inline">Punch In</span>
                <FaRegClock size={20} className="sm:hidden text-white" />
              </button>
            ) : null}

            {locationInfo.city && (
              <span className="text-xs sm:text-sm text-gray-700 max-w-[90vw] sm:max-w-none truncate">
                Location: {locationInfo.suburb}, {locationInfo.city}, {locationInfo.state}
              </span>
            )}
            {isPunchedIn && (
              <span className="text-xs sm:text-sm text-gray-700">
                Punch In Time: {punchInData?.InTime?.split(" ")[1]}
              </span>
            )}
          </>
        )}

        {/* Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          <IoMdNotifications
            size={24}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <h3 className="font-bold text-xs text-red-300">
            {userDataRaw?.length?.toString(2)}
          </h3>
          <span className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-[80px]">
            {userData.employeeName}
          </span>
          <div className="bg-blue-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold">
            {userData.employeeName?.charAt(0)}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {isModalOpen && (
        <Notifications
          closeModal={(e) => {
            if (e.target.id === "modal-overlay") setIsModalOpen(false);
          }}
          sendDataToParent={(data) => {
            console.log("Notification data:", data?.length?.toString(2));
          }}
        />
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-xl flex flex-col items-center gap-4">
            {!capturedImage ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg w-full"
                />
                <button
                  onClick={handleCapture}
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                  Capture Image
                </button>
              </>
            ) : (
              <>
                <img src={capturedImage} alt="Captured" className="rounded w-full object-cover" />
                {showImageOptions && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setShowImageOptions(false);
                      }}
                      className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600"
                    >
                      Retry Image
                    </button>
                    <button
                      onClick={handleUploadImage}
                      className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                    >
                      Upload Image
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => {
                setIsCameraOpen(false);
                setCapturedImage(null);
                setShowImageOptions(false);
              }}
              className="text-red-500 hover:underline text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
