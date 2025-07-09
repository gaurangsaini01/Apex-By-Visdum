export const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL
export const AUTH_ENDPOINTS = {
    login: BASE_URL + "/api/login",
    logout: BASE_URL + "/api/logout"
}
export const MONITOR_ENDPOINTS = {
    addMonitor: BASE_URL + '/api/monitors',
    getMonitors: BASE_URL + '/api/monitors',
    monitorDetails: BASE_URL + '/api/monitors',
    deleteMonitors: BASE_URL + '/api/monitors'
}

export const GROUP_ENDPOINTS = {
    addGroup: BASE_URL + '/api/groups',
    getGroups: BASE_URL + '/api/groups',
    deleteGroup: BASE_URL + '/api/groups',
    editGroup: BASE_URL + '/api/groups',
    addMembers: BASE_URL + '/api/groups'
}

export const MEMBER_ENDPOINTS = {
    getMembers: BASE_URL + '/api/users/email-verified',
}