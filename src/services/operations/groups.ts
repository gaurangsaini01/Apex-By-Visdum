import { showError, showSuccess } from "../../utils/Toast";
import axiosInstance from "../axiosInstance";

export async function createGroup(data: { name: string }) {
    try {
        const res = await axiosInstance.post('/groups', data)

        if (res?.data?.success) {
            showSuccess("Group Created Successfully")
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

export async function getGroups() {
    try {
        const res = await axiosInstance.get('/groups');
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

export async function deleteGroup(id: number) {
    try {
        const res = await axiosInstance.delete('/groups' + `/${id}`)

        if (res?.data?.success) {
            showSuccess('Deleted')
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

export async function editGroup(id: number, data: { name: string }) {
    try {
        const res = await axiosInstance.put('/groups' + `/${id}`, data)

        if (res?.data?.success) {
            showSuccess('Edited')
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


export async function getMembers() {
    try {
        const res = await axiosInstance.get('/users/email-verified')
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

export async function addMembers(groupId: number, selectedUsersIds: Number[]) {
    try {
        const res = await axiosInstance.post(`/groups/${groupId}/members`, { user_ids: selectedUsersIds })
        if (res?.data?.success) {
            showSuccess('Members Updated')
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