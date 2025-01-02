import React, { useState } from "react";

const EmployeePayroleTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const employees = [
    { name: "Leasie Watson", ctc: 45000, salary: 3500, deduction: "-", status: "Completed" },
    { name: "Darlene Robertson", ctc: 78000, salary: 6400, deduction: 100, status: "Completed" },
    { name: "Jacob Jones", ctc: 60000, salary: 5000, deduction: 250, status: "Completed" },
    { name: "Kathryn Murphy", ctc: 34000, salary: 2800, deduction: "-", status: "Pending" },
    { name: "Leslie Alexander", ctc: 40000, salary: 3400, deduction: "-", status: "Pending" },
    { name: "Ronald Richards", ctc: 45000, salary: 3500, deduction: "-", status: "Completed" },
    { name: "Guy Hawkins", ctc: 55000, salary: 4000, deduction: 50, status: "Pending" },
    { name: "Albert Flores", ctc: 60000, salary: 5000, deduction: 150, status: "Completed" },
    { name: "Savannah Nguyen", ctc: 25000, salary: 2200, deduction: "-", status: "Pending" },
    { name: "Marvin McKinney", ctc: 30000, salary: 2700, deduction: "-", status: "Completed" },
    { name: "Jerome Bell", ctc: 78000, salary: 6400, deduction: "-", status: "Completed" },
    { name: "Jenny Wilson", ctc: 45000, salary: 3500, deduction: 100, status: "Pending" },
  ];

  // Filter employees based on the search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Export */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          <span className="mr-2">📤</span> Export
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-600 font-medium">Employee Name</th>
            <th className="py-2 px-4 text-left text-gray-600 font-medium">CTC</th>
            <th className="py-2 px-4 text-left text-gray-600 font-medium">Salary Per Month</th>
            <th className="py-2 px-4 text-left text-gray-600 font-medium">Deduction</th>
            <th className="py-2 px-4 text-left text-gray-600 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((employee, index) => (
            <tr key={index} className="border-t hover:bg-gray-100">
              <td className="py-4 px-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                {employee.name}
              </td>
              <td className="py-4 px-4">${employee.ctc}</td>
              <td className="py-4 px-4">${employee.salary}</td>
              <td className="py-4 px-4">{employee.deduction === "-" ? "-" : `$${employee.deduction}`}</td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    employee.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredEmployees.length)} of{" "}
          {filteredEmployees.length} records
        </div>
        <div className="flex gap-2">
          {[...Array(Math.ceil(filteredEmployees.length / rowsPerPage)).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === page + 1 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeePayroleTable;
