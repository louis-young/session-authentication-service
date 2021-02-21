import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const Header = () => {
  const { loading, error, user, logout } = useContext(AuthenticationContext);

  return (
    <header>
      <h2>Authentication</h2>

      <pre>{user && <p>{user.email}</p>}</pre>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </header>
  );
};

export default Header;
