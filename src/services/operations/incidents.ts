import { showError } from "../../utils/Toast";
import axiosInstance from "../axiosInstance";

export async function getAllIncidents() {
    try {
        const res = await axiosInstance.get('/incidents-all')
        if (res?.data?.success) {
            return res?.data
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