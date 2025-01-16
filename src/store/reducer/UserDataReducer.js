import {
  ALL_EMPLOYEE_DATA_FAIL,
  ALL_EMPLOYEE_DATA_REQUEST,
  ALL_EMPLOYEE_DATA_SUCCESS,
  DELETE_LEAVE_REQUEST_FAIL,
  DELETE_LEAVE_REQUEST_REQUEST,
  DELETE_LEAVE_REQUEST_SUCCESS,
  GET_ALL_EMPLOYEE_ATTENDANCE_FAIL,
  GET_ALL_EMPLOYEE_ATTENDANCE_REQUEST,
  GET_ALL_EMPLOYEE_ATTENDANCE_SUCCESS,
  GET_ATTENDANCE_LOGS_OF_EMPLOYEES_FAIL,
  GET_ATTENDANCE_LOGS_OF_EMPLOYEES_REQUEST,
  GET_ATTENDANCE_LOGS_OF_EMPLOYEES_SUCCESS,
  GET_CALENDER_LOGS_API_FAIL,
  GET_CALENDER_LOGS_API_REQUEST,
  GET_CALENDER_LOGS_API_SUCCESS,
  GET_COMPOFF_DATA_FAIL,
  GET_COMPOFF_DATA_REQUEST,
  GET_COMPOFF_DATA_SUCCESS,
  GET_COMPOFF_LEAVE_APPROVAL_FAIL,
  GET_COMPOFF_LEAVE_APPROVAL_REQUEST,
  GET_COMPOFF_LEAVE_APPROVAL_SUCCESS,
  GET_EMPLOYEE_LEAVE_STATUS_FAIL,
  GET_EMPLOYEE_LEAVE_STATUS_REQUEST,
  GET_EMPLOYEE_LEAVE_STATUS_SUCCESS,
  GET_EMPLOYEE_PRIVATE_DOC_FAIL,
  GET_EMPLOYEE_PRIVATE_DOC_REQUEST,
  GET_EMPLOYEE_PRIVATE_DOC_SUCCESS,
  GET_HOLIDAYS_DATA_FAIL,
  GET_HOLIDAYS_DATA_REQUEST,
  GET_HOLIDAYS_DATA_SUCCESS,
  GET_LEAVE_REQUEST_FAIL,
  GET_LEAVE_REQUEST_REQUEST,
  GET_LEAVE_REQUEST_SUCCESS,
  GET_PUBLIC_DOCUMENTS_FAIL,
  GET_PUBLIC_DOCUMENTS_REQUEST,
  GET_PUBLIC_DOCUMENTS_SUCCESS,
  GET_TEAMMATE_DATA_FAIL,
  GET_TEAMMATE_DATA_REQUEST,
  GET_TEAMMATE_DATA_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  POST_APPLY_COMPOFF_LEAVE_FAIL,
  POST_APPLY_COMPOFF_LEAVE_REQUEST,
  POST_APPLY_COMPOFF_LEAVE_SUCCESS,
  POST_APPLY_REGULARIZE_FAIL,
  POST_APPLY_REGULARIZE_REQUEST,
  POST_APPLY_REGULARIZE_SUCCESS,
  POST_CONFIRM_PASSWORD_FAIL,
  POST_CONFIRM_PASSWORD_REQUEST,
  POST_CONFIRM_PASSWORD_SUCCESS,
  POST_LEAVE_APPLY_BY_EMPLOYEE_FAIL,
  POST_LEAVE_APPLY_BY_EMPLOYEE_REQUEST,
  POST_LEAVE_APPLY_BY_EMPLOYEE_SUCCESS,
  POST_OTP_VERIFICATION_FAIL,
  POST_OTP_VERIFICATION_REQUEST,
  POST_OTP_VERIFICATION_SUCCESS,
  POST_SEND_OTP_WITH_EMAIL_FAIL,
  POST_SEND_OTP_WITH_EMAIL_REQUEST,
  POST_SEND_OTP_WITH_EMAIL_SUCCESS,
  PUT_COMPOFF_LEAVE_STATUS_FAIL,
  PUT_COMPOFF_LEAVE_STATUS_REQUEST,
  PUT_COMPOFF_LEAVE_STATUS_SUCCESS,
  PUT_LEAVE_APPROVAL_BY_MANAGER_FAIL,
  PUT_LEAVE_APPROVAL_BY_MANAGER_REQUEST,
  PUT_LEAVE_APPROVAL_BY_MANAGER_SUCCESS,
  SINGLE_USER_DATA_FAIL,
  SINGLE_USER_DATA_REDUCER,
  SINGLE_USER_DATA_SUCCESS,
} from "../types/UserDataType";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const singleUserDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SINGLE_USER_DATA_REDUCER:
      return { ...state, loading: true, error: null };

    case SINGLE_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case SINGLE_USER_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const loginUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case LOGIN_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const allEmployeeDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_EMPLOYEE_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case ALL_EMPLOYEE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case ALL_EMPLOYEE_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const attendanceEmployeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ATTENDANCE_LOGS_OF_EMPLOYEES_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_ATTENDANCE_LOGS_OF_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_ATTENDANCE_LOGS_OF_EMPLOYEES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getEmployeeLeaveStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE_LEAVE_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_EMPLOYEE_LEAVE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_EMPLOYEE_LEAVE_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};


