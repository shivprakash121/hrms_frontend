import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { getGraphDataForEmployeeAction } from '../store/action/userDataAction';
function EmployeeGraphData() {
    const { data } = useSelector((state) => state.employeeGraphDataCount);
    console.log('1231231', data)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGraphDataForEmployeeAction());
    }, [])

    const barData = data?.data.map(item => ({
        month: item.duration,
        presentCount: item.presentCount,
        absentCount: item.absentCount,
        freeCashFlow: item.presentCount + item.absentCount, // or any other metric
    }));

    const pieData = [
        { name: "Salary", value: 15, color: "#f43f5e" },
        { name: "Bonus", value: 8, color: "#10b981" },
        { name: "Commission", value: 20, color: "#3b82f6" },
        { name: "Overtime", value: 11, color: "#f97316" },
        { name: "Reimbursement", value: 28, color: "#6366f1" },
        // { name: "Benefits", value: 18, color: "#facc15" },vfcv fc  cfvv
    ];



    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-6">
            <div className="col-span-2 bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Employee Structure</h3>
                    {/* <button className="text-sm text-blue-600 hover:underline">Download Report</button> */}
                </div>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        {/* <Tooltip content={<CustomTooltip />} /> */}
                        <Legend
                            verticalAlign="top"
                            iconType="circle"
                            wrapperStyle={{ color: '#374151', fontSize: 13 }}
                        />
                        <Bar dataKey="month" fill="#3b82f6" name="Duration" radius={[0, 0, 0, 0]} barSize={0} />
                        <Bar dataKey="presentCount" fill="#f97316" name="Present Count" radius={[5, 5, 0, 0]} barSize={30} />
                        <Bar dataKey="absentCount" fill="#06b6d4" name="Absent Count" radius={[5, 5, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Company Pay</h3>
                    {/* <select className="border text-sm rounded px-2 py-1">
                        <option>2024</option>
                        <option>2023</option>
                    </select> */}
                </div>
                <div className="flex items-center justify-center mt-4">
                    <PieChart width={200} height={200}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
                <div className="text-center -mt-24 font-bold text-2xl text-gray-700">1,206</div>
                <div className="text-center text-sm text-gray-500 mb-4">Salary</div>
                <div className="space-y-2 text-sm">
                    {pieData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                            <span className="text-gray-600">
                                {item.value}% {item.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-1">2024 Download Report</p>
                    <p className="text-xs text-gray-500 mb-3">Company Trends and Insights</p>
                    <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
                        <i className="ri-download-line mr-1"></i> Download Report
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeGraphData