import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveApproveRequestAction, putApprovedLeaveByManagerAction } from "../store/action/userDataAction";

const Notifications = ({ closeModal, sendDataToParent }) => {
  const { data } = useSelector((state) => state?.managerLeaveApprove);
  const leaveReqData = data?.data || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLeaveApproveRequestAction());
  }, [dispatch]);

  useEffect(() => {
    // Send pending data to the parent component
    const pendingData = leaveReqData?.filter((item) => item.status === "Pending");
    sendDataToParent(pendingData);
  }, [leaveReqData, sendDataToParent]);

  const handleAction = (status, id) => {
    dispatch(putApprovedLeaveByManagerAction({ status, id }));
  };

  const pendingData = leaveReqData?.filter((item1) => item1.status === "Pending");

  return (
    <div
      id="modal-overlay"
      className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-start pt-10"
      onClick={closeModal}
    >
      <div className="w-full max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-lg z-60">
        {/* Header */}
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>

        {/* Notification Items */}
        {pendingData?.length > 0 ? (
          pendingData.map((item, index) => (
            <div className="p-4 flex border-b border-gray-300" key={index}>
              <div>
                <p>
                  <strong>{item?.employeeInfo?.employeeName}</strong> Applying {item?.leaveType} for{" "}
                  <strong>{item?.totalDays} Days</strong>
                </p>
                <p className="text-sm text-gray-500">{item?.leaveStartDate}</p>
                {item?.status === "Pending" && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white"
                      onClick={() => handleAction("Rejected", item?._id)}
                    >
                      Decline
                    </button>
                    <button
                      className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-500 hover:text-white"
                      onClick={() => handleAction("Approved", item?._id)}
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="px-10 py-10 text-center">No pending request left</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
