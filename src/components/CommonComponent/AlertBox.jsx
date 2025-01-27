import React, { useState } from "react";
// import "./CustomAlert.css"; // For styling the alert box

const AlertBox = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
  });

  const showCustomAlert = (title, message) => {
    setAlertContent({ title, message });
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  return (
    <>
      {/* Button to trigger the alert */}
      <button
        className="trigger-alert-btn"
        onClick={() =>
          showCustomAlert("Custom Alert", "This is a React custom alert!")
        }
      >
        Show Alert
      </button>

      {/* Alert Box */}
      {alertVisible && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box">
            <div className="custom-alert-title">{alertContent.title}</div>
            <div className="custom-alert-message">{alertContent.message}</div>
            <button className="custom-alert-button" onClick={closeCustomAlert}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertBox;
