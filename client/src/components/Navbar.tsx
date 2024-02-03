import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../redux/store";
import { getCurrentUser } from "../lib/getCurrentUser";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { logoutUser } from "../lib/logOutUser";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await getCurrentUser();
        if (user) dispatch(login(user));
      } catch (error) {
        throw new Error("Failed to get current user");
      }
    })();
  }, [dispatch]);

  const handleLogout = async () => {
    const res = await logoutUser();
    if (!res.ok) throw new Error("Failed to logout");
    dispatch(logout());
  };

  if (isAuthenticated) {
    return (
      <header>
        <nav>
          <div className="flex justify-between">
            <NavLink to="/">Home</NavLink>
            <ul className="flex gap-4">
              <li>
                <NavLink to="/profile">Profile</NavLink>
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
