import { NavLink } from "react-router-dom";

export default function Navbar() {
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
