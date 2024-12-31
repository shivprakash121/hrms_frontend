import { configureStore } from "@reduxjs/toolkit";
import { loginUserReducer, singleUserDataReducer, allEmployeeDataReducer, attendanceEmployeeReducer, getEmployeeLeaveStatusReducer, getHolidaysListReducer, getLeaveApproveReducer, getCompoffLeaveApprovalReducer, getPublicDocumentReduce, postLeaveApplyByEmployeReducer, deleteLeaveRequestReducer, leaveApproveByManagerReducer, postApplyCompoffLeaveReducer, putCompoffLeaveReducer, getCompoffLeaveDataReducer, getTeammateDataReducer, getEmployeePrivateReducer } from "./reducer/UserDataReducer";

const store = configureStore({
  reducer: {
    userData: singleUserDataReducer, // Reducer for single user data
    loginData: loginUserReducer,    // Reducer for login data
    allUserData: allEmployeeDataReducer,
    attendanceLogs:attendanceEmployeeReducer,
    employeeLeaveStatus:getEmployeeLeaveStatusReducer,
    holidaysData:getHolidaysListReducer,
    managerLeaveApprove:getLeaveApproveReducer,
    compoffApprove:getCompoffLeaveApprovalReducer,
    employeeDocument:getPublicDocumentReduce,
    leaveApplyByEmployee:postLeaveApplyByEmployeReducer,
    deleteLeaveByEmoployee:deleteLeaveRequestReducer,
    leaveApproveByManager:leaveApproveByManagerReducer,
    compoffReducer:postApplyCompoffLeaveReducer,
    approveCompoffByManager:putCompoffLeaveReducer,
    compoffData:getCompoffLeaveDataReducer,
    teammateData:getTeammateDataReducer,
    privateDocument:getEmployeePrivateReducer,
  },
});

export default store;
