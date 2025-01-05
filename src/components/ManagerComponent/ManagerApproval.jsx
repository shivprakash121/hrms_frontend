import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompoffLeaveRequestAction,
  getLeaveApproveRequestAction,
  putApprovedLeaveByManagerAction,
  putCompOffLeaveRequestAction,
} from "../../store/action/userDataAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerApproval = () => {
  const { loading, data, error } = useSelector((state) => state.managerLeaveApprove);
  const { data: compOff } = useSelector((state) => state.compoffApprove);
  const leaveReqData = data?.data || [];
  const compOffData = compOff?.data || [];
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejectItem, setCurrentRejectItem] = useState(null);

  useEffect(() => {
    dispatch(getLeaveApproveRequestAction());
    dispatch(getCompoffLeaveRequestAction());
  }, [dispatch]);

  const handleRejectClick = (item) => {
    setCurrentRejectItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    const status = "Rejected";
    dispatch(
      putApprovedLeaveByManagerAction({
        status,
        id: currentRejectItem?._id,
        remarks: rejectionReason,
      })
    );
    setRejectionReason("");
    setIsModalOpen(false);
  };

  const handleAction = (status, id, isCompOff = false) => {
    const action = isCompOff ? putCompOffLeaveRequestAction : putApprovedLeaveByManagerAction;
    dispatch(action({ status, id }));
  };

  const SkeletonLoader = () => (
    <tr className="animate-pulse">
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <td key={index} className="p-5">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </td>
        ))}
    </tr>
  );

  const renderTableRows = (data, isCompOff = false) =>
    data.map((item, index) => (
      <tr key={index} className="border-t">
        <td className="p-5 text-center">{item?.employeeInfo?.employeeName}</td>
        <td className="p-5 text-center">{item?.dateTime?.split(" ")[0]?item?.dateTime?.split(" ")[0]:item?.appliedDate?.split(" ")[0]}</td>
        {isCompOff ? null : (
          <>
            <td className="p-5 text-center">{item?.leaveStartDate}</td>
            <td className="p-5 text-center">{item?.leaveEndDate}</td>
          </>
        )}
        <td className="p-5 text-center">
          {item?.leaveType?.toUpperCase().split("LEAVE")[0]} LEAVE
        </td>
        <td className="p-5 text-center">{item?.reason}</td>
        <td className="p-5 text-center">{item?.totalDays}</td>
        <td className="p-5 text-center flex gap-4 justify-center">
          {item?.status === "Pending" ? (
            <>
              <button
                onClick={() => handleAction("Approved", item?._id, isCompOff)}
                className="px-5 py-3 bg-green-100 text-green-600 rounded hover:bg-green-500 hover:text-white"
              >
                Approve
              </button>
              <button
                onClick={() => (isCompOff ? handleAction("Rejected", item?._id, true) : handleRejectClick(item))}
                className="px-5 py-3 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white"
              >
                Reject
              </button>
            </>
          ) : (
            item?.status
          )}
        </td>
      </tr>
    ));

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        {/* Leave Approvals */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Leave Approvals</h2>
          </div>
          <div className="overflow-auto bg-white rounded-lg shadow-md">
            <table className="table-auto w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold text-center">Employee Name</th>
                  <th className="p-3 font-semibold text-center">Request Date</th>
                  <th className="p-3 font-semibold text-center">Start Date</th>
                  <th className="p-3 font-semibold text-center">End Date</th>
                  <th className="p-3 font-semibold text-center">Leave Type</th>
                  <th className="p-3 font-semibold text-center">Reason</th>
                  <th className="p-3 font-semibold text-center">Total Days</th>
                  <th className="p-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <SkeletonLoader /> : renderTableRows(leaveReqData)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compoff Approvals */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Compoff Request Approval</h2>
          </div>
          <div className="overflow-auto bg-white rounded-lg shadow-md">
            <table className="table-auto w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold text-center">Employee Name</th>
                  <th className="p-3 font-semibold text-center">Request Date</th>
                  <th className="p-3 font-semibold text-center">Leave Type</th>
                  <th className="p-3 font-semibold text-center">Reason</th>
                  <th className="p-3 font-semibold text-center">Total Days</th>
                  <th className="p-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <SkeletonLoader /> : renderTableRows(compOffData, true)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reason For Reject Leave</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason for rejection"
              className="w-full p-2 border rounded mb-4"
              rows="4"
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRejection}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerApproval;
