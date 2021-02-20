import { useState, useEffect, createContext } from "react";

import { getCSRFToken } from "../utilities/utilities";

const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/user", { credentials: "include" });

        const user = await response.json();

        if (!response.ok) throw new Error();

        setUser(user);
      } catch (error) {
        // TODO: ...
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const user = await response.json();

      if (!response.ok) throw new Error(user.error);

      setUser(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const user = await response.json();

      if (!response.ok) throw new Error(user.error);

      setUser(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const user = await response.json();

      if (!response.ok) throw new Error(user.error);

      setUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ loading, error, user, register, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
