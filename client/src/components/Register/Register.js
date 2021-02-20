import React, { useState, useContext } from "react";

import { AuthenticationContext } from "../../context/AuthenticationContext";

const Register = () => {
  const [email, setEmail] = useState("bob@domain.tld");
  const [password, setPassword] = useState("longsecurepassword");

  const { loading, error, register } = useContext(AuthenticationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    register(email, password);
  };

  return (
    <section>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
    </section>
  );
};

export default Register;
