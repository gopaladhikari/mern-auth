import axios from "axios";

import { Cookies } from "react-cookie";

const cookie = new Cookies();

const { accessToken } = cookie.getAll();

const dbUri = import.meta.env.VITE_DB_URI;

export const axiosInstance = axios.create({
  baseURL: `${dbUri}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});
