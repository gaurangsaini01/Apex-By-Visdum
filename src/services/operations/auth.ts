import axios from "axios"
import { AUTH_ENDPOINTS } from "../apis"
import { setToken, setUserData } from "../../store/slices/authSlice";
import { showError, showSuccess } from "../../utils/Toast";
import type { LoginData } from "../../pages/Login"
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../../store/store";

export async function login(values: LoginData, navigate: NavigateFunction, dispatch: AppDispatch) {
    try {
        const res = await axios.post(AUTH_ENDPOINTS.login, values)
        if (res?.data?.success && res.data.token && res.data.user) {
            dispatch(setToken(res?.data?.token));
            dispatch(setUserData(res?.data?.user));
            navigate("/dashboard/monitors");
        }
        showSuccess('Logged in')
        return res;
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.message) {
            showError(err.response.data.message);
        } else if (err.message === "Network Error") {
            showError("Network error. Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }
}
export async function logout(token: String, navigate: NavigateFunction, dispatch: AppDispatch) {
    try {
        const res = await axios.post(AUTH_ENDPOINTS.logout, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res?.data)
        if (res?.data?.success) {
            dispatch(setUserData(null))
            dispatch(setToken(null))
            navigate('/')
            showSuccess('Logged Out')
        }
    } catch (err: any) {
        if (err.response?.data?.message) {
            showError(err.response.data.message);
        } else if (err.message === "Network Error") {
            showError("Network error. Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }
}