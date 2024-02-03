import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

export default function PrivateRoutes() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
}
