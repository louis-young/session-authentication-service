import React, { useState, useEffect, useContext } from "react";

import { useLocation } from "react-router-dom";

import { AuthenticationContext } from "../../context/AuthenticationContext";

const ResetPasswordForm = () => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("longsecurepassword");

  const { authenticating, error, resetPassword, message } = useContext(AuthenticationContext);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const token = searchParams.get("token");

    setToken(token);

    const email = searchParams.get("email");

    setEmail(email);
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetPassword(email, token, password);
  };

  return (
    <section>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="token" type="text" value={token} required readOnly hidden />
        <input name="email" type="email" value={email} required readOnly hidden />
        <label>
          New Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={authenticating}>
          Reset Password
        </button>
      </form>
    </section>
  );
};

export default ResetPasswordForm;
