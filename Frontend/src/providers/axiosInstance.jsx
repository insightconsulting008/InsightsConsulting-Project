import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://insightsconsult-backend.onrender.com",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if ((err.response?.status === 401 || err.response?.status === 403) && !original._retry) {
      original._retry = true;

      try {
        const res = await axios.post("https://insightsconsult-backend.onrender.com/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;
        sessionStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        sessionStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;