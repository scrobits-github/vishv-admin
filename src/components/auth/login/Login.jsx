import React, { useState } from "react";
import login1 from "../../../assets/images/login.png";
import { Link } from "react-router-dom";

import "./Login.css";
export default function Login() {
  // state variables declaration
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // methods
  const onChange = (e) => {
    if (e.target.name === "userName") {
      setUserName(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (userName === "admin" && password === "12345") {
      localStorage.setItem("loggedIn", true);
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="Login-Page">
        <div className="Login_Page_Container">
          <div className="Login-Image_Container">
            <img className="login-image" src={login1} alt="illustrations" />
          </div>

          <div className="Login-Input_fields-container">
            <div className="Login-Form-wrapper">
              <p id="Heading">Login</p>
              <form className="Input_Field_container" onSubmit={submitForm}>
                <i className="fa fa-user"></i>
                <input
                  className="Input_fields"
                  type="text"
                  placeholder="Username"
                  name="userName"
                  title="Password must be 8 Characters"
                  value={userName}
                  onChange={onChange}
                />

                <i className="fa fa-lock"></i>
                <input
                  className="Input_fields"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={onChange}
                />
                <input id="Submit-button" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
