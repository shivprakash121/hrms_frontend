import axios from "axios";
import {
  GET_ATTENDANCE_LOGS_DAY_WISE_FAIL,
  GET_ATTENDANCE_LOGS_DAY_WISE_REQUEST,
  GET_ATTENDANCE_LOGS_DAY_WISE_SUCCESS,
  GET_PUNCHIN_DATA_FAIL,
  GET_PUNCHIN_DATA_REQUEST,
  GET_PUNCHIN_DATA_SUCCESS,
  GET_PUNCH_IN_PUNCH_OUT_FAIL,
  GET_PUNCH_IN_PUNCH_OUT_REQUEST,
  GET_PUNCH_IN_PUNCH_OUT_SUCCESS,
  POST_PUNCHIN_DATA_FAIL,
  POST_PUNCHIN_DATA_REQUEST,
  POST_PUNCHIN_DATA_SUCCESS,
  POST_PUNCHOUT_DATA_FAIL,
  POST_PUNCHOUT_DATA_REQUEST,
  POST_PUNCHOUT_DATA_SUCCESS,
  POST_UPDATE_LOCATION_FAIL,
  POST_UPDATE_LOCATION_REQUEST,
  POST_UPDATE_LOCATION_SUCCESS,
} from "../types/UserDataType";

export const getAttendanceLogsDayWise = () => async (dispatch, getState) => {
  const { allUserData } = getState();
  const token = localStorage.getItem("authToken"); // Get the token from localStorage (or cookies)
  // const employeId = localStorage.getItem("employeId");
  // If token does not exist, do nothing or handle the case
  if (!token) {
    return dispatch({
      type: GET_ATTENDANCE_LOGS_DAY_WISE_REQUEST,
      payload: "Authentication token not found",
    });
  }

  // Prevent duplicate fetch if data already exists
  if (allUserData.data) return;

  try {
    dispatch({ type: GET_ATTENDANCE_LOGS_DAY_WISE_REQUEST });

    // Add token to request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/attendance-logs-day-wise`,
      config
    );
    dispatch({ type: GET_ATTENDANCE_LOGS_DAY_WISE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ATTENDANCE_LOGS_DAY_WISE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const postPunchInDataAction = ({location,imageUrl}) => async (dispatch, getState) => {
  const { allUserData } = getState();
  const token = localStorage.getItem("authToken"); // Get the token from localStorage (or cookies)
  const employeeId = localStorage.getItem("employeId");
  // If token does not exist, do nothing or handle the case
  if (!token) {
    return dispatch({
      type: POST_PUNCHIN_DATA_REQUEST,
      payload: "Authentication token not found",
    });
  }

  // Prevent duplicate fetch if data already exists
  if (allUserData.data) return;

  try {
    dispatch({ type: POST_PUNCHIN_DATA_REQUEST });

    // Add token to request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/punch-in`,
      {employeeId,location,imageUrl},
      config
    );
    dispatch({ type: POST_PUNCHIN_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_PUNCHIN_DATA_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
export const getPunchInDataAction = () => async (dispatch, getState) => {
  const { allUserData } = getState();
  const token = localStorage.getItem("authToken"); // Get the token from localStorage (or cookies)
  const employeId = localStorage.getItem("employeId");
  // If token does not exist, do nothing or handle the case
  if (!token) {
    return dispatch({
      type: GET_PUNCHIN_DATA_REQUEST,
      payload: "Authentication token not found",
    });
  }

  // Prevent duplicate fetch if data already exists
  if (allUserData.data) return;

  try {
    dispatch({ type: GET_PUNCHIN_DATA_REQUEST });

    // Add token to request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/get-log-records/${employeId}`,
      config
    );
    dispatch({ type: GET_PUNCHIN_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PUNCHIN_DATA_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
export const postPunchOutDataAction = ({id}) => async (dispatch, getState) => {
  const { allUserData } = getState();
  const token = localStorage.getItem("authToken"); // Get the token from localStorage (or cookies)
  const employeeId = localStorage.getItem("employeId");
  // If token does not exist, do nothing or handle the case
  if (!token) {
    return dispatch({
      type: POST_PUNCHOUT_DATA_REQUEST,
      payload: "Authentication token not found",
    });
  }

  // Prevent duplicate fetch if data already exists
  if (allUserData.data) return;

  try {
    dispatch({ type: POST_PUNCHOUT_DATA_REQUEST });

    // Add token to request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/punch-out/${id}`,
      {employeeId,location},
      config
    );
    dispatch({ type: POST_PUNCHOUT_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_PUNCHOUT_DATA_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getPnchInPunchOutLogsAction = () => async (dispatch, getState) => {
  const { allUserData } = getState();
  const token = localStorage.getItem("authToken"); // Get the token from localStorage (or cookies)
  const employeId = localStorage.getItem("employeId");
  // If token does not exist, do nothing or handle the case
  if (!token) {
    return dispatch({
      type: GET_PUNCH_IN_PUNCH_OUT_REQUEST,
      payload: "Authentication token not found",
    });
  }

  // Prevent duplicate fetch if data already exists
  if (allUserData.data) return;

  try {
    dispatch({ type: GET_PUNCH_IN_PUNCH_OUT_REQUEST });

    // Add token to request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/get-all-punch-records/${employeId}`,
      config
    );
    dispatch({ type: GET_PUNCH_IN_PUNCH_OUT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PUNCH_IN_PUNCH_OUT_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const postUpdateLocationAction = ({ id, location }) => async (dispatch, getState) => {
  const token = localStorage.getItem("authToken");
  const employeId = localStorage.getItem("employeId");

  if (!token) {
    return dispatch({
      type: POST_UPDATE_LOCATION_REQUEST,
      payload: "Authentication token not found",
    });
  }

  try {
    dispatch({ type: POST_UPDATE_LOCATION_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/update-location/${id}`,
      { location },
      config
    );

    dispatch({ type: POST_UPDATE_LOCATION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_UPDATE_LOCATION_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
