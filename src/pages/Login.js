import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  loginWithRedirect();

  return (
    <>
      {/* <button onClick={() => loginWithRedirect({ redirectUri: `` })}>
        Log In
      </button>
      <p>login</p> */}
    </>
  );
};

export default Login;
