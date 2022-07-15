import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";

import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  let { isAuthenticated, isLoading, ...rest } = useAuth0();
  let location = useLocation();

  if (isLoading) {
    // TODO: Display better loding info
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="flex justify-center flex-wrap text-center gap-y-2">
          <div className="w-full">
            <CircularProgress size={35} />
          </div>
          <p className="w-full text-xl font-semibold">Redirecting</p>
        </div>
      </div>
    );
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