export const getHolidaysListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HOLIDAYS_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_HOLIDAYS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_HOLIDAYS_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getLeaveApproveReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LEAVE_REQUEST_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_LEAVE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getCompoffLeaveApprovalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPOFF_LEAVE_APPROVAL_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_COMPOFF_LEAVE_APPROVAL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_COMPOFF_LEAVE_APPROVAL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getPublicDocumentReduce = (state = initialState, action) => {
  switch (action.type) {
    case GET_PUBLIC_DOCUMENTS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PUBLIC_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_PUBLIC_DOCUMENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const postLeaveApplyByEmployeReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LEAVE_APPLY_BY_EMPLOYEE_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_LEAVE_APPLY_BY_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_LEAVE_APPLY_BY_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const deleteLeaveRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_LEAVE_REQUEST_REQUEST:
      return { ...state, loading: true, error: null };

    case DELETE_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case DELETE_LEAVE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const leaveApproveByManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case PUT_LEAVE_APPROVAL_BY_MANAGER_REQUEST:
      return { ...state, loading: true, error: null };

    case PUT_LEAVE_APPROVAL_BY_MANAGER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case PUT_LEAVE_APPROVAL_BY_MANAGER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const postApplyCompoffLeaveReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_APPLY_COMPOFF_LEAVE_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_APPLY_COMPOFF_LEAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_APPLY_COMPOFF_LEAVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const putCompoffLeaveReducer = (state = initialState, action) => {
  switch (action.type) {
    case PUT_COMPOFF_LEAVE_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case PUT_COMPOFF_LEAVE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case PUT_COMPOFF_LEAVE_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getCompoffLeaveDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPOFF_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_COMPOFF_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_COMPOFF_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getTeammateDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMMATE_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_TEAMMATE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_TEAMMATE_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};


export const getEmployeePrivateReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE_PRIVATE_DOC_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_EMPLOYEE_PRIVATE_DOC_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_EMPLOYEE_PRIVATE_DOC_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const postSendOtpWithEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_SEND_OTP_WITH_EMAIL_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_SEND_OTP_WITH_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_SEND_OTP_WITH_EMAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const otpVerificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_OTP_VERIFICATION_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_OTP_VERIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_OTP_VERIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const postConfirmPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_CONFIRM_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_CONFIRM_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_CONFIRM_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};


export const getCalenderLogsApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CALENDER_LOGS_API_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_CALENDER_LOGS_API_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_CALENDER_LOGS_API_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const postRegularizeReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_APPLY_REGULARIZE_REQUEST:
      return { ...state, loading: true, error: null };

    case POST_APPLY_REGULARIZE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case POST_APPLY_REGULARIZE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getAllEmployeeAttendanceeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EMPLOYEE_ATTENDANCE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_ALL_EMPLOYEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_ALL_EMPLOYEE_ATTENDANCE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};