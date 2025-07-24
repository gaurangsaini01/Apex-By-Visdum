import axiosInstance from "../axiosInstance";
import { showError, showSuccess } from "../../utils/Toast";

export async function getUsers() {
    try {
        const res = await axiosInstance.get('/users')
        if (res?.data?.success) {
            return res?.data
        }
    } catch (err:any) {
        const errorMsg = err.response?.data?.errors.join('\n');
        showError(errorMsg);
    }
}

export async function addUsers(data) {
    try {
        const res = await axiosInstance.post('/users', data);
        if (res?.data?.success) {
            showSuccess('Created user successfully')
            return res?.data;
        }
    } catch (err: any) {
        const errorMsg = err.response?.data?.errors?.join('\n');
        showError(errorMsg);
    }
}
export async function editUser(data,id) {
    try {
        const res = await axiosInstance.put(`/users/${id}`, data);
        if (res?.data?.success) {
            return res?.data;
        }
    } catch (err: any) {
        const errorMsg = err.response?.data?.errors?.join('\n');
        showError(errorMsg);
    }
}
export async function deleteUser(id) {
    try {
        const res = await axiosInstance.delete(`/users/${id}`);
        if (res?.data?.success) {
            showSuccess('Deleted User')
            return res?.data;
        }
    } catch (err: any) {
        const errorMsg = err.response?.data?.errors?.join('\n');
        showError(errorMsg);
    }
}