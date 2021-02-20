import React, { useContext } from "react";

import { AuthenticationContext } from "./context/AuthenticationContext";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

const App = () => {
  const { loading, error, user, logout } = useContext(AuthenticationContext);

  if (!user) {
    return (
      <>
        <Register />
        <Login />
      </>
    );
  }

  return (
    <section>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <pre>{user && <p>Hello {user.email}</p>}</pre>

      <button onClick={logout}>Logout</button>
    </section>
  );
};

export default App;
