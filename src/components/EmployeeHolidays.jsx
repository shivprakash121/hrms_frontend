import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHolidaysDataAction } from "../store/action/userDataAction";

const EmployeeHolidays = () => {
  const { loading, data, error } = useSelector((state) => state.holidaysData);
  const holidaysData = data?.data || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHolidaysDataAction());
  }, [dispatch]);

  const NoDataCard = () => (
    <div className="flex justify-center items-center p-6 bg-gray-50 rounded-lg shadow-lg">
      <p className="text-gray-500 text-lg font-semibold">No Holidays Found</p>
    </div>
  );

  const SkeletonLoader = () => (
    <tbody>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <tr key={index} className={`animate-pulse ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
            <td className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </td>
            <td className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </td>
            <td className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </td>
          </tr>
        ))}
    </tbody>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 100 10A5 5 0 008 3zM1.293 8.707a7 7 0 1110.414 0 7 7 0 01-10.414 0z"
              clipRule="evenodd"
            />
            <path d="M12.707 13.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414-1.414l-4-4z" />
          </svg>
        </div>

        {/* Add New Holiday Button */}
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
          <span className="mr-2 text-lg">+</span> Add New Holiday
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-left text-sm text-gray-700">
          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Day</th>
              <th className="px-6 py-3">Holiday Name</th>
            </tr>
          </thead>
          {/* Table Body */}
          {loading ? (
            <SkeletonLoader />
          ) : holidaysData.length > 0 ? (
            <tbody>
              {holidaysData.map((holiday, index) => {
                const holidayDate = new Date(holiday.holidayDate);
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const dayName = days[holidayDate.getDay()]; // Get the day of the week
                return (
                  <tr
                    key={index}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-3 text-gray-700">{holiday.holidayDate}</td>
                    <td className="px-6 py-3 text-gray-700">{dayName}</td>
                    <td className="px-6 py-3 text-gray-700">{holiday.holidayName}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="3">
                  <NoDataCard />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span> Upcoming
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span> Past Holidays
        </div>
      </div>
    </div>
  );
};

export default EmployeeHolidays;
