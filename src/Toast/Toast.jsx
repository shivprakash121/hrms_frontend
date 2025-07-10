import React from "react";

const Toast = ({ toasts, closeToast }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "error":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "";
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "";
    }
  };

  return (
    <div className="fixed top-4 right-25 space-y-4 z-50" style={{left:'50%'}}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between border p-4 rounded-lg shadow-sm ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => closeToast(toast.id)}
            className="text-lg font-bold text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
