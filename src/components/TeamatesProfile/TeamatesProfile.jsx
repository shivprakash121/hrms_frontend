import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeammateDataAction, getUserDataAction } from "../../store/action/userDataAction";
import SingleTeamatesProfile from './SingleTeamatesProfile'
import { useNavigate } from "react-router-dom";

const TeammatesProfile = () => {
  const { data } = useSelector((state) => state.teammateData);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [employeeTicket, setEmployeeTicket] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const teammateData = data?.data;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeammateDataAction());
    dispatch(getUserDataAction());
  }, [dispatch]);

  const navigate = useNavigate();

  // Filter teammates based on the search query
  const filteredTeammates = teammateData?.filter(teammate =>
    teammate.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (`AgVa-${teammate.employeeId}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
    teammate.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {selectedComponent === "employee" && (
        <SingleTeamatesProfile
          onBack={() => setSelectedComponent(null)}
          employeeTicket={employeeTicket}
          employeeName={teammateData.find(teammate => teammate.employeeId === employeeTicket)?.employeeName}
        />
      )}

      {!selectedComponent && (
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Teammate's</h1>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeammates?.map((teammate, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="p-4">AgVa-{teammate.employeeId}</td>
                    <td className="p-4 font-medium">{teammate.employeeName}</td>
                    <td className="p-4">{teammate.designation}</td>
                    <td className="p-4">{teammate.shiftTime?.startAt}</td>
                    <td className="p-4">{teammate.shiftTime?.endAt}</td>
                    <td className="p-4">{teammate.contactNo}</td>
                    <td className="p-4">{teammate.doj}</td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedComponent("employee");
                          setEmployeeTicket(teammate.employeeId);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTeammates?.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeammatesProfile;
