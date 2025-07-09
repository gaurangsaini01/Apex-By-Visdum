import type { NavigateFunction } from "react-router-dom";
import { showError, showSuccess } from "../../utils/Toast";
import axiosInstance from "../axiosInstance";

export async function addMonitor(values: any, navigate: NavigateFunction) {
    try {
        const res = await axiosInstance.post('/monitors', values)
        if (res?.data?.success) {
            navigate("/dashboard/monitors");
        }
        showSuccess('Monitor Created.')
        return res;
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.errors) {
            showError(err.response.data.errors.join('\n'));
        } else if (err.message === "Network Error") {
            showError("Network error. Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }
}

export async function getMonitors() {
    try {
        const res = await axiosInstance.get('/monitors')
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

export async function getMonitorDetails(monitorId: number) {
    try {
        const res = await axiosInstance.get('/monitors' + `/${monitorId}`)
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

export async function editMonitor(monitorId: string, data: any, navigate: NavigateFunction) {
    try {
        const res = await axiosInstance.put('/monitors' + `/${monitorId}`, data)
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

export async function deleteMonitor(id: number, navigate: NavigateFunction) {
    try {
        const res = await axiosInstance.delete(`/monitors/${id}`);
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

export async function toggleStatus(monitorId: number) {
    try {
        const res = await axiosInstance.patch(`/monitors/${monitorId}/status`, null)
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


export async function getChartData(monitorId, range) {
    try {
        const res = await axiosInstance.get(`/monitor-logs/chart-data?monitor_id=${monitorId}&range=${range}`)
        console.log(res)
    } catch (err: any) {

    }
}