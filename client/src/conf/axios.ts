import axios from "axios";

const dbUri = import.meta.env.VITE_DB_URI;

export const axiosInstance = axios.create({
  baseURL: `${dbUri}/api/v1`,
  withCredentials: true,
});
