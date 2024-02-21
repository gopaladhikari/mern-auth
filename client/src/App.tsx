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
import { login } from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosInstance.get("api/v1/user/get-current-user");
        if (res.status === 200) {
          const user = res.data.data.user;
          dispatch(login(user));
        }
      } catch (error) {
        console.error(error);
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
          <Route element={<PrivateRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
