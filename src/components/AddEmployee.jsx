import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postApplyLeaveByEmployee, postMedicalFileAction } from "../store/action/userDataAction";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
const CreateProjectModal = ({ tittleBtn, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useSelector((state) => state.userData);
    const { loading: uploadLoading, data: medicalReport } = useSelector((state) => state.medicalFileReducer);
    const navigate = useNavigate();
    const { data: dataa, error } = useSelector((state) => state.leaveApplyByEmployee)

    useEffect(() => {
        toast.dismiss()
    }, [toast])

    useEffect(() => {
        if (error) {
            toast.error(error, {
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
    }, [error])
    useEffect(() => {
        toast.dismiss()
    }, [])
    useEffect(() => {
        if (error === "jwt expired") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("employeId");
            localStorage.removeItem("selectedTag");
            navigate("/");
            return;
        }
    }, [error])
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
        setIsOpen(false)
    }, [dataa])

    useEffect(() => {
        if (medicalReport && medicalReport.location) {  // ✅ Ensure medicalReport is defined
            toast.success('File Upload Successfully', {
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
        setIsOpen(false);
    }, [medicalReport]);

    const managerId = data?.data?.managerId;
    const employeeType = data?.data?.employmentType;
    const employeeId = localStorage.getItem('employeId');
    const leaveBalance = data?.data?.leaveBalance;
    console.log('leaveBalance', leaveBalance)
    const [leaveTypeError, setLeaveTypeError] = useState(null);
    const [totalDayError, setTotalDayError] = useState(null);
    const [reasonError, setReasonError] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [leaveError, setLeaveError] = useState({
        medical: null,
        casual: null,
        earned: null,
    })

    const [leaveData, setLeaveData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        selectTime: '',
        reason: "",
        totalDays: 0, // New field for total days
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);
    const handelChangeFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileError('')
        }
    };

    useEffect(() => {
        const startDate = new Date(leaveData.startDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1); // Yesterday

        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30); // 30 days ago

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const minEarnedLeaveDate = new Date(currentDate);
        minEarnedLeaveDate.setDate(currentDate.getDate() - 14); // 14 days before today

        const maxEarnedLeaveDate = new Date(currentDate);
        maxEarnedLeaveDate.setDate(currentDate.getDate() + 31); // 31 days after today

        if (leaveData?.leaveType === '' || leaveData?.startDate === '') {
            setLeaveError((prevErrors) => ({
                ...prevErrors,
                medical: '', // Update the `medical` field
            }));
            return;
        }


        if (leaveData?.leaveType === '' || leaveData?.startDate === '') {
            setLeaveError((prevErrors) => ({
                ...prevErrors,
                medical: '', // Update the `medical` field
            }));
            return;
        }

        switch (leaveData.leaveType) {
            case "casualLeave":
                if (leaveData.selectTime === 'firstHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 })
                    return;
                }
                if (leaveData.selectTime === 'secondHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 })
                    return;
                }
                if (leaveData.selectTime === 'fullDay') {
                    setLeaveData({ ...leaveData, totalDays: 1 })
                    return;
                }
                const currentMonth = currentDate.getMonth();
                if (startDate.getMonth() !== currentMonth) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        casual: 'Casual leave can only be applied in the current month.', // Update the `casual` field
                    }));
                    return
                }
                const sevenDaysFromNow = new Date(currentDate);
                sevenDaysFromNow.setDate(currentDate.getDate() + 7);
                if (startDate < currentDate || startDate > sevenDaysFromNow) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        casual: 'Casual leave can only be applied for dates between today and the next 7 days.', // Update the `casual` field
                    }));
                    return
                }
                // Clear errors if validation passes
                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    casual: '', // Update the `casual` field
                }));
                break;

            case "medicalLeave":
                if (!(startDate <= yesterday && startDate >= thirtyDaysAgo)) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Medical leave can only be applied for dates between yesterday and the last 30 days.',
                    }));
                    return;
                }

                if (leaveData.totalDays < 1 || leaveData.totalDays > 7) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Medical leave must be applied for a minimum of 1 day and a maximum of 7 days.',
                    }));
                    return;
                }

                if (!file) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Please attach a medical file.',
                    }));
                    return;
                }

                // Clear errors if validation passes
                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    medical: null,
                }));
                break;

            case "optionalLeave":
                break;
            case "earnedLeave":
                // const maxEarnedLeaveDate = new Date(currentDate);
                // maxEarnedLeaveDate.setDate(currentDate.getDate() + 31); // 14 days after today
                if (leaveData.selectTime === 'firstHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 })
                    return;
                }
                if (leaveData.selectTime === 'secondHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 })
                    return;
                }
                if (leaveData.selectTime === 'fullDay') {
                    setLeaveData({ ...leaveData, totalDays: 1 })
                    return;
                }
                // Ensure start date is within the current month
                if (startDate < firstDayOfMonth || startDate > lastDayOfMonth) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave can only be applied within the current month.',
                    }));
                    return;
                }

                // Ensure the start date is within the allowed range
                if (startDate < minEarnedLeaveDate || startDate > maxEarnedLeaveDate) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave can only be applied for dates within 14 days before or after today.',
                    }));
                    return;
                }

                // Ensure the leave duration is between 1 and 14 days
                if (leaveData.totalDays < 1 || leaveData.totalDays > 14) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave must be applied for a minimum of 1 day and a maximum of 14 days.',
                    }));
                    return;
                }

                // Clear errors if validation passes
                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    earned: null,
                }));
                break;

            case "compOffLeave":
                // Now these variables are defined outside and accessible here
                if (leaveData.selectTime === 'firstHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 });
                    return;
                }
                if (leaveData.selectTime === 'secondHalf') {
                    setLeaveData({ ...leaveData, totalDays: 0.5 });
                    return;
                }
                if (leaveData.selectTime === 'fullDay') {
                    setLeaveData({ ...leaveData, totalDays: 1 });
                    return;
                }

                if (startDate < firstDayOfMonth || startDate > lastDayOfMonth) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave can only be applied within the current month.',
                    }));
                    return;
                }

                if (startDate < minEarnedLeaveDate || startDate > maxEarnedLeaveDate) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave can only be applied for dates within 14 days before or after today.',
                    }));
                    return;
                }

                if (leaveData.totalDays < 1 || leaveData.totalDays > 14) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave must be applied for a minimum of 1 day and a maximum of 14 days.',
                    }));
                    return;
                }

                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    earned: null,
                }));
                break;

            default:
                alert('Invalid leave type selected.');
                return;
        }
    }, [leaveData.totalDays, leaveData.leaveType, leaveData.selectTime]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };
            setLeaveTypeError('')
            setTotalDayError('')
            setReasonError('')
            if (name === "startDate" || name === "endDate") {
                const startDate = updatedData.startDate ? new Date(updatedData.startDate) : null;
                const endDate = updatedData.endDate ? new Date(updatedData.endDate) : null;

                if (startDate && (!endDate || endDate < startDate)) {
                    // If only start date is selected or end date is invalid, total days is 1
                    updatedData.totalDays = 1;
                } else if (startDate && endDate && endDate >= startDate) {
                    // If both start and end dates are valid, calculate total days
                    const timeDiff = endDate - startDate;
                    updatedData.totalDays = timeDiff / (1000 * 60 * 60 * 24) + 1; // Include start date
                } else {
                    // Default case for total days
                    updatedData.totalDays = 0;
                }
            }

            return updatedData;
        });
    };

    const getMinDateForLeaveType = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1); // Tomorrow

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 14); // 30 days in the past

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const minEarnedLeaveDate = new Date(currentDate);
        minEarnedLeaveDate.setDate(currentDate.getDate() - 31);

        switch (leaveData.leaveType) {
            case "casualLeave":
                return formatDate(minEarnedLeaveDate > firstDayOfMonth ? minEarnedLeaveDate : firstDayOfMonth); // Can apply from today
            case "medicalLeave":
                return formatDate(minEarnedLeaveDate > firstDayOfMonth ? minEarnedLeaveDate : firstDayOfMonth); // Allow from 31 days ago of current month
            case "earnedLeave":
                return formatDate(minEarnedLeaveDate > firstDayOfMonth ? minEarnedLeaveDate : firstDayOfMonth); // Allow from 31 days ago of current month 
            case "optionalLeave":
                return formatDate(minEarnedLeaveDate > firstDayOfMonth ? minEarnedLeaveDate : firstDayOfMonth); // Allow from 31 days ago of current month 
            case "compOffLeave":
                return formatDate(minEarnedLeaveDate > firstDayOfMonth ? minEarnedLeaveDate : firstDayOfMonth); // Allow from 31 days ago of current month 

            default:
                return formatDate(currentDate); // Default to today
        }
    };

    const getMaxDateForLeaveType = () => {
        // current day code
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        // yesterday  code 
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1); // One day before today

        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const maxEarnedLeaveDate = new Date(currentDate);
        maxEarnedLeaveDate.setDate(currentDate.getDate() + 14);

        switch (leaveData.leaveType) {
            case "casualLeave":
                const casualMaxDate = new Date(currentDate);
                casualMaxDate.setDate(currentDate.getDate() + 7); // Allow within the next 7 days
                return formatDate(casualMaxDate);
            case "optionalLeave":
                return formatDate(maxDate);
            case "medicalLeave":
                return formatDate(yesterday); // Only up to yesterday
            case "earnedLeave":
                return formatDate(maxEarnedLeaveDate < lastDayOfMonth ? maxEarnedLeaveDate : lastDayOfMonth);
            default:
                return null; // No restrictions by default
        }
    };

    // Utility function to format date to "YYYY-MM-DD"
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = new Date(leaveData.startDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to midnight
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1); // Yesterday
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30); // 30 days ago

        const updatedErrors = { ...leaveError };

        if (!leaveData.leaveType) {
            setLeaveTypeError('Please select a leave type.');
            return;
        }

        if (leaveData.totalDays < 0.5) {
            setTotalDayError('You must apply for at least 1 day of leave.');
            return;
        }

        if (leaveData?.leaveType === 'medicalLeave' && !file) {
            setFileError('Please attach documents !!');
            return;
        }

        if (!leaveData?.reason) {
            setReasonError('Reason cannot be empty.');
            return;
        }

        setLeaveError({
            medical: null,
            casual: null,
            earned: null,
        });

        dispatch(
            postApplyLeaveByEmployee({
                leaveType: leaveData?.leaveType,
                leaveStartDate: leaveData?.startDate,
                leaveEndDate: leaveData?.endDate,
                totalDays: leaveData?.totalDays,
                reason: leaveData?.reason,
                approvedBy: managerId,
                employeId: employeeId,
                shift: leaveData?.selectTime,
                location: medicalReport?.location,
            })
        );

    };
    const handelUploadPrescription = () => {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(postMedicalFileAction(formData));
    }
    const convertToDateFormat = () => {
        // Create a new Date object from the input string
        const date = new Date();

        // Format to "YYYY-MM-DD" using toISOString and split
        const formattedDate = date.toISOString().split("T")[0];

        return formattedDate;
    };

    // Example usage
    const inputDate = "Fri Jan 10 2025 12:14:10 GMT+0530 (India Standard Time)";
    const formattedDate = convertToDateFormat(inputDate);
    return (
        <div>
            <ToastContainer />
            {/* Button to Open Modal */}
            <button
                onClick={openModal}
                className="px-2 py-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 M"
            >
                {tittleBtn}
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Modal Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative z-10 p-6">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-10 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <RxCross2 size={20} />
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-xl font-semibold text-gray-800">
                            Apply New Leave
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Only applicable if you have pending leave balance.
                        </p>

                        {/* Form */}
                        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                            {/* Leave Type */}
                            <div>
                                <label
                                    htmlFor="leaveType"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Leave Type<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="leaveType"
                                    name="leaveType"
                                    value={leaveData.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Leave Type</option>

                                    {/* Show Earned Leave only if in notice period */}
                                    {(data?.data?.isNotice === true) && (
                                        leaveBalance?.earnedLeave === '0' ?
                                            <option disabled>Earned Leave / {leaveBalance?.earnedLeave}</option> :
                                            <option value="earnedLeave">Earned Leave / {leaveBalance?.earnedLeave}</option>
                                    )}

                                    {/* Show Casual Leave only if in probation period */}
                                    {(data?.data?.isProbation === true) && (
                                        leaveBalance?.casualLeave === '0' ?
                                            <option disabled>Casual Leave / {leaveBalance?.casualLeave}</option> :
                                            <option value="casualLeave">Casual Leave / {leaveBalance?.casualLeave}</option>
                                    )}
                                    {(data?.data?.isProbation === true) && (
                                        leaveBalance?.compOffLeave === '0' ?
                                            <option disabled>Casual Leave / {leaveBalance?.compOffLeave}</option> :
                                            <option value="compOffLeave">Casual Leave / {leaveBalance?.compOffLeave}</option>
                                    )}
                                    {/* Show all leave types if employee is permanent */}
                                    {(data?.data?.isWorking === true) && (
                                        <>
                                            {leaveBalance?.earnedLeave === '0' ?
                                                <option disabled>Earned Leave / {leaveBalance?.earnedLeave}</option> :
                                                <option value="earnedLeave">Earned Leave / {leaveBalance?.earnedLeave}</option>}
                                            {leaveBalance?.compOffLeave === '0' ?
                                                <option disabled>Comp Off / {leaveBalance?.compOffLeave}</option> :
                                                <option value="compOffLeave">Comp Off / {leaveBalance?.compOffLeave}</option>}
                                            {leaveBalance?.medicalLeave === '0' ?
                                                <option disabled>Medical Leave / {leaveBalance?.medicalLeave}</option> :
                                                <option value="medicalLeave">Medical Leave / {leaveBalance?.medicalLeave}</option>}
                                            {leaveBalance?.paternityLeave === '0' ?
                                                <option disabled>Paternity Leave / {leaveBalance?.paternityLeave}</option> :
                                                <option value="paternityLeave">Paternity Leave / {leaveBalance?.paternityLeave}</option>}
                                            {leaveBalance?.maternityLeave === '0' ?
                                                <option disabled>Maternity Leave / {leaveBalance?.maternityLeave}</option> :
                                                <option value="maternityLeave">Maternity Leave / {leaveBalance?.maternityLeave}</option>}
                                            {leaveBalance?.casualLeave === '0' ?
                                                <option disabled>Casual Leave / {leaveBalance?.casualLeave}</option> :
                                                <option value="casualLeave">Casual Leave / {leaveBalance?.casualLeave}</option>}
                                            <option value='optionalLeave'>Optional Leave</option>
                                        </>
                                    )}
                                </select>
                                <p className="text-red-600 mt-2">{leaveTypeError ? leaveTypeError : ''}</p>
                            </div>

                            {/* Date Range */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="startDate"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={leaveData?.startDate}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={getMinDateForLeaveType()} // Dynamically set the minimum date
                                        max={getMaxDateForLeaveType()} // Dynamically set the maximum date
                                    />
                                </div>
                                {leaveData?.leaveType === "casualLeave" ? null : (
                                    <div className="flex-1">
                                        <label
                                            htmlFor="endDate"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={leaveData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min={leaveData.startDate || getMinDateForLeaveType()} // Start date or minimum valid date
                                            max={getMaxDateForLeaveType()} // Dynamically set the maximum date
                                        />
                                    </div>
                                )}
                            </div>
                            {leaveData.totalDays < 2 ? leaveData.leaveType === 'casualLeave' || leaveData.leaveType === 'earnedLeave' ?
                                <div>
                                    <label
                                        htmlFor="startDate"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Select Duration
                                    </label>
                                    <select
                                        id="selectTime"
                                        name="selectTime"
                                        value={leaveData.selectTime}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option>Select </option>
                                        <option value="firstHalf">First Half</option>
                                        <option value="secondHalf">Second Half</option>
                                        <option value="fullDay">Full Day</option>
                                    </select>
                                </div> : ''
                                : ''}
                            <p class="text-red-600 mt-2">{totalDayError ? totalDayError : ''}</p>
                            {/* Display Total Days */}
                            {leaveData.totalDays > 0 && (
                                <p className="text-sm text-gray-700">
                                    Total Days: {leaveData.totalDays}
                                </p>
                            )}
                            <p class="text-red-600 mt-2">{leaveError?.medical ? leaveError.medical : ''}</p>
                            {leaveData.leaveType === "medicalLeave" && (
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="document">Prescription:</label>
                                    <input
                                        type="file"
                                        id="document"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handelChangeFile}
                                    />
                                    {file ?
                                        <button type="button" onClick={handelUploadPrescription} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{uploadLoading ? 'Uploading...' : 'Upload Prescription'}</button>
                                        : null}
                                </div>
                            )}
                            <p className='text-red-600 mt-2'>{fileError}</p>
                            {/* Reason */}
                            <div>
                                <label
                                    htmlFor="reason"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Reason for Leave
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    rows="4"
                                    value={leaveData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Provide your reason for leave..."
                                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <p className='text-red-600 mt-2'>{reasonError ? reasonError : ''}</p>
                            {/* Footer */}
                            <div className="flex justify-center items-center mt-4">
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Apply For Leave
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateProjectModal;