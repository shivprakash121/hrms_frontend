import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserDataAction } from "../store/action/userDataAction";
import SingleEmployeProfile from "./SingleEmployeProfile";

const EmployeeTable = () => {
    const [profileview, setProfileView] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1); // Current page
    const [limit, setLimit] = useState(10); // Records per page

    const { loading, data, error: msg } = useSelector((state) => state.allUserData);
    const allEmployeeData = data?.data || [];
    const totalRecords = data?.total || 0; // Total number of records

    const dispatch = useDispatch();

    // Fetch employee data when page or limit changes
    useEffect(() => {
        dispatch(getAllUserDataAction(page, limit));
    }, [dispatch, page, limit]);

    const handlePagination = (newPage) => {
        if (newPage < 1 || newPage > Math.ceil(totalRecords / limit)) return;
        setPage(newPage);
        console.log('newPage', newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1); // Reset to page 1 when limit is changed
    };

    const filteredEmployeeData = allEmployeeData.filter((employee) =>
        employee.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        employee?.employeeCode?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(totalRecords / limit);

    return (
        <>
            {profileview === "profileViewData" && (
                <SingleEmployeProfile onBack={() => setProfileView(null)} />
            )}
            {!profileview && (
                <div className="p-6 bg-gray-50 min-h-screen">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-1/3 p-2 border rounded shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex space-x-2">
                            <button className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600">
                                + Add New Employee
                            </button>
                            <button className="bg-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300">
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-md rounded overflow-hidden">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-6 text-left font-semibold">Employee Id</th>
                                    <th className="p-6 text-left font-semibold">Employee Name</th>
                                    <th className="p-6 text-left font-semibold">Role</th>
                                    <th className="p-6 text-left font-semibold">Department</th>
                                    <th className="p-6 text-left font-semibold">Status</th>
                                    <th className="p-6 text-left font-semibold">Email</th>
                                    <th className="p-6 text-left font-semibold">Contact</th>
                                    <th className="p-6 text-left font-semibold">Shift Time</th>
                                    <th className="p-6 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployeeData
                                    .slice((page - 1) * limit, page * limit) // Slice data based on current page and limit
                                    .map((employee) => (
                                        <tr key={employee.id} className="border-t">
                                            <td className="p-6 text-left">{employee.employeeId}</td>
                                            <td className="p-6 text-left flex items-center space-x-3">
                                            {employee.employeeName}
                                            </td>
                                            <td className="p-6 text-left">{employee.designation}</td>
                                            <td className="p-6 text-left">{employee.role}</td>
                                            <td className="p-6 text-left">{employee.accountStatus}</td>
                                            <td className="p-6 text-left">
                                            {employee.email}
                                            </td>
                                            <td className="p-6 text-left">
                                            {employee.contactNo}
                                            </td>
                                            <td className="p-6 text-left">{employee?.shiftTime?.startAt.split(' ')[0]} - {employee?.shiftTime?.endAt.split(' ')[0]}</td>
                                            <td className="p-6 text-left flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:underline"
                                                    onClick={() => setProfileView("profileViewData")}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <span>Showing</span>
                            <select
                                value={limit}
                                onChange={handleLimitChange}
                                className="p-2 border rounded shadow-sm"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span>out of {totalRecords} records</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePagination(page - 1)}
                                className="px-2 py-1 border rounded hover:bg-gray-200"
                                disabled={page === 1}
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => handlePagination(page - 1)}
                                className={`px-3 py-1 border rounded ${page === 1 ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                disabled={page === 1}
                            >
                                {page - 1}
                            </button>
                            <button className="px-3 py-1 border rounded bg-gray-200">
                                {page}
                            </button>
                            <button
                                onClick={() => handlePagination(page + 1)}
                                className={`px-3 py-1 border rounded ${page === totalPages ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                disabled={page === totalPages}
                            >
                                {page + 1}
                            </button>
                            <button
                                onClick={() => handlePagination(page + 1)}
                                className="px-2 py-1 border rounded hover:bg-gray-200"
                                disabled={page === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeeTable;
