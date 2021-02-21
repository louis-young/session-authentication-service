import { useState, useEffect, createContext } from "react";

import { useLocation, useHistory } from "react-router-dom";

import { getCSRFToken } from "../utilities/utilities";

const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(false);

  const location = useLocation();

  const history = useHistory();

  const redirectToDashboard = () => {
    history.push("/dashboard");
  };

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [location]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setAuthenticating(true);
        setError(null);

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user`, { credentials: "include" });

        const user = await response.json();

        if (!response.ok) throw new Error();

        setUser(user);
      } catch (error) {
        console.error(error.message);
      } finally {
        setAuthenticating(false);
      }
    };

    checkLoginStatus();
  }, []);

  const register = async (email, password) => {
    try {
      setAuthenticating(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/register`, {
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

      redirectToDashboard();
    } catch (error) {
      setError(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthenticating(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
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

      redirectToDashboard();
    } catch (error) {
      setError(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      setAuthenticating(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const user = await response.json();

      if (!response.ok) throw new Error(user.error);

      setUser(null);

      history.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const sent = await response.json();

      if (!response.ok) throw new Error(sent.error);

      setMessage(sent.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const resetPassword = async (email, token, password) => {
    try {
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ email, token, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCSRFToken(),
        },
      });

      const user = await response.json();

      if (!response.ok) throw new Error(user.error);

      setUser(user);

      redirectToDashboard();
    } catch (error) {
      setError(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{ authenticating, error, user, register, login, logout, forgotPassword, message, resetPassword }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
