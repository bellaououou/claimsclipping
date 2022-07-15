import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Test from "./pages/Test";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

const App = () => {
  return (
    <div className="App">
      <Auth0Provider
        domain="dev-i0roppevd.au.auth0.com"
        clientId="YjgUOSLqg9hSM33DC3XwRl3HKrmDMyEP"
        redirectUri={window.location.origin}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </div>
  );
};

export default App;
