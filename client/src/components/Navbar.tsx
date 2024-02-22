import { NavLink } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { axiosInstance } from "../conf/axios";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("api/v1/user/logout");
      if (res.status === 200) dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuthenticated) {
    return (
      <header>
        <nav>
          <div className="flex justify-between">
            <NavLink to="/">Home</NavLink>
            <ul className="flex gap-4">
              <li>
                <NavLink to="/dashboard">Profile</NavLink>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
  return (
    <header>
      <nav>
        <div className="flex justify-between">
          <NavLink to="/">Home</NavLink>
          <ul className="flex gap-4">
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
