import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./routes/privateRoutes";
import Layout from "./pages/Layout";
import VerifyEmail from "./pages/VerifyEmail";
import { useEffect } from "react";
import { axiosInstance } from "./conf/axios";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";
import RequestForgotPassword from "./pages/RequestForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AxiosError } from "axios";
import { cookieStore } from "./conf/axios";

export default function App() {
  const dispatch = useDispatch();
  const { refreshToken } = cookieStore.getAll();

  const options = {
    secure: true,
    path: "/",
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosInstance.get("/user/get-current-user");
        if (res.data) {
          const user = res.data.data.user;
          dispatch(login(user));
        } else dispatch(logout());
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;

        if (status === 401) {
          const res = await axiosInstance.post(
            "/user/refresh-access-and-refresh-token",
            { refreshToken }
          );
          if (res.data) {
            const { accessToken, refreshToken, user } = res.data.data;

            cookieStore.set("refreshToken", refreshToken, {
              ...options,
              maxAge: 24 * 60 * 60,
            });
            cookieStore.set("accessToken", accessToken, {
              ...options,
              maxAge: 4 * 60 * 60,
            });

            dispatch(login(user));
          }
        }
      }
    };
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<VerifyEmail />} />
          <Route path="reset" element={<ResetPassword />} />
          <Route
            path="request-forgot-password"
            element={<RequestForgotPassword />}
          />
          <Route element={<PrivateRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
