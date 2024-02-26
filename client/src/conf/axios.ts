import axios from "axios";

import { Cookies } from "react-cookie";

export const cookieStore = new Cookies();

const { accessToken } = cookieStore.getAll();

const dbUri = import.meta.env.VITE_DB_URI;

export const axiosInstance = axios.create({
  baseURL: `${dbUri}/api/v1`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
