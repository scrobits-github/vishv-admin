// Functionality imports
import React from "react";
// UI imports
import LoginComponent from "../../components/login";
import { Helmet } from "react-helmet";

function Login() {
  return (
    <div>
      <Helmet>
				<title>Login | Vishv architects</title>
			</Helmet>
      <LoginComponent />
    </div>
  );
}

export default Login;
