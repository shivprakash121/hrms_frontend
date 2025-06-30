import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLeaveRequestAction, getCompoffDataAction, getEmployeLeaveStatusAction, getUserDataAction, getVendorSingleLogsAction, postrevertLeaveRequest } from "../store/action/userDataAction";
import AddEmployee from "./AddEmployee";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";

const EmployessLeave = () => {
    const employeeId = localStorage.getItem('employeId');
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.employeeLeaveStatus);
    const { data: dataa1 } = useSelector((state) => state.compoffData);
    const { data: vendorData } = useSelector((state) => state.singleVendorLogsData);
console.log('vendorData',vendorData)
    const { data: dataa } = useSelector((state) => state.deleteLeaveByEmoployee);
    const [selectDays, setLeaveDays] = useState('');
    const leaveData = data?.data;
    const [filterStatus, setFilterStatus] = useState('All'); // Default is 'All'
    const [selectedTab, setSelectedTab] = useState('leave'); // Track the selected tab
    const [currentPage, setCurrentPage] = useState(1); // Start on page 1
    const [itemsPerPage, setItemsPerPage] = useState(15); // You can set this to whatever number of items you want to show per page

    const filteredLeaveData = leaveData?.filter(leave => {
        if (filterStatus === 'All') return true;
        return leave.status === filterStatus;
    });
    const filteredCompoffData = dataa1?.data?.filter(leave => {
        if (filterStatus === 'All') return true;
        return leave.status === filterStatus;
    });

    const filterVendorData=vendorData?.data;

    // Get current data slice based on the page
    const currentLeaveData = filteredLeaveData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const currentCompoffData = filteredCompoffData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // const currentVendorData = filterVendorData?.slice(
    //     (currentPage - 1) * itemsPerPage,
    //     currentPage * itemsPerPage
    // );

    const totalPages = Math.ceil(filteredLeaveData?.length / itemsPerPage); // Total pages
    const [openUndoModel, setOpenUndoModel] = useState(false);
    const [userId, setUserId] = useState('');

    const closeModal = () => setOpenUndoModel(false);
    const handelOpenModel = () => setOpenUndoModel(true);

    useEffect(() => {
        if (dataa) {
            toast.success(dataa?.message, {
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
            return;
        }
    }, [dataa]);

    useEffect(() => {
        dispatch(getEmployeLeaveStatusAction(employeeId));
        dispatch(getCompoffDataAction());
        dispatch(getVendorSingleLogsAction());
        dispatch(getUserDataAction());
    }, [dispatch, employeeId]);

    const getLeaveTypeStyle = (type) => {
        switch (type) {
            case "Annual":
                return "bg-green-100 text-green-700";
            case "Unpaid":
                return "bg-red-100 text-red-700";
            case "Medical":
                return "bg-blue-100 text-blue-700";
            case "Emergency":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Function to render Leave Status table
    const renderLeaveTable = (leaveData) => {
        return leaveData?.map((leave, index) => (
            <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-4 py-4 text-black text-start flex items-center gap-2">{leave?.employeeInfo?.employeeName}</td>
                <td className="px-4 py-4 text-black text-start">{leave?.employeeInfo?.designation}</td>
                <td className="px-4 py-4 text-black text-start">{leave.leaveStartDate}</td>
                <td className="px-4 py-4 text-black text-start">{leave.leaveEndDate}</td>
                <td className="px-4 py-4 text-black text-start">{leave.totalDays}</td>
                <td className="px-4 py-4 text-black text-start">
                    <span className={`px-3 py-1 rounded-full text-black text-sm font-medium ${getLeaveTypeStyle(leave.leaveType)}`}>
                        {leave?.leaveType?.toUpperCase().split('LEAVE')[0]} LEAVE
                    </span>
                </td>
                <td className="px-4 py-4 text-black text-start">
                    {leave.leaveType === "medicalLeave" ?
                        <Link to={leave?.location} className="px-2 py-2 bg-blue-600 text-black text-white rounded">
                            View File
                        </Link>
                        : '--'
                    }
                </td>
                <td className="px-4 py-4 text-black text-start">{leave?.reason}</td>
                <td className="px-4 py-4 text-black text-start">{leave?.remarks || "---"}</td>
                <td className="px-4 py-4 text-black text-start">
                    <span style={leave.status === 'Pending' ? { backgroundColor: '#FFFDD0', color: '#FFBF00', padding: '8px', borderRadius: '8px' } : leave.status === 'Approved' ? { padding: '8px', borderRadius: '8px', backgroundColor: '#DBFDD2', color: '#325328' } : { backgroundColor: '#FFD6D7', color: '#C6373C', padding: '8px', borderRadius: '8px' }}>
                        {leave.status}
                    </span>
                </td>
                <td className="px-4 py-4 text-black text-start">
                    {leave.status === 'Pending' ? (
                        <button
                            className="px-2 py-2 bg-red-600 text-black text-white rounded"
                            onClick={() => dispatch(deleteLeaveRequestAction({ id: leave?._id }))}
                        >
                            Delete
                        </button>
                    ) : leave.status === 'Approved' ? (
                        leave?.leaveType === 'uninformedLeave' ||
                            leave?.leaveType === 'optionalLeave' ||
                            leave?.leaveType === 'shortLeave' ? (
                            "- -"
                        ) : leave?.revertLeave?.requestedDateTime === "" ? (
                            <button
                                className="px-2 w-20 py-2 bg-blue-600 text-black text-white rounded"
                                onClick={() => {
                                    setOpenUndoModel(true);
                                    setUserId(leave?._id);
                                }}
                                style={{ backgroundColor: '#305cde' }}
                            >
                                UNDO
                            </button>
                        ) : (
                            <button
                                className="px-2 w-20 py-2 bg-blue-600 text-black text-white rounded"
                                onClick={() => {
                                    setOpenUndoModel(true);
                                    setUserId(leave?._id);
                                }}
                                style={
                                    leave.revertLeave.status === 'Pending'
                                        ? { backgroundColor: '#ffbf00', cursor: 'not-allowed' }
                                        : leave.revertLeave.status === 'Rejected'
                                            ? { backgroundColor: '#d0312d', cursor: 'not-allowed' }
                                            : { backgroundColor: 'green', cursor: 'not-allowed' }
                                }
                            >
                                {leave.revertLeave.status === 'Pending' ? 'Pending' : leave.revertLeave.status === 'Rejected' ? 'Rejected' : 'Approved'}
                            </button>
                        )
                    ) : null}
                </td>

            </tr>
        ));
    };

    // Function to render Compoff Status table
    const renderCompoffTable = (compoffData) => {
        return compoffData?.map((item, index1) => (
            <tr key={index1} className={`border-b ${index1 % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-6 py-6 text-black text-start flex items-center gap-2">
                    {item?.employeeInfo?.employeeName}
                </td>
                <td className="px-6 py-6 text-black text-start">{item?.employeeInfo?.designation || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.compOffDate || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.compOffDate || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.totalDays}</td>
                <td className="px-6 py-6 text-black text-start">
                    <span className={`px-3 py-1 rounded-full text-black text-sm font-medium ${getLeaveTypeStyle(item.leaveType)}`}>
                        COMP-OFF
                    </span>
                </td>
                <td className="px-6 py-6 text-black text-start">{item?.reason}</td>
                <td className="px-6 py-6 text-black text-start">{item?.status}</td>
                <td className="px-6 py-6 text-black text-start">{item?.comments}</td>
            </tr>
        ));
    };

    const renderVendorTable = (filterVendorData) => {
        return filterVendorData?.map((item, index1) => (
            <tr key={index1} className={`border-b ${index1 % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-6 py-6 text-black text-start flex items-center gap-2">
                    {item?.employeeInfo?.employeeName}
                </td>
                <td className="px-6 py-6 text-black text-start">{item?.employeeInfo?.contactNo || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.dateTime?.split(' ')[0] || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.dateTime?.split(' ')[0] || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item.totalDays}</td>
                <td className="px-6 py-6 text-black text-start">
                    <span className={`px-3 py-1 rounded-full text-black text-sm font-medium ${getLeaveTypeStyle(item.leaveType)}`}>
                        {item?.leaveType.toUpperCase()}
                    </span>
                </td>
                <td className="px-6 py-6 text-black text-start">---</td>
                <td className="px-6 py-6 text-black text-start">{item?.reason}</td>
                <td className="px-6 py-6 text-black text-start">{item?.remarks || '---'}</td>
                <td className="px-6 py-6 text-black text-start">{item?.status}</td>
                <td className="px-6 py-6 text-black text-start">---</td>
            </tr>
        ));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <AddEmployee tittleBtn="+ Create Leave Request" />
            </div>

            {/* Buttons for Leave Status and Compoff Status */}
            <div className="flex gap-6 mb-4">
                <button
                    onClick={() => setSelectedTab('leave')}
                    className="py-4 text-center text-gray-800 rounded"
                >
                    <div className="p-6 bg-white rounded-lg shadow-lg flex items-center justify-between w-80 h-32 transition-transform transform hover:scale-105 cursor-pointer">
                        <h2 className="text-2xl font-bold">Leave Status</h2>
                    </div>
                </button>
                <button
                    onClick={() => setSelectedTab('compoff')}
                    className="p-4 text-center text-white rounded"
                >
                    <div className="p-6 bg-black rounded-lg shadow-lg flex items-center justify-between w-80 h-32 transition-transform transform hover:scale-105 cursor-pointer">
                        <h2 className="text-2xl font-bold"> Compoff Status</h2>
                    </div>
                </button>
                <button
                    onClick={() => setSelectedTab('vendor')}
                    className="p-4 text-center text-white rounded"
                >
                    <div className="p-6 bg-blue-500 rounded-lg shadow-lg flex items-center justify-between w-80 h-32 transition-transform transform hover:scale-105 cursor-pointer">
                        <h2 className="text-2xl font-bold">Vendor Status</h2>
                    </div>
                </button>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center mb-6">
                <label htmlFor="leaveStatusFilter" className="mr-2 text-gray-700">Filter by Status:</label>
                <select
                    id="leaveStatusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-6 text-start">Name</th>
                            <th className="px-6 py-6 text-start">Position</th>
                            <th className="px-6 py-6 text-start">Start Date</th>
                            <th className="px-6 py-6 text-start">End Date</th>
                            <th className="px-6 py-6 text-start">Total Days</th>
                            <th className="px-6 py-6 text-start">Leave Type</th>
                            {selectedTab === "compoff" ? "" :
                                <>
                                    <th className="px-6 py-6 text-start">Attachment</th>
                                    <th className="px-6 py-6 text-start">Reason For rejection</th>
                                </>
                            }
                            <th className="px-6 py-6 text-start">Remarks</th>
                            <th className="px-6 py-6 text-start">Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTab === 'leave' ? renderLeaveTable(currentLeaveData) :selectedTab ==="compoff"? renderCompoffTable(currentCompoffData):renderVendorTable(filterVendorData)}
                    </tbody>

                </table>
            </div>

            {openUndoModel &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative z-10 p-6">
                        <button onClick={closeModal} className="absolute top-10 right-4 text-gray-400 hover:text-gray-600">
                            <RxCross2 size={20} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">Revert leave</h2>
                        <div className="flex flex-col gap-4 mt-4">
                            <input
                                type="number"
                                id="days"
                                name="days"
                                placeholder="How many days?"
                                value={selectDays}
                                onChange={(e) => setLeaveDays(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => {
                                    const id = userId;
                                    const revertedDays = selectDays;
                                    dispatch(postrevertLeaveRequest(revertedDays, id));
                                }}
                                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Revert Leave
                            </button>
                        </div>
                    </div>
                </div>
            }

            <div className="flex justify-end mt-4">
                {currentPage === 1 ? "" :
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="px-8 py-2 text-white bg-blue-600 rounded-lg ml-2"
                    >
                        Previous
                    </button>
                }
                {currentPage === totalPages ? "" :
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="px-8 py-2 text-white bg-blue-600 rounded-lg ml-2"
                    >
                        Next
                    </button>
                }
            </div>

        </div>
    );
};

export default EmployessLeave;