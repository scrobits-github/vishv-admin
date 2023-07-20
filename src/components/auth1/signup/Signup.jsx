import React, { useState } from "react";
import login1 from "../../../assets/images/login.png";
import { Link } from "react-router-dom";
import { app } from "../../../firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import "./signup.css";
export default function Signup() {
  // state variables declaration
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const auth = getAuth()


  const submitForm = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, userName, password)
      .then((res) => {
        console.log(res.user);
        // localStorage.setItem("loggedInFrontend", true);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
      })
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
              <p id="Heading">Signup</p>
              <form className="Input_Field_container" onSubmit={(e) => submitForm(e)}>
                <i className="fa fa-user"></i>
                <input
                  className="Input_fields"
                  type="email"
                  placeholder="Username"
                  name="userName"
                  title="Password must be 8 Characters"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                <i className="fa fa-lock"></i>
                <input
                  className="Input_fields"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input id="Submit-button" type="submit" />
              </form>
              <Link className="create_an_account" to='/signin '>Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
