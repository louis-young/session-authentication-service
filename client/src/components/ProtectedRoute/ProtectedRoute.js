import React, { useContext } from "react";

import { Redirect, Route } from "react-router-dom";

import { AuthenticationContext } from "../../context/AuthenticationContext";

const ProtectedRoute = ({ component: Component, path, exact }) => {
  const { authenticating, user } = useContext(AuthenticationContext);

  if (authenticating) {
    return <p>Authenticating...</p>;
  }

  return user ? <Route path={path} exact={exact} component={Component} /> : <Redirect to="/login" />;
};
export default ProtectedRoute;
