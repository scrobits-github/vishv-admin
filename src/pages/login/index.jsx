import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    currentUser: {
      emailId: "",
      password: "",
    },
  });
  const handleInput = (e) => {
    setUserDetails({
      currentUser: {
        ...userDetails?.currentUser,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      userDetails?.currentUser?.emailId === "admin@gmail.com" &&
      userDetails?.currentUser?.password === "12345678"
    ) {
      localStorage.setItem("loggedIn", "true");
      navigate("/projects");
    } else {
      alert("Incorrect Username or Password");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      navigate("/projects");
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="emailId"
          type="text"
          required
          onChange={handleInput}
          value={userDetails.currentUser?.emailId}
        />
        <input
          name="password"
          type="text"
          required
          onChange={handleInput}
          value={userDetails.currentUser?.password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
