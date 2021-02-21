import React, { useState, useContext } from "react";

import { AuthenticationContext } from "../../context/AuthenticationContext";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("me@louisyoung.co.uk");

  const { loading, error, forgotPassword, message } = useContext(AuthenticationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    forgotPassword(email);
  };

  return (
    <section>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button type="submit">Send Password Reset Email</button>
      </form>
    </section>
  );
};

export default ForgotPasswordForm;
