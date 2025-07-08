import axios from "axios";
import { MONITOR_ENDPOINTS } from "../apis";
import type { NavigateFunction } from "react-router-dom";
import { showError, showSuccess } from "../../utils/Toast";

export async function addMonitor(values: any, token: string, navigate: NavigateFunction) {
    try {
        const res = await axios.post(MONITOR_ENDPOINTS.addMonitor, values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res?.data?.success) {
            navigate("/dashboard/monitors");
        }
        showSuccess('Monitor Created.')
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

export async function getMonitors(token: string) {
    try {
        const res = await axios.get(MONITOR_ENDPOINTS.getMonitors, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res?.data?.success) {
            return res?.data?.data;
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

export async function getMonitorDetails(monitorId: number, token: String) {
    try {
        const res = await axios.get(MONITOR_ENDPOINTS.monitorDetails + `/${monitorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res?.data?.success) {
            return res?.data?.data;
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

export async function editMonitor(monitorId: string, data: any, token: String, navigate: NavigateFunction) {
    try {
        const res = await axios.put(MONITOR_ENDPOINTS.monitorDetails + `/${monitorId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res?.data?.success) {
            navigate('/dashboard/monitors')
            showSuccess('Updated')
            return res?.data?.data;
        }
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

// services/operations/monitor.ts

export async function deleteMonitor(id: number, token: string, navigate: NavigateFunction) {
    try {
        const res = await axios.delete(`${MONITOR_ENDPOINTS.deleteMonitors}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res?.data?.success) {
            showSuccess("Deleted")
            navigate("/dashboard/monitors");
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
};

export async function toggleStatus(monitorId: number, token: string) {
    try {
        const res = await axios.patch(MONITOR_ENDPOINTS.monitorDetails + `/${monitorId}/status`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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