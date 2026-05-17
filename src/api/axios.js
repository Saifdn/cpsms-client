import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
 
    // If backend says EP not connected, redirect to OAuth automatically
    if (error.response?.status === 403 && data?.code === "EP_NOT_CONNECTED") {
      window.location.href = data.authUrl;
      // Return a forever-pending promise so the calling mutation/query doesn't
      // continue or trigger onError while the redirect is happening
      return new Promise(() => {});
    }
 
    return Promise.reject(error);
  }
);

export default axiosInstance