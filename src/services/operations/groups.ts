import axios from "axios";
import { GROUP_ENDPOINTS, MEMBER_ENDPOINTS } from "../apis";
import { showError, showSuccess } from "../../utils/Toast";

export async function createGroup(token: string, data) {
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

export async function addMember(token: String, groupId: number, data) {
    try {
        const res = await axios.post(MEMBER_ENDPOINTS.addMember + `/${groupId}/members`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (res?.data?.success) {
            showSuccess('Added User !')
            return res?.data
        }
    } catch (err: any) {
        if (err.response?.data?.errors?.email) {
            showError(err.response.data?.errors.email[0]);
        } else if (err.message === "Network Error") {
            showError("Network error. Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }
}

export async function deleteMember(token: string, groupId: number, memberId: number) {
    try {
        const res = await axios.delete(MEMBER_ENDPOINTS.addMember + `/${groupId}/members/${memberId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res?.data?.success) {
            showSuccess('Member Deleted!')
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

export async function editMember(groupId, userId, values, token) {
    try {
        const res = await axios.put(MEMBER_ENDPOINTS.editGroup + `/${groupId}/members/${userId}`, values, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res?.data?.success) {
            showSuccess('Edited')
            return res?.data
        }
    } catch (err: any) {
        if (err.response?.data?.errors.email) {
            showError(err.response.data.errors.email[0]);
        } else if (err.message === "Network Error") {
            showError("Network error. Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }

}
