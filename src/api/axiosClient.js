// src/lib/axiosClient.js
import axios from "axios";
import { auth } from "../services/firebase";

// Tell axios to hit “/api” (not the full functions URL)
const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Axios Authorization header:', config.headers.Authorization);
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          message = 'Bad request. Please check your input.';
          break;
        case 401:
          message = 'You are not authorized. Please log in.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'A server error occurred. Please try again later.';
          break;
        default:
          message = error.response.data?.message || `Error ${status}: Something went wrong.`;
      }
    } else if (error.request) {
      message = 'No response from server. Please check your network connection.';
    } else {
      message = error.message;
    }
    // Attach user-friendly message for UI display
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default axiosClient;
