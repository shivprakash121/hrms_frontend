import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postApplyLeaveByEmployee, postMedicalFileAction } from "../store/action/userDataAction";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
const CreateProjectModal = ({ tittleBtn }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { loading, data } = useSelector((state) => state.userData);
    const { loading: loadingg, data: dataa, error } = useSelector((state) => state.leaveApplyByEmployee)
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
    const managerId = data?.data?.managerId;
    const employeeId = localStorage.getItem('employeId');
    const leaveBalance = data?.data?.leaveBalance;
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

        if (leaveData?.leaveType === '' || leaveData?.startDate === '') {
            setLeaveError((prevErrors) => ({
                ...prevErrors,
                medical: '', // Update the `medical` field
            }));
            return;
        }
        switch (leaveData.leaveType) {
            case "casualLeave":
                if (leaveData.totalDays !== 1) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        casual: 'Casual leave can only be applied for 1 day.', // Update the `casual` field
                    }));
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
                if (startDate > yesterday || startDate < thirtyDaysAgo) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Medical leave can only be applied for dates between yesterday and the last 30 days.', // Update the `medical` field
                    }));
                    return
                }

                if (leaveData.totalDays < 1 || leaveData.totalDays > 7) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Medical leave must be applied for a minimum of 1 days and a maximum of 7 days.', // Update the `medical` field
                    }));
                    return
                }

                if (!!file === null) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        medical: 'Please attach a medical file.', // Update the `medical` field
                    }));
                    return
                }

                // Clear errors if validation passes
                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    medical: null, // Update the `medical` field
                }));

                break;

            case "earnedLeave":
                // Ensure the leave duration is between 1 and 7 days
                if (leaveData.totalDays < 1 || leaveData.totalDays > 7) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave must be applied for a minimum of 1 day and a maximum of 7 days.', // Update the `medical` field
                    }));
                    return

                }

                // Ensure the start date is not today
                if (startDate.toDateString() === currentDate.toDateString()) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave cannot be applied for today..', // Update the `earned` field
                    }));
                    return

                }

                // Ensure the start date is within the range of tomorrow to the next 30 days
                const tomorrow = new Date(currentDate);
                tomorrow.setDate(currentDate.getDate() + 1); // Tomorrow
                const maxDate = new Date(currentDate);
                maxDate.setDate(currentDate.getDate() + 30); // Next 30 days

                if (startDate < tomorrow || startDate > maxDate) {
                    setLeaveError((prevErrors) => ({
                        ...prevErrors,
                        earned: 'Earned leave can only be applied for dates between tomorrow and the next 30 days.', // Update the `earned` field
                    }));
                    return
                }
                // Clear errors if validation passes
                setLeaveError((prevErrors) => ({
                    ...prevErrors,
                    earned: null, // Update the `earned` field
                }));
                break;
            default:
                alert('Invalid leave type selected.');
                return
        }
    }, [leaveData.totalDays]);

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
        thirtyDaysAgo.setDate(currentDate.getDate() - 30); // 30 days in the past

        switch (leaveData.leaveType) {
            case "casualLeave":
                return formatDate(currentDate); // Can apply from today
            case "medicalLeave":
                return formatDate(thirtyDaysAgo); // Allow from 30 days ago
            case "earnedLeave":
                return formatDate(tomorrow); // Can apply starting today
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

        switch (leaveData.leaveType) {
            case "casualLeave":
                const casualMaxDate = new Date(currentDate);
                casualMaxDate.setDate(currentDate.getDate() + 7); // Allow within the next 7 days
                return formatDate(casualMaxDate);
            case "medicalLeave":
                return formatDate(yesterday); // Only up to yesterday

            case "earnedLeave":
                maxDate.setDate(currentDate.getDate() + 30); // Allow up to 30 days from today
                if (leaveData.startDate) {
                    const startDate = new Date(leaveData.startDate);
                    const maxDurationDate = new Date(startDate);
                    maxDurationDate.setDate(startDate.getDate() + 6); // Add 6 days to start date
                    return formatDate(
                        maxDurationDate < maxDate ? maxDurationDate : maxDate
                    );
                }
                return formatDate(maxDate);
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

        if (leaveData.totalDays < 1) {
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

        switch (leaveData.leaveType) {
            case "casualLeave":
                // Casual leave validation...
                break;

            case "medicalLeave":
                // Medical leave validation...
                break;

            case "earnedLeave":
                // Updated earnedLeave case
                if (leaveData.totalDays < 1 || leaveData.totalDays > 7) {
                    updatedErrors.earned = 'Earned leave must be applied for a minimum of 1 day and a maximum of 7 days.';
                    setLeaveError(updatedErrors);
                    return;
                }

                if (startDate.toDateString() === currentDate.toDateString()) {
                    updatedErrors.earned = 'Earned leave cannot be applied for today.';
                    setLeaveError(updatedErrors);
                    return;
                }

                const tomorrow = new Date(currentDate);
                tomorrow.setDate(currentDate.getDate() + 1); // Tomorrow
                const maxDate = new Date(currentDate);
                maxDate.setDate(currentDate.getDate() + 30); // Next 30 days

                if (startDate < tomorrow || startDate > maxDate) {
                    updatedErrors.earned = 'Earned leave can only be applied for dates between tomorrow and the next 30 days.';
                    setLeaveError(updatedErrors);
                    return;
                }

                updatedErrors.earned = null;
                setLeaveError(updatedErrors);
                break;

            default:
                alert('Invalid leave type selected.');
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
            })
        );

        if (leaveData.leaveType === "medicalLeave") {
            setTimeout(() => {
                const formData = new FormData();
                formData.append("file", file);
                dispatch(postMedicalFileAction(formData));
            }, 1000);
        }
    };


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
                                    {leaveBalance?.earnedLeave === '0' ? <option disabled>Earn Leave / {leaveBalance?.earnedLeave} </option> :
                                        <option value="earnedLeave">Earned Leave / {leaveBalance?.earnedLeave} </option>}
                                    {leaveBalance?.medicalLeave === '0' ? <option disabled>Medical Leave / {leaveBalance?.medicalLeave} </option> :
                                        <option value="medicalLeave">Medical Leave / {leaveBalance?.medicalLeave} </option>}
                                    {leaveBalance?.paternityLeave === '0' ? <option disabled>Paternity Leave / {leaveBalance?.paternityLeave} </option> :
                                        <option value="paternityLeave">Paternity Leave / {leaveBalance?.paternityLeave} </option>}
                                    {leaveBalance?.maternityLeave === '0' ? <option disabled>Maternity Leave / {leaveBalance?.maternityLeave} </option> :
                                        <option value="maternityLeave">Maternity Leave / {leaveBalance?.maternityLeave} </option>}
                                    {leaveBalance?.casualLeave === '0' ? <option disabled>Casual Leave / {leaveBalance?.casualLeave} </option> :
                                        <option value="casualLeave">Casual Leave / {leaveBalance?.casualLeave} </option>}
                                    {/* {leaveBalance?.compOffLeave === '0' ? <option disabled>Compoff Leave / {leaveBalance?.compOffLeave} </option> :
                                        <option value="compOffLeave">CompOff Leave / {leaveBalance?.compOffLeave} </option>} */}
                                </select>

                                <p class="text-red-600 mt-2">{leaveTypeError ? leaveTypeError : ''}</p>
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
                                        value={leaveData.startDate}
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
                            <div className="flex justify-between items-center mt-4">
                                <a
                                    href="/help"
                                    className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                    <span className="mr-1">💬</span> more Info?
                                </a>
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