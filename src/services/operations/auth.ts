import { setToken, setUserData } from "../../store/slices/authSlice";
import { showError, showSuccess } from "../../utils/Toast";
import type { LoginData } from "../../pages/Login"
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import axiosInstance from "../axiosInstance";

export async function login(values: LoginData, navigate: NavigateFunction, dispatch: AppDispatch) {
    try {
        const res = await axiosInstance.post('/login', values)
        if (res?.data?.success && res.data.token && res.data.user) {
            dispatch(setToken(res?.data?.token));
            dispatch(setUserData(res?.data?.user));
            navigate("/dashboard/monitors");
        }
        showSuccess("Logged In Successfully!")
        return res;
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
export async function logout(navigate: NavigateFunction, dispatch: AppDispatch) {
    try {
        const res = await axiosInstance.post('/logout', null)
        if (res?.data?.success) {
            dispatch(setUserData(null))
            dispatch(setToken(null))
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            navigate('/')
            showSuccess('Logged Out Successfully!')
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