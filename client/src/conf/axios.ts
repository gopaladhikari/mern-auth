import axios from "axios";

import { Cookies } from "react-cookie";
import { env } from "./env";

export const cookieStore = new Cookies();

const { accessToken } = cookieStore.getAll();

export const axiosInstance = axios.create({
  baseURL: `${env.dbUri}/api/v1`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
