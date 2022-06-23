import { useAuth0 } from "@auth0/auth0-react";

import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  let { isAuthenticated, isLoading, ...rest } = useAuth0();
  let location = useLocation();

  console.log({ isAuthenticated, isLoading, rest });

  if (isLoading) {
    // TODO: Display better loding info
    return <>Loading</>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
