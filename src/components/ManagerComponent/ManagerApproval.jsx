import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompoffLeaveRequestAction,
  getLeaveApproveRequestAction,
  getUserDataAction,
  getVendorLogsAction,
  postVendorMeetingAction,
  putApprovedLeaveByManagerAction,
  putCompOffLeaveRequestAction,
  putRevertLeaveByManagerAction,
  putVendorStatusDataAction,
} from "../../store/action/userDataAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

const ManagerApproval = () => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.managerLeaveApprove);
  const { data: compOff } = useSelector((state) => state.compoffApprove);
  const { data: vendorData } = useSelector((state) => state.vendorLogsData);
  const vendorDataa = vendorData?.data
  const leaveReqData = data?.data || [];
  const compOffData = compOff?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("leave");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const { data: dataa } = useSelector((state) => state.userData);
  const userDataList = dataa?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLeaveType, setFilterLeaveType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejectItem, setCurrentRejectItem] = useState("");



  // Filter data based on the active tab
  const filteredData = activeTab === "leave" ? leaveReqData : activeTab === "revert" ? leaveReqData : activeTab === 'vendor' ? vendorDataa : compOffData;
  console.log('filteredData', filteredData)
  // Apply search filter
  const filteredBySearch = filteredData.filter(item =>
    item?.employeeInfo?.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply status filter
  const filteredByStatus = filterStatus
    ? filteredBySearch?.filter(item => item?.status === filterStatus)
    : filteredBySearch;

  // Apply leave type filter
  const filteredByLeaveType = filterLeaveType
    ? filteredByStatus.filter(item => item?.leaveType?.toLowerCase() === filterLeaveType.toLowerCase())
    : filteredByStatus;

  // Paginate the filtered data
  const currentData = filteredByLeaveType.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Total pages calculation
  const totalPages = Math.ceil(filteredByLeaveType.length / itemsPerPage);
  console.log('totalPages', totalPages, filteredByLeaveType?.length)
  // Pagination Handlers
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    dispatch(getLeaveApproveRequestAction());
    dispatch(getCompoffLeaveRequestAction());
    dispatch(getUserDataAction());
    dispatch(getVendorLogsAction());
  }, [dispatch]);

  const handleRejectClick = (item) => {
    // setCurrentRejectItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    dispatch(
      putApprovedLeaveByManagerAction({
        status: "Rejected",
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
        <td className="p-5 text-center">
          {item?.dateTime?.split(" ")[0] || item?.appliedDate?.split(" ")[0]}
        </td>
        {!isCompOff && (
          <>
            <td className="p-5 text-center">{item?.leaveStartDate}</td>
            <td className="p-5 text-center">{item?.leaveEndDate}</td>
          </>
        )}
        {activeTab === "leave" ?
          <td className="p-5 text-center">{item?.leaveType?.toUpperCase().split("LEAVE")[0]} LEAVE</td>
          : ''}
        <td className="p-5 text-center" style={{ width: "20rem" }}>
          {item?.reason}
        </td>
        <td className="p-5 text-center">{item?.totalDays}</td>
        {activeTab === "leave" ?
          <td className="p-5 text-center">
            {item?.location ? (
              <Link className="py-2 px-3 bg-blue-500 text-white rounded" to={item?.location}>
                View
              </Link>
            ) : (
              "---"
            )}
          </td>
          : ''}
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
                onClick={() => {
                  isCompOff === true ? handleAction("Rejected", item?._id, true) : handleRejectClick(item)
                }}
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

  const renderRevertTableRow = (data) => {
    // Filter data where revertLeave.revertedDays exists and is not an empty string
    const filteredData = data?.filter(item => item?.revertLeave?.revertedDays);
    // Render rows based on the filtered data
    return filteredData?.map((item, index) => (
      <tr key={index} className="border-t">
        <td className="p-5 text-center">{item?.employeeInfo?.employeeName}</td>
        <td className="p-5 text-center">
          {item?.revertLeave?.requestedDateTime?.split(' ')[0] || "--"}
        </td>
        <td className="p-5 text-center">
          {item?.revertLeave?.revertedDays || "--"}
        </td>
        <td className="p-5 text-center flex gap-4 justify-center">
          {item?.revertLeave?.status === "Pending" ? (
            <>
              <button
                onClick={() => dispatch(putRevertLeaveByManagerAction({ status: "Approved", id: item?._id }))}
                className="px-5 py-3 bg-green-100 text-green-600 rounded hover:bg-green-500 hover:text-white"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  dispatch(putRevertLeaveByManagerAction({ status: "Rejected", id: item?._id }))
                }}
                className="px-5 py-3 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white"
              >
                Reject
              </button>
            </>
          ) : (
            item?.revertLeave?.status
          )}
        </td>
      </tr>
    ));
  };
  const vendorMeetingTable = (data) => {
    console.log('data', data)
    // Filter data where revertLeave.revertedDays exists and is not an empty string
    const filteredData = data
    // Render rows based on the filtered data
    return filteredData?.map((item, index) => (
      <tr key={index} className="border-t">
        <td className="p-5 text-center">{item?.employeeInfo?.employeeName}</td>
        <td className="p-5 text-center">
          {item?.dateTime?.split(' ')[0] || "--"}
        </td>
        <td className="p-5 text-center">
          {item?.reason || "--"}
        </td>
        <td className="p-5 text-center">
          {item?.totalDays || "--"}
        </td>
        <td className="p-5 text-center">
          <div className="flex gap-4 justify-center">
            {item?.status === "Pending" ? (
              <>
                <button
                  onClick={() => 
                   { console.log("Approving:", item?._id)
                    dispatch(putVendorStatusDataAction({ status: "Approved", id: item?._id }))}}

                  className="px-5 py-3 bg-green-100 text-green-600 rounded hover:bg-green-500 hover:text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    dispatch(putVendorStatusDataAction({ status: "Rejected", id: item?._id }))
                  }
                  className="px-5 py-3 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white"
                >
                  Reject
                </button>
              </>
            ) : (
              item?.revertLeave?.status
            )}
          </div>
        </td>

      </tr>
    ));
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <ToastContainer />

        {/* Tabs */}
        {userDataList?.role !== "HR-Admin" ?
          <div className="p-6 flex gap-2">
            <button
              className={`p-5 rounded text-white ${activeTab === "leave" ? "bg-blue-500" : "bg-white text-blue-300 shadow"
                }`}
              style={activeTab === "leave" ? { color: 'white' } : { color: 'black' }}
              onClick={() => setActiveTab("leave")}
            >
              Leave Approvals
            </button>
            <button
              className={`p-3 rounded text-white ${activeTab === "compoff" ? "bg-blue-500" : "bg-white text-blue-300 shadow"
                }`}
              style={activeTab === "compoff" ? { color: 'white' } : { color: 'black' }}
              onClick={() => setActiveTab("compoff")}
            >
              Comp-Off Approvals
            </button>
            <button
              className={`p-3 rounded text-white ${activeTab === "revert" ? "bg-blue-500" : "bg-white text-blue-300 shadow"
                }`}
              style={activeTab === "revert" ? { color: 'white' } : { color: 'black' }}
              onClick={() => setActiveTab("revert")}
            >
              Revert Approvals
            </button>
            <button
              className={`p-3 rounded text-white ${activeTab === "vendor" ? "bg-blue-500" : "bg-white text-blue-300 shadow"
                }`}
              style={activeTab === "vendor" ? { color: 'white' } : { color: 'black' }}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor Meetings
            </button>
          </div>
          : ''}

        {/* Content */}
        <div className="p-6">
          {activeTab === "leave" ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Leave Approvals</h2>
              <div className="py-6 flex gap-4">

                {/* <form class="max-w-md mx-auto"> */}
                <div class="relative w-full grow">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="search"
                    id="default-search"
                    class="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="Search by Employee Name" />
                  {/* <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
                </div>
                {/* </form> */}

                {/* <input
                  type="text"
                  placeholder="Search by Employee Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block min-w-0 grow py-2 px-3 bg-blue-100 rounded text-base text-black placeholder:text-gray-400 focus:outline focus:border-black sm:text-sm/6" /> */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                      <th className="p-3 font-semibold text-center">Doc</th>
                      <th className="p-3 font-semibold text-center">Remarks</th>
                      <th className="p-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>{loading ? <SkeletonLoader /> : renderTableRows(currentData)}</tbody>
                </table>
              </div>
            </>
          ) : activeTab === "revert" ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Revert Approvals</h2>
              <div className="overflow-auto bg-white rounded-lg shadow-md">
                <table className="table-auto w-full text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 font-semibold text-center">Employee Name</th>
                      <th className="p-3 font-semibold text-center">Request Date</th>
                      <th className="p-3 font-semibold text-center">Total Days</th>
                      <th className="p-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>{loading ? <SkeletonLoader /> : renderRevertTableRow(currentData)}</tbody>
                </table>
              </div>
            </>
          ) : activeTab === "vendor" ? (<>
            <h2 className="text-2xl font-bold mb-4">Vendor Meetings</h2>
            <div className="overflow-auto bg-white rounded-lg shadow-md">
              <table className="table-auto w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 font-semibold text-center">Employee Name</th>
                    <th className="p-3 font-semibold text-center">Request Date</th>
                    <th className="p-3 font-semibold text-center">Reason</th>
                    <th className="p-3 font-semibold text-center">Total Days</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>{loading ? <SkeletonLoader /> : vendorMeetingTable(currentData, true)}</tbody>
              </table>
            </div>
          </>) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Comp-Off Approvals</h2>
              <div className="overflow-auto bg-white rounded-lg shadow-md">
                <table className="table-auto w-full text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 font-semibold text-center">Employee Name</th>
                      <th className="p-3 font-semibold text-center">Request Date</th>
                      <th className="p-3 font-semibold text-center">Reason</th>
                      <th className="p-3 font-semibold text-center">Total Days</th>
                      <th className="p-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>{loading ? <SkeletonLoader /> : renderTableRows(currentData, true)}</tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {activeTab === "leave" ?
          totalPages > 1 && (
            <div className="flex justify-end items-center mt-4 space-x-4">
              {currentPage === 1 ? '' :
                <button
                  className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              }
              {currentPage === totalPages ? "" :
                <button
                  className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              }
            </div>
          ) : ''}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reject Leave</h3>
                <button onClick={closeModal} className="text-xl"><RxCross2 /></button>
              </div>
              <textarea
                rows="4"
                placeholder="Please provide a reason for rejection."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border rounded-md"
              ></textarea>
              <div className="flex gap-4 mt-4">
                <button onClick={handleSubmitRejection} className="px-5 py-3 bg-red-500 text-white rounded">
                  Submit
                </button>
                <button onClick={closeModal} className="px-5 py-3 bg-gray-300 rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManagerApproval;
