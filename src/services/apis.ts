import { getMonitors } from "./operations/monitor"

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL
export const AUTH_ENDPOINTS = {
    login: BASE_URL + "/api/login",
    logout: BASE_URL + "/api/logout"
}
export const MONITOR_ENDPOINTS = {
    addMonitor:BASE_URL+'/api/monitors',
    getMonitors:BASE_URL+'/api/monitors',
    monitorDetails:BASE_URL+'/api/monitors'
}