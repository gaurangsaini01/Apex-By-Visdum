import axios from "axios";
import { GROUP_ENDPOINTS, MEMBER_ENDPOINTS } from "../apis";
import { showError, showSuccess } from "../../utils/Toast";

export async function createGroup(token: string, data: { name: string }) {
    try {
        const res = await axios.post(GROUP_ENDPOINTS.addGroup, data, {
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

export async function getGroups(token: String) {
    try {
        const res = await axios.get(GROUP_ENDPOINTS.getGroups, {
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

export async function deleteGroup(token: String, id: number) {
    try {
        const res = await axios.delete(GROUP_ENDPOINTS.deleteGroup + `/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

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

export async function editGroup(token: String, id: number, data) {
    try {
        const res = await axios.put(GROUP_ENDPOINTS.editGroup + `/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

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


export async function getMembers(token: string) {
    try {
        const res = await axios.get(MEMBER_ENDPOINTS.getMembers, {
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

export async function addMembers(token: string, groupId: number, selectedUsersIds: Number[]) {
    try {
        const res = await axios.post(GROUP_ENDPOINTS.addMembers + `/${groupId}/members`, { user_ids: selectedUsersIds }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(res?.data?.success){
            showSuccess('Members Added')
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