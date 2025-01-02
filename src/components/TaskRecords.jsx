import React from "react";
import { FaRegClock, FaRegClipboard } from "react-icons/fa";
import "../../src/style/taskRecords.css"
const TaskRecords = () => {
  const employees = [
    {
      name: "Bagus Fikri",
      id: "39486846",
      clockIn: "10:02 AM",
      duration: "8h 58m",
      clockOut: "07:00 PM",
      overtime: "2h 12m",
    },
    {
      name: "Ihdizein",
      id: "34534543",
      clockIn: "09:30 AM",
      duration: "8h 18m",
      clockOut: "07:12 PM",
      overtime: "-",
    },
    {
      name: "Mufti Hidayat",
      id: "827473837",
      clockIn: "09:24 AM",
      duration: "7h 36m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
    {
      name: "Fauzan Ardiansyah",
      id: "39486846",
      clockIn: "08:56 AM",
      duration: "10h 12m",
      clockOut: "05:01 PM",
      overtime: "-",
    },
    {
      name: "Raihan Fikri",
      id: "92884744",
      clockIn: "08:56 AM",
      duration: "10h 12m",
      clockOut: "07:00 PM",
      overtime: "-",
    },
    {
      name: "Ifan",
      id: "90029388",
      clockIn: "10:02 AM",
      duration: "10h 12m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
    {
      name: "Panji Dwi",
      id: "173584473",
      clockIn: "08:56 AM",
      duration: "10h 12m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
    {
      name: "Laokta Roymarley",
      id: "39486846",
      clockIn: "08:56 AM",
      duration: "8h 18m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
    {
      name: "Bryan",
      id: "927469748",
      clockIn: "08:56 AM",
      duration: "8h 18m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
    {
      name: "Ardhi",
      id: "972368422",
      clockIn: "08:56 AM",
      duration: "8h 18m",
      clockOut: "05:00 PM",
      overtime: "-",
    },
  ];

  return (
    <div className="p-6">
      <table className="w-full border-collapse bg-white rounded-lg shadow-lg text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left font-semibold">
              Employee Name <FaRegClipboard className="inline-block ml-2" />
            </th>
            <th className="p-3 text-left font-semibold">
              Clock-in & Out <FaRegClock className="inline-block ml-2" />
            </th>
            <th className="p-3 text-left font-semibold">Overtime</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-8 w-8"></div>
                  <div>
                    <div className="font-bold">{employee.name}</div>
                    <div className="text-gray-500 text-xs">{employee.id}</div>
                  </div>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-red-600">{employee.clockIn}</div>
                  <div className="text-gray-500 text-sm">{employee.duration}</div>
                  <div className="text-orange-600">{employee.clockOut}</div>
                </div>
              </td>
              <td className="p-3">{employee.overtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskRecords;
