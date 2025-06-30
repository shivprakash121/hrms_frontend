import axios from "axios";
import {
  LOGIN_USER_FAIL,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
} from "../types/UserDataType";

export const loginUserDataAction =
  ({ email, password, rememberMe }) =>
  async (dispatch) => {
    try {
      // Dispatch login request action
      dispatch({ type: LOGIN_USER_REQUEST });

      // Make API call to login
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/employee/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Store token in localStorage
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("employeId", data?.data.employeeId);

        console.log("dataaaa", data);
      } else {
        throw new Error("Token is missing from response");
      }
      if (rememberMe === true) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
        localStorage.setItem("rememberMe", true);
      }
      else if(rememberMe === false){
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("rememberMe");
      }
      // Dispatch login success action with user data
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
      if (data?.statusCode === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      // Dispatch login failure action with error message
      dispatch({
        type: LOGIN_USER_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };
