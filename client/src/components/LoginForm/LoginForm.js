import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";

import { AuthenticationContext } from "../../context/AuthenticationContext";

const LoginForm = () => {
  const [email, setEmail] = useState("me@louisyoung.co.uk");
  const [password, setPassword] = useState("longsecurepassword");

  const { loading, error, login } = useContext(AuthenticationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    login(email, password);
  };

  return (
    <section>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>

      <Link to="/forgot-password">Forgot Password</Link>
    </section>
  );
};

export default LoginForm;
