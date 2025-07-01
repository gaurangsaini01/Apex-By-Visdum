// src/utils/toast.ts
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 1000,
  theme:"dark",
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: true,
};

export const showSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, { ...defaultOptions, ...options });

export const showError = (message: string, options?: ToastOptions) =>
  toast.error(message, { ...defaultOptions, ...options });

export const showInfo = (message: string, options?: ToastOptions) =>
  toast.info(message, { ...defaultOptions, ...options });

export const showWarning = (message: string, options?: ToastOptions) =>
  toast.warning(message, { ...defaultOptions, ...options });
