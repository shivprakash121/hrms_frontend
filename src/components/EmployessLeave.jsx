import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLeaveRequestAction, getCompoffDataAction, getEmployeLeaveStatusAction, getUserDataAction } from "../store/action/userDataAction";
import AddEmployee from "./AddEmployee";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from 'react-toastify';

const EmployessLeave = () => {
    const employeeId = localStorage.getItem('employeId');
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.employeeLeaveStatus);
    const { data: dataa1, } = useSelector((state) => state.compoffData);
    const { data: dataa } = useSelector((state) => state.deleteLeaveByEmoployee);
    const {data:data1,message,error}=useSelector((state)=>state.leaveApproveByManager)
    const leaveData = data?.data;
    console.log('dataa1', data1, error,message)
    // State for managing the selected filter status
    const [filterStatus, setFilterStatus] = useState('All'); // Default is 'All'

    
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

    // Function to filter leave data based on the selected status
    const filteredLeaveData = leaveData?.filter(leave => {
        if (filterStatus === 'All') return true;
        return leave.status === filterStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <AddEmployee tittleBtn="+ Create Leave Request" />

                {/* Filter Dropdown */}
                <div className="flex items-center">
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
                            <th className="px-6 py-6 text-start">Attachment</th>
                            <th className="px-6 py-6 text-start">Remarks</th>
                            <th className="px-6 py-6 text-start">Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataa1?.data?.map((item, index1) => {
                            return (
                                <tr
                                    key={index1}
                                    className={`border-b ${index1 % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <td className="px-6 py-6 text-black text-start flex items-center gap-2">
                                        {item?.employeeInfo?.employeeName}
                                    </td>
                                    <td className="px-6 py-6 text-black text-start">{item?.employeeInfo?.designation}</td>
                                    <td className="px-6 py-6 text-black text-start">{item.compOffDate}</td>
                                    <td className="px-6 py-6 text-black text-start">{item.compOffDate}</td>
                                    <td className="px-6 py-6 text-black text-start">0{item.totalDays}</td>
                                    <td className="px-6 py-6 text-black text-start">
                                        <span
                                            className={`px-3 py-1 rounded-full text-black text-sm font-medium ${getLeaveTypeStyle(
                                                item.leaveType
                                            )}`}
                                        >
                                            COMP-OFF
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-black text-start">
                                        {item.leaveType === "medicalLeave" ?
                                            <Link to={item?.location} className="px-2 py-2 bg-blue-600 text-black text-white rounded">
                                                View File
                                            </Link>
                                            :
                                            '--'
                                        }
                                    </td>
                                    <td className="px-6 py-6 text-black text-start">{item?.remarks}</td>
                                    <td className="px-6 py-6 text-black text-start">
                                        <span style={item.status === 'Pending' ? { backgroundColor: '#FFFDD0', color: '#FFBF00', padding: '8px', borderRadius: '8px' } : item.status === 'Approved' ? { padding: '8px', borderRadius: '8px', backgroundColor: '#DBFDD2', color: '#325328' } : { backgroundColor: '#FFD6D7', color: '#C6373C', padding: '8px', borderRadius: '8px' }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {item.status === 'Pending' ?
                                            <button className="px-2 py-2 bg-blue-600 text-black text-white rounded" onClick={() => { dispatch(deleteLeaveRequestAction({ id: item?._id })) }}>Delete</button>
                                            : '--'}
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredLeaveData?.map((leave, index) => (
                            <tr
                                key={index}
                                className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <td className="px-6 py-6 text-black text-start flex items-center gap-2">
                                    {leave?.employeeInfo?.employeeName}
                                </td>
                                <td className="px-6 py-6 text-black text-start">{leave?.employeeInfo?.designation}</td>
                                <td className="px-6 py-6 text-black text-start">{leave.leaveStartDate}</td>
                                <td className="px-6 py-6 text-black text-start">{leave.leaveEndDate}</td>
                                <td className="px-6 py-6 text-black text-start">0{leave.totalDays}</td>
                                <td className="px-6 py-6 text-black text-start">
                                    <span
                                        className={`px-3 py-1 rounded-full text-black text-sm font-medium ${getLeaveTypeStyle(
                                            leave.leaveType
                                        )}`}
                                    >
                                        {leave?.leaveType?.toUpperCase().split('LEAVE')[0]} LEAVE
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-black text-start">
                                    {leave.leaveType === "medicalLeave" ?
                                        <Link to={leave?.location} className="px-2 py-2 bg-blue-600 text-black text-white rounded">
                                            View File
                                        </Link>
                                        :
                                        '--'
                                    }
                                </td>
                                <td className="px-6 py-6 text-black text-start">{leave?.remarks}</td>
                                <td className="px-6 py-6 text-black text-start">
                                    <span style={leave.status === 'Pending' ? { backgroundColor: '#FFFDD0', color: '#FFBF00', padding: '8px', borderRadius: '8px' } : leave.status === 'Approved' ? { padding: '8px', borderRadius: '8px', backgroundColor: '#DBFDD2', color: '#325328' } : { backgroundColor: '#FFD6D7', color: '#C6373C', padding: '8px', borderRadius: '8px' }}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td>
                                    {leave.status === 'Pending' ?
                                        <button className="px-2 py-2 bg-blue-600 text-black text-white rounded" onClick={() => { dispatch(deleteLeaveRequestAction({ id: leave?._id })) }}>Delete</button>
                                        : '--'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">Rows per page: 10</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                        1
                    </button>
                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                        2
                    </button>
                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                        3
                    </button>
                </div>
                <div className="text-sm text-gray-600">1-10 of 120</div>
            </div> */}
        </div>
    );
};

export default EmployessLeave;
