import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from './pages/Home/Home'
import Blogs from "./components/blogs/blogs/Blogs";
import TextEditor from "./components/blogs/textEditor/TextEditor";
import Login from "./components/auth/login/Login";
import Signin from "./components/auth1/signin/Signin";
import Dashboard from "./components/dashboard/Dashboard";
import Signup from "./components/auth1/signup/Signup";
import CreateOpenings from "./components/openings/createOpenings/CreateOpenings";
import BlogDetailsCard from "./components/blogs/blogDetailsCard/BlogDetailsCard";
import AllOpenings from "./components/openings/allOpenings/AllOpenings";
import OpeningDetails from "./components/openings/openingDetails/OpeningDetails";
import ContactPage from "./components/contact";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
