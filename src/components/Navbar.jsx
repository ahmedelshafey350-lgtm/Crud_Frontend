import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Navbar() {
  const { token, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="bar">
      <strong className="brand">Course Hub</strong>
      <nav>
        {token ? (
          <>
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/users">Users</NavLink>
            <button className="ghost" onClick={() => { logout(); nav("/login"); }}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Create account</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
